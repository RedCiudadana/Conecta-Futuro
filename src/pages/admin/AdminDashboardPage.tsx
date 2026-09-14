import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Award, TrendingUp, ClipboardCheck, UserPlus } from 'lucide-react';
import { getDashboardKPIs } from '../../services/participantService';
import type { DashboardKPIs } from '../../types/participants';
import { STATUS_LABELS, STATUS_COLORS, PROGRAM_LABELS } from '../../types/participants';

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string; to?: string }> = ({ label, value, icon, color, to }) => {
  const content = (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const AdminDashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardKPIs()
      .then(setKpis)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="font-medium">Error al cargar datos</p>
        <p className="text-sm mt-1">{error || 'No se pudieron obtener los indicadores.'}</p>
      </div>
    );
  }

  const statusEntries = Object.entries(kpis.statusBreakdown) as [string, number][];
  const deptEntries = Object.entries(kpis.departmentBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const programEntries = Object.entries(kpis.programBreakdown);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel General</h1>
          <p className="text-gray-500 mt-1">Indicadores clave del ecosistema de participantes</p>
        </div>
        <Link
          to="/admin/participantes/nuevo"
          className="inline-flex items-center px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium shadow-sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Participante
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Participantes" value={kpis.totalParticipants} icon={<Users className="h-6 w-6 text-sky-600" />} color="bg-sky-50" to="/admin/participantes" />
        <StatCard label="Activos" value={kpis.activeParticipants} icon={<TrendingUp className="h-6 w-6 text-emerald-600" />} color="bg-emerald-50" />
        <StatCard label="Inscripciones" value={kpis.totalEnrollments} icon={<GraduationCap className="h-6 w-6 text-blue-600" />} color="bg-blue-50" to="/admin/inscripciones" />
        <StatCard label="Tasa Completación" value={`${kpis.completionRate}%`} icon={<Award className="h-6 w-6 text-amber-600" />} color="bg-amber-50" />
        <StatCard label="Asistencia Prom." value={`${kpis.averageAttendance}%`} icon={<ClipboardCheck className="h-6 w-6 text-violet-600" />} color="bg-violet-50" to="/admin/asistencia" />
        <StatCard label="Certificados" value={kpis.certificatesIssued} icon={<Award className="h-6 w-6 text-rose-600" />} color="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Embudo de Participantes</h3>
          <div className="space-y-3">
            {(['registered', 'verified', 'active', 'graduated', 'inactive', 'dropped'] as const).map(status => {
              const count = kpis.statusBreakdown[status] || 0;
              const pct = kpis.totalParticipants > 0 ? Math.round((count / kpis.totalParticipants) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="text-gray-600 font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-sky-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Programs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inscripciones por Programa</h3>
          {programEntries.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin datos aún</p>
          ) : (
            <div className="space-y-4">
              {programEntries.map(([program, count]) => (
                <div key={program} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{PROGRAM_LABELS[program as keyof typeof PROGRAM_LABELS] || program}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Departments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Departamentos</h3>
          {deptEntries.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {deptEntries.map(([dept, count]) => {
                const pct = kpis.totalParticipants > 0 ? Math.round((count / kpis.totalParticipants) * 100) : 0;
                return (
                  <div key={dept}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{dept}</span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Registrations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registros Mensuales (Últimos 6 meses)</h3>
        <div className="flex items-end gap-4 h-40">
          {kpis.monthlyRegistrations.map(({ month, count }) => {
            const max = Math.max(...kpis.monthlyRegistrations.map(m => m.count), 1);
            const height = Math.max((count / max) * 100, 4);
            const [y, m] = month.split('-');
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-700">{count}</span>
                <div className="w-full bg-sky-100 rounded-t-md relative" style={{ height: `${height}%` }}>
                  <div className="absolute inset-0 bg-sky-500 rounded-t-md" />
                </div>
                <span className="text-xs text-gray-500">{monthNames[parseInt(m) - 1]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
