import React, { useEffect, useState } from 'react';
import { Plus, Save, X, Pencil, Trash2, Star, Search } from 'lucide-react';
import {
  getSkills, createSkill, updateSkill, deleteSkill,
  SKILL_CATEGORIES, SKILL_LEVEL_LABELS, SKILL_LEVEL_COLORS,
} from '../../services/skillService';
import type { Skill, SkillLevel } from '../../types/participants';

interface SkillForm {
  name: string;
  slug: string;
  description: string;
  category: string;
  level: SkillLevel;
}

const emptyForm: SkillForm = {
  name: '', slug: '', description: '', category: SKILL_CATEGORIES[0], level: 'basico',
};

const SkillsManagementPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Skill | null>(null);

  useEffect(() => { loadSkills(); }, []);

  async function loadSkills() {
    setLoading(true);
    try { setSkills(await getSkills()); } catch {}
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  }

  function openEdit(s: Skill) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      slug: s.slug,
      description: s.description || '',
      category: s.category,
      level: s.level as SkillLevel,
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
      if (editingId) {
        await updateSkill(editingId, form);
      } else {
        await createSkill(form);
      }
      await loadSkills();
      setShowForm(false);
      setEditingId(null);
    } catch {}
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      await deleteSkill(deleteConfirm.id);
      await loadSkills();
      setDeleteConfirm(null);
    } catch {}
  }

  const filtered = skills.filter(s => {
    if (categoryFilter && s.category !== categoryFilter) return false;
    if (search) {
      const term = search.toLowerCase();
      return s.name.toLowerCase().includes(term) || s.slug.includes(term);
    }
    return true;
  });

  const grouped = filtered.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Habilidades</h1>
          <p className="text-gray-500 mt-1">{skills.length} habilidades registradas en {categories.length} categorías</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4 mr-2" />Nueva Habilidad
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar habilidad..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">Todas las categorías</option>
            {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Skills by Category */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay habilidades registradas</p>
          <p className="text-gray-400 text-sm mt-1">Crea la primera habilidad para asociarla a cursos</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{category}</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {catSkills.map(s => (
                  <div key={s.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map(d => (
                          <div key={d} className={`h-2 w-2 rounded-full ${
                            d <= { basico: 1, intermedio: 2, avanzado: 3, especializado: 4 }[s.level as SkillLevel]
                              ? 'bg-sky-500' : 'bg-gray-200'
                          }`} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                        {s.description && <p className="text-xs text-gray-400 truncate">{s.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SKILL_LEVEL_COLORS[s.level as SkillLevel]}`}>
                        {SKILL_LEVEL_LABELS[s.level as SkillLevel]}
                      </span>
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(s)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Editar' : 'Nueva'} Habilidad</h2>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                className="p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                  <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value as SkillLevel }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    {Object.entries(SKILL_LEVEL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar habilidad</h3>
            <p className="text-sm text-gray-600 mb-4">
              Se eliminará <strong>{deleteConfirm.name}</strong> y se desvinculará de todos los cursos y participantes asociados.
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

export default SkillsManagementPage;
