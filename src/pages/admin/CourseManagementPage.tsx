import React, { useEffect, useState } from 'react';
import {
  BookOpen, Plus, Save, RefreshCw, CheckCircle, AlertCircle,
  X, Pencil, Trash2, ChevronDown, ChevronUp, Layers, Star,
} from 'lucide-react';
import { getCourses, createCourse, updateCourse, deleteCourse, syncCMSCoursesToDB } from '../../services/participantService';
import type { SyncResult } from '../../services/participantService';
import { decapContentService } from '../../services/courseService';
import {
  getSkills, getCourseSkills, addSkillToCourse, removeSkillFromCourse,
  SKILL_LEVEL_LABELS, SKILL_LEVEL_COLORS,
} from '../../services/skillService';
import type { Course, CourseProgram, CourseModality, CourseStatus, Skill, CourseSkill, SkillLevel } from '../../types/participants';
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

const LEVEL_OPTIONS = ['Basico', 'Intermedio', 'Avanzado'];
const CATEGORY_OPTIONS = [
  'Transformacion Digital',
  'Innovacion Publica',
  'Inclusion Digital',
  'Emprendimiento Digital',
  'Periodismo de Datos',
];

interface CourseFormState {
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  level: string;
  duration: string;
  category: string;
  instructor_name: string;
  program: CourseProgram | '';
  modality: CourseModality | '';
  start_date: string;
  end_date: string;
  max_capacity: string;
  status: CourseStatus;
  is_featured: boolean;
}

