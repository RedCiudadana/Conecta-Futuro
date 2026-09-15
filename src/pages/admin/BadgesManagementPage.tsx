import React, { useEffect, useState } from 'react';
import { Plus, Save, X, Pencil, Trash2, Award, Search } from 'lucide-react';
import {
  getBadges, createBadge, updateBadge, deleteBadge,
  BADGE_COLORS, BADGE_TYPE_LABELS,
} from '../../services/badgeService';
import type { Badge } from '../../services/badgeService';

interface BadgeForm {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  badge_type: Badge['badge_type'];
  criteria: string;
}

const emptyForm: BadgeForm = {
  name: '', slug: '', description: '', icon: 'award', color: 'sky',
  badge_type: 'manual', criteria: '{}',
};

const BadgesManagementPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BadgeForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Badge | null>(null);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => { loadBadges(); }, []);

  async function loadBadges() {
    setLoading(true);
    try { setBadges(await getBadges()); } catch {}
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  }

  function openEdit(b: Badge) {
    setEditingId(b.id);
    setForm({
      name: b.name,
      slug: b.slug,
      description: b.description || '',
      icon: b.icon,
      color: b.color,
      badge_type: b.badge_type,
      criteria: JSON.stringify(b.criteria, null, 2),
    });
    setShowForm(true);
  }

  function handleNameChange(name: string) {
    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(prev => ({ ...prev, name, ...(editingId ? {} : { slug }) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      let criteria = {};
      try { criteria = JSON.parse(form.criteria); } catch {}

      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        icon: form.icon,
        color: form.color,
        badge_type: form.badge_type,
        criteria,
      };

      if (editingId) {
        await updateBadge(editingId, payload);
      } else {
        await createBadge(payload as any);
      }
      await loadBadges();
      setShowForm(false);
      setEditingId(null);
    } catch {}
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      await deleteBadge(deleteConfirm.id);
      await loadBadges();
      setDeleteConfirm(null);
    } catch {}
  }

  const filtered = badges.filter(b => {
    if (typeFilter && b.badge_type !== typeFilter) return false;
    if (search) {
      const term = search.toLowerCase();
      return b.name.toLowerCase().includes(term) || b.slug.includes(term);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insignias y Microcredenciales</h1>
          <p className="text-gray-500 mt-1">{badges.length} insignias configuradas</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4 mr-2" />Nueva Insignia
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar insignia..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">Todos los tipos</option>
            {Object.entries(BADGE_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay insignias configuradas</p>
          <p className="text-gray-400 text-sm mt-1">Crea la primera insignia para motivar a tus participantes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => {
            const colors = BADGE_COLORS[b.color] || BADGE_COLORS.sky;
            return (
              <div key={b.id} className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                      <Award className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{b.name}</h3>
                      <span className={`text-xs font-medium ${colors.text}`}>{BADGE_TYPE_LABELS[b.badge_type]}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirm(b)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {b.description && (
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">{b.description}</p>
                )}
                {Object.keys(b.criteria).length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <p className="text-[10px] text-gray-400 font-mono truncate">{JSON.stringify(b.criteria)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Editar' : 'Nueva'} Insignia</h2>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                className="p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input value={form.name} onChange={e => handleNameChange(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select value={form.badge_type} onChange={e => setForm(p => ({ ...p, badge_type: e.target.value as Badge['badge_type'] }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    {Object.entries(BADGE_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    {Object.keys(BADGE_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Criterios (JSON)</label>
                <textarea value={form.criteria} onChange={e => setForm(p => ({ ...p, criteria: e.target.value }))} rows={4}
                  placeholder='{"type":"path_completion","path_id":"..."}'
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
                <p className="text-xs text-gray-400 mt-1">
                  Ejemplos: path_completion: {`{"path_id":"uuid"}`}, skill_combo: {`{"skills":["id1","id2"],"min_level":"intermedio"}`}, milestone: {`{"milestone_type":"certificates_count","threshold":3}`}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving}
                className="inline-flex items-center px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 disabled:opacity-50">
                <Save className="h-4 w-4 mr-2" />{saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar insignia</h3>
            <p className="text-sm text-gray-600 mb-4">
              Se eliminara <strong>{deleteConfirm.name}</strong> y se desvinculara de todos los participantes.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesManagementPage;
