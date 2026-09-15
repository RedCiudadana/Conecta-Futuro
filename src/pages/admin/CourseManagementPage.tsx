import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { getCourses, createCourse, syncCMSCoursesToDB } from '../../services/participantService';
import type { SyncResult } from '../../services/participantService';
import { decapContentService } from '../../services/courseService';
import type { Course, CourseProgram, CourseModality, CourseStatus } from '../../types/participants';
import { PROGRAM_LABELS } from '../../types/participants';

const statusLabels: Record<CourseStatus, string> = {
  draft: 'Borrador',
  open: 'Abierto',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const statusColors: Record<CourseStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  open: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-sky-100 text-sky-700',
  completed: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: '', title: '', program: '' as CourseProgram | '',
    modality: '' as CourseModality | '', start_date: '', end_date: '',
    max_capacity: '', status: 'draft' as CourseStatus,
  });
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    getCourses().then(setCourses).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      const payload: any = {
        ...form,
        max_capacity: form.max_capacity ? parseInt(form.max_capacity) : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      if (!payload.program) delete payload.program;
      if (!payload.modality) delete payload.modality;

      await createCourse(payload);
      const updated = await getCourses();
      setCourses(updated);
      setShowForm(false);
      setForm({ slug: '', title: '', program: '', modality: '', start_date: '', end_date: '', max_capacity: '', status: 'draft' });
    } catch { }
    setSaving(false);
  };

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(prev => ({ ...prev, title, slug }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-500 mt-1">Administra los cursos y programas del ecosistema</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              setSyncing(true);
              setSyncResult(null);
              try {
                const cmsCourses = await decapContentService.getCourses();
                const mapped = cmsCourses.map(c => ({ slug: c.slug, title: c.title }));
                const result = await syncCMSCoursesToDB(mapped);
                setSyncResult(result);
                const updated = await getCourses();
                setCourses(updated);
              } catch { }
              setSyncing(false);
              setTimeout(() => setSyncResult(null), 6000);
            }}
            disabled={syncing}
            className="inline-flex items-center px-4 py-2 border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar del sitio web'}
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Curso
          </button>
        </div>
      </div>

      {syncResult && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          syncResult.errors.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
        }`}>
          {syncResult.errors.length > 0
            ? <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            : <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          }
          <p className="text-sm text-gray-700">
            {syncResult.created > 0
              ? `Se importaron ${syncResult.created} cursos nuevos del sitio web.`
              : 'Todos los cursos del sitio web ya estaban registrados.'}
            {syncResult.existing > 0 && ` (${syncResult.existing} ya existían)`}
          </p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Nuevo Curso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input value={form.title} onChange={e => handleTitleChange(e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
              <select value={form.program} onChange={e => setForm(prev => ({ ...prev, program: e.target.value as any }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Seleccionar...</option>
                {Object.entries(PROGRAM_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
              <select value={form.modality} onChange={e => setForm(prev => ({ ...prev, modality: e.target.value as any }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Seleccionar...</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrido">Híbrido</option>
                <option value="autoestudio">Autoestudio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input type="date" value={form.start_date} onChange={e => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input type="date" value={form.end_date} onChange={e => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cupos</label>
              <input type="number" value={form.max_capacity} onChange={e => setForm(prev => ({ ...prev, max_capacity: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 disabled:opacity-50">
              <Save className="h-4 w-4 mr-2" />{saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {/* Course List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-sky-600 mx-auto"></div></div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay cursos registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Curso</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Programa</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Modalidad</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Fechas</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-400 font-mono">{c.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.program ? PROGRAM_LABELS[c.program] : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell capitalize">{c.modality || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {c.start_date ? new Date(c.start_date).toLocaleDateString('es-GT') : '—'}
                      {c.end_date ? ` → ${new Date(c.end_date).toLocaleDateString('es-GT')}` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                        {statusLabels[c.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagementPage;
