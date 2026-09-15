import React, { useEffect, useState, useCallback } from 'react';
import { Download, Filter, Users, GraduationCap, Award, TrendingUp } from 'lucide-react';
import Seo from '../../components/Seo';
import { supabase } from '../../config/supabase';
import { getAdminImpactData, type AdminImpactFilters } from '../../services/impactService';
import { GUATEMALA_DEPARTMENTS } from '../../types/participants';

interface CourseOption {
  id: string;
  title: string;
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    const values = headers.map(h => {
      const v = row[h];
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    });
    lines.push(values.join(','));
  }
  return lines.join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ImpactoAdminPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [filters, setFilters] = useState<AdminImpactFilters>({});
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('courses').select('id, title').order('title').then(({ data }) => {
      setCourses(data ?? []);
    });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminImpactData(filters);
      setEnrollments(data.enrollments);
      setCertificates(data.certificates);
    } catch (err) {
      console.error('[ImpactoAdmin] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalEnrolled = enrollments.length;
  const totalCompleted = enrollments.filter(e => e.status === 'completed').length;
  const completionRate = totalEnrolled > 0 ? ((totalCompleted / totalEnrolled) * 100).toFixed(1) : '0';

  const exportEnrollments = () => {
    const rows = enrollments.map(e => ({
      participante: `${e.participant?.first_name ?? ''} ${e.participant?.last_name ?? ''}`,
      departamento: e.participant?.department ?? '',
      genero: e.participant?.gender ?? '',
      rango_edad: e.participant?.age_range ?? '',
      curso: e.course?.title ?? '',
      programa: e.course?.program ?? '',
      estado: e.status,
      fecha_inscripcion: e.enrolled_at,
      fecha_completado: e.completed_at ?? '',
    }));
    downloadCSV(toCSV(rows), `inscripciones_impacto_${Date.now()}.csv`);
  };

  const exportCertificates = () => {
    const rows = certificates.map(c => ({
      participante: `${c.participant?.first_name ?? ''} ${c.participant?.last_name ?? ''}`,
      departamento: c.participant?.department ?? '',
      curso: c.course?.title ?? '',
      programa: c.course?.program ?? '',
      fecha_emision: c.issued_at,
    }));
    downloadCSV(toCSV(rows), `certificados_impacto_${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      <Seo title="Impacto | Admin | Escuela Red Ciudadana" description="Panel de métricas de impacto" />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Métricas de Impacto</h1>
        <p className="text-gray-500 mt-1">Filtra y exporta datos de resultados de la plataforma.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <Filter className="w-4 h-4" />
          <span className="font-medium text-sm">Filtros</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={filters.dateFrom ?? ''}
              onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={filters.dateTo ?? ''}
              onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Curso</label>
            <select
              value={filters.courseId ?? ''}
              onChange={e => setFilters(prev => ({ ...prev, courseId: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Departamento</label>
            <select
              value={filters.department ?? ''}
              onChange={e => setFilters(prev => ({ ...prev, department: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos</option>
              {GUATEMALA_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Programa</label>
            <select
              value={filters.program ?? ''}
              onChange={e => setFilters(prev => ({ ...prev, program: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos</option>
              <option value="primeros_pasos">Primeros Pasos</option>
              <option value="digitaliza_pyme">Digitaliza PyME</option>
              <option value="directorio_ia">Directorio IA</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Inscripciones', value: totalEnrolled, icon: <Users className="w-5 h-5" /> },
          { label: 'Completados', value: totalCompleted, icon: <GraduationCap className="w-5 h-5" /> },
          { label: 'Tasa finalización', value: `${completionRate}%`, icon: <TrendingUp className="w-5 h-5" /> },
          { label: 'Certificados', value: certificates.length, icon: <Award className="w-5 h-5" /> },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-primary-600 mb-2">{card.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Export buttons */}
      <div className="flex gap-3">
        <button
          onClick={exportEnrollments}
          disabled={enrollments.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Exportar inscripciones
        </button>
        <button
          onClick={exportCertificates}
          disabled={certificates.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Exportar certificados
        </button>
      </div>

      {/* Data tables */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando datos...</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="px-5 py-3 font-semibold text-gray-900 border-b border-gray-100">Inscripciones</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-2 text-left">Participante</th>
                    <th className="px-4 py-2 text-left">Departamento</th>
                    <th className="px-4 py-2 text-left">Curso</th>
                    <th className="px-4 py-2 text-left">Programa</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.slice(0, 50).map((e, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-2">{e.participant?.first_name} {e.participant?.last_name}</td>
                      <td className="px-4 py-2">{e.participant?.department ?? '—'}</td>
                      <td className="px-4 py-2">{e.course?.title ?? '—'}</td>
                      <td className="px-4 py-2">{e.course?.program ?? '—'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          e.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          e.status === 'enrolled' ? 'bg-sky-100 text-sky-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{e.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {enrollments.length > 50 && (
                <p className="px-4 py-3 text-xs text-gray-400">Mostrando 50 de {enrollments.length}. Exporta para ver todos.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