const emptyForm: CourseFormState = {
  slug: '', title: '', description: '', thumbnail_url: '', level: '', duration: '',
  category: '', instructor_name: '', program: '', modality: '', start_date: '',
  end_date: '', max_capacity: '', status: 'open', is_featured: false,
};

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CourseFormState>({ ...emptyForm });
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CourseStatus | ''>('');
  const [deleteConfirm, setDeleteConfirm] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkField, setBulkField] = useState<'status' | 'category' | 'level' | ''>('');
  const [bulkValue, setBulkValue] = useState('');
  const [bulkApplying, setBulkApplying] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ success: number; errors: number } | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch {}
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  }

  function openEdit(course: Course) {
    setEditingId(course.id);
    setForm({
      slug: course.slug,
      title: course.title,
      description: course.description || '',
      thumbnail_url: course.thumbnail_url || '',
      level: course.level || '',
      duration: course.duration || '',
      category: course.category || '',
      instructor_name: course.instructor_name || '',
      program: course.program || '',
      modality: course.modality || '',
      start_date: course.start_date || '',
      end_date: course.end_date || '',
      max_capacity: course.max_capacity?.toString() || '',
      status: course.status,
      is_featured: course.is_featured,
    });
    setShowForm(true);
  }

  function handleTitleChange(title: string) {
    const slug = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(prev => ({ ...prev, title, ...(editingId ? {} : { slug }) }));
  }

  function buildPayload() {
    const payload: Record<string, unknown> = {
      slug: form.slug,
      title: form.title,
      description: form.description || null,
      thumbnail_url: form.thumbnail_url || null,
      level: form.level || null,
      duration: form.duration || null,
      category: form.category || null,
      instructor_name: form.instructor_name || null,
      is_featured: form.is_featured,
      program: form.program || null,
      modality: form.modality || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      max_capacity: form.max_capacity ? parseInt(form.max_capacity) : null,
      status: form.status,
    };
    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editingId) {
        await updateCourse(editingId, payload as any);
      } else {
        await createCourse(payload as any);
      }
      await loadCourses();
      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
    } catch {}
    setSaving(false);
  }

  async function toggleStatus(course: Course) {
    const nextStatus: Record<CourseStatus, CourseStatus> = {
      draft: 'open',
      open: 'in_progress',
      in_progress: 'completed',
      completed: 'open',
      cancelled: 'draft',
    };
    try {
      await updateCourse(course.id, { status: nextStatus[course.status] });
      await loadCourses();
    } catch {}
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteCourse(deleteConfirm.id);
      await loadCourses();
      setDeleteConfirm(null);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteConfirm.id);
        return next;
      });
    } catch {}
    setDeleting(false);
  }

  // Bulk selection helpers
  const filteredCourses = statusFilter
    ? courses.filter(c => c.status === statusFilter)
    : courses;

  const allFilteredSelected = filteredCourses.length > 0 && filteredCourses.every(c => selectedIds.has(c.id));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredCourses.forEach(c => next.delete(c.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredCourses.forEach(c => next.add(c.id));
        return next;
      });
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setBulkField('');
    setBulkValue('');
    setBulkResult(null);
  }

  async function applyBulkChange() {
    if (!bulkField || !bulkValue || selectedIds.size === 0) return;
    setBulkApplying(true);
    setBulkResult(null);

    let success = 0;
    let errors = 0;

    const updates: Record<string, unknown> = { [bulkField]: bulkValue };

    const promises = Array.from(selectedIds).map(async (id) => {
      try {
        await updateCourse(id, updates as any);
        success++;
      } catch {
        errors++;
      }
    });

    await Promise.all(promises);
    setBulkResult({ success, errors });
    setBulkApplying(false);
    await loadCourses();
    setTimeout(() => setBulkResult(null), 4000);
  }

  const bulkFieldOptions = [
    { value: 'status', label: 'Estado' },
    { value: 'category', label: 'Categoria' },
    { value: 'level', label: 'Nivel' },
  ] as const;

  function getBulkValueOptions(): { value: string; label: string }[] {
    switch (bulkField) {
      case 'status':
        return Object.entries(statusLabels).map(([v, l]) => ({ value: v, label: l }));
      case 'category':
        return CATEGORY_OPTIONS.map(c => ({ value: c, label: c }));
      case 'level':
        return LEVEL_OPTIONS.map(l => ({ value: l, label: l }));
      default:
        return [];
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-500 mt-1">Administra los cursos, su contenido y estado de inscripcion</p>
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
                await loadCourses();
              } catch {}
              setSyncing(false);
              setTimeout(() => setSyncResult(null), 6000);
            }}
            disabled={syncing}
            className="inline-flex items-center px-4 py-2 border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar del sitio'}
          </button>
          <button onClick={openCreate}
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Curso
          </button>
        </div>
      </div>

      {/* Sync result */}
      {syncResult && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          syncResult.errors.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
        }`}>
          {syncResult.errors.length > 0
            ? <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            : <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />}
          <p className="text-sm text-gray-700">
            {syncResult.created > 0
              ? `Se importaron ${syncResult.created} cursos nuevos del sitio web.`
              : 'Todos los cursos del sitio web ya estaban registrados.'}
            {syncResult.existing > 0 && ` (${syncResult.existing} ya existian)`}
          </p>
        </div>
      )}

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
          <form onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Editar Curso' : 'Nuevo Curso'}
              </h2>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                className="p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
                  <input value={form.title} onChange={e => handleTitleChange(e.target.value)} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <textarea value={form.description} rows={3}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                  <select value={form.level} onChange={e => setForm(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="">Seleccionar...</option>
                    {LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duracion</label>
                  <input value={form.duration} placeholder="Ej: 4 semanas"
                    onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="">Seleccionar...</option>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                  <input value={form.instructor_name}
                    onChange={e => setForm(prev => ({ ...prev, instructor_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (URL o ruta)</label>
                <input value={form.thumbnail_url}
                  placeholder="Ej: /uploads/mi-curso.png"
                  onChange={e => setForm(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <option value="hibrido">Hibrido</option>
                    <option value="autoestudio">Autoestudio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as CourseStatus }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    {Object.entries(statusLabels).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                  <input type="date" value={form.start_date}
                    onChange={e => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input type="date" value={form.end_date}
                    onChange={e => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cupos</label>
                  <input type="number" value={form.max_capacity}
                    onChange={e => setForm(prev => ({ ...prev, max_capacity: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_featured}
                  onChange={e => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                <span className="text-sm text-gray-700">Destacar en el catalogo publico</span>
              </label>
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

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-wrap items-center gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-sky-600" />
            <span className="text-sm font-semibold text-sky-900">
              {selectedIds.size} curso{selectedIds.size > 1 ? 's' : ''} seleccionado{selectedIds.size > 1 ? 's' : ''}
            </span>
          </div>

          <div className="h-5 w-px bg-sky-200 hidden sm:block" />

          <div className="flex items-center gap-2 flex-wrap flex-1">
            <select
              value={bulkField}
              onChange={e => { setBulkField(e.target.value as any); setBulkValue(''); }}
              className="border border-sky-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Cambiar campo...</option>
              {bulkFieldOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {bulkField && (
              <select
                value={bulkValue}
                onChange={e => setBulkValue(e.target.value)}
                className="border border-sky-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Nuevo valor...</option>
                {getBulkValueOptions().map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}

            {bulkField && bulkValue && (
              <button
                onClick={applyBulkChange}
                disabled={bulkApplying}
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors"
              >
                {bulkApplying ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {bulkApplying ? 'Aplicando...' : 'Aplicar'}
              </button>
            )}

            {bulkResult && (
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                bulkResult.errors > 0
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {bulkResult.success} actualizado{bulkResult.success !== 1 ? 's' : ''}
                {bulkResult.errors > 0 && `, ${bulkResult.errors} error${bulkResult.errors !== 1 ? 'es' : ''}`}
              </span>
            )}
          </div>

          <button onClick={clearSelection}
            className="p-1.5 rounded-lg hover:bg-sky-100 text-sky-600 transition-colors" title="Deseleccionar todo">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setStatusFilter('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            statusFilter === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>Todos ({courses.length})</button>
        {(Object.keys(statusLabels) as CourseStatus[]).map(s => {
          const count = courses.filter(c => c.status === s).length;
          if (count === 0) return null;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-gray-900 text-white' : `${statusColors[s]} hover:opacity-80`
              }`}>{statusLabels[s]} ({count})</button>
          );
        })}
      </div>

      {/* Course List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-sky-600 mx-auto" /></div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay cursos registrados</p>
          </div>
        ) : (
          <>
            {/* Select all header */}
            <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-xs font-medium text-gray-500">
                {allFilteredSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {filteredCourses.map(c => (
                <div key={c.id} className={`transition-colors ${selectedIds.has(c.id) ? 'bg-sky-50/50' : 'hover:bg-gray-50/50'}`}>
                  <div className="flex items-center gap-4 px-6 py-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 flex-shrink-0"
                    />

                    {/* Thumbnail */}
                    <div className="hidden sm:block w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {c.thumbnail_url ? (
                        <img src={c.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">{c.slug}</p>
                    </div>

                    {/* Category */}
                    <div className="hidden lg:block text-sm text-gray-500 w-36 truncate">
                      {c.category || '—'}
                    </div>

                    {/* Level */}
                    <div className="hidden md:block text-sm text-gray-500 w-24">
                      {c.level || '—'}
                    </div>

                    {/* Status */}
                    <button onClick={() => toggleStatus(c)} title="Cambiar estado"
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-70 transition-opacity ${statusColors[c.status]}`}>
                      {statusLabels[c.status]}
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(c)} title="Editar"
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(c)} title="Eliminar"
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} title="Detalles"
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        {expandedId === c.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === c.id && (
                    <div className="px-6 pb-4 bg-gray-50/50 ml-10 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500">
                        <div><span className="font-medium text-gray-700">Programa:</span> {c.program ? PROGRAM_LABELS[c.program] : '—'}</div>
                        <div><span className="font-medium text-gray-700">Modalidad:</span> {c.modality || '—'}</div>
                        <div><span className="font-medium text-gray-700">Duracion:</span> {c.duration || '—'}</div>
                        <div><span className="font-medium text-gray-700">Cupos:</span> {c.max_capacity ?? 'Sin limite'}</div>
                        <div><span className="font-medium text-gray-700">Instructor:</span> {c.instructor_name || '—'}</div>
                        <div><span className="font-medium text-gray-700">Inicio:</span> {c.start_date ? new Date(c.start_date).toLocaleDateString('es-GT') : '—'}</div>
                        <div><span className="font-medium text-gray-700">Fin:</span> {c.end_date ? new Date(c.end_date).toLocaleDateString('es-GT') : '—'}</div>
                        <div><span className="font-medium text-gray-700">Destacado:</span> {c.is_featured ? 'Si' : 'No'}</div>
                        {c.description && (
                          <div className="col-span-2 sm:col-span-4">
                            <span className="font-medium text-gray-700">Descripcion:</span> {c.description}
                          </div>
                        )}
                      </div>
                      <CourseSkillsPanel courseId={c.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Eliminar curso</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Estas a punto de eliminar el curso:
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-4 bg-gray-50 rounded-lg px-3 py-2">
              {deleteConfirm.title}
            </p>
            <p className="text-sm text-red-600 mb-6">
              Esta accion tambien eliminara las inscripciones, asistencias y certificados asociados. No se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseSkillsPanel: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [courseSkills, setCourseSkills] = useState<CourseSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [addingSkill, setAddingSkill] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('basico');

  useEffect(() => {
    Promise.all([getCourseSkills(courseId), getSkills()])
      .then(([cs, all]) => { setCourseSkills(cs); setAllSkills(all); })
      .catch(() => {})
      .finally(() => setLoadingSkills(false));
  }, [courseId]);

  const availableSkills = allSkills.filter(s => !courseSkills.some(cs => cs.skill_id === s.id));

  async function handleAdd() {
    if (!selectedSkillId) return;
    setAddingSkill(true);
    try {
      await addSkillToCourse(courseId, selectedSkillId, selectedLevel);
      const updated = await getCourseSkills(courseId);
      setCourseSkills(updated);
      setSelectedSkillId('');
      setSelectedLevel('basico');
    } catch {}
    setAddingSkill(false);
  }

  async function handleRemove(skillId: string) {
    try {
      await removeSkillFromCourse(courseId, skillId);
      setCourseSkills(prev => prev.filter(cs => cs.skill_id !== skillId));
    } catch {}
  }

  if (loadingSkills) {
    return <div className="py-2"><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-sky-600" /></div>;
  }

  return (
    <div className="border-t border-gray-200 pt-3">
      <div className="flex items-center gap-2 mb-2">
        <Star className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Habilidades del curso</span>
      </div>

      {courseSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {courseSkills.map(cs => (
            <span key={cs.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-gray-200 text-xs">
              <span className="font-medium text-gray-900">{(cs.skill as any)?.name || 'Skill'}</span>
              <span className={`px-1 py-0.5 rounded text-[10px] font-medium ${SKILL_LEVEL_COLORS[cs.level as SkillLevel]}`}>
                {SKILL_LEVEL_LABELS[cs.level as SkillLevel]}
              </span>
              <button onClick={() => handleRemove(cs.skill_id)}
                className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <select value={selectedSkillId} onChange={e => setSelectedSkillId(e.target.value)}
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 max-w-[200px]">
          <option value="">Agregar habilidad...</option>
          {availableSkills.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
          ))}
        </select>
        {selectedSkillId && (
          <>
            <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value as SkillLevel)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500">
              {Object.entries(SKILL_LEVEL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <button onClick={handleAdd} disabled={addingSkill}
              className="inline-flex items-center px-2.5 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-medium hover:bg-sky-700 disabled:opacity-50">
              <Plus className="h-3 w-3 mr-1" />{addingSkill ? '...' : 'Agregar'}
            </button>
          </>
        )}
        {availableSkills.length === 0 && courseSkills.length > 0 && (
          <span className="text-xs text-gray-400">Todas las habilidades asignadas</span>
        )}
        {allSkills.length === 0 && (
          <span className="text-xs text-gray-400">No hay habilidades creadas aún</span>
        )}
      </div>
    </div>
  );
};

export default CourseManagementPage;
