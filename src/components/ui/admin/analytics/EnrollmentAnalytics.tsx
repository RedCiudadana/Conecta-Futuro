import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { getEnrollmentAnalytics, type EnrollmentAnalytics as EA } from '../../../../services/analyticsService';

const COLORS = ['#0ea5e9', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const STATUS_LABELS: Record<string, string> = {
  enrolled: 'Inscrito', in_progress: 'En progreso', completed: 'Completado', dropped: 'Abandonado', waitlisted: 'En espera',
};
const PROGRAM_LABELS: Record<string, string> = {
  primeros_pasos: 'Primeros Pasos', digitaliza_pyme: 'Digitaliza tu PyME', directorio_ia: 'Directorio IA', otro: 'Otro',
};

const EnrollmentAnalytics: React.FC = () => {
  const [data, setData] = useState<EA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getEnrollmentAnalytics().then(setData).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-sky-500 animate-spin" /></div>;
  if (!data) return <p className="text-gray-400 text-center py-8">No hay datos disponibles</p>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Inscripciones" value={data.totalEnrollments} />
        <SummaryCard label="Tasa de Completación" value={`${data.completionRate}%`} />
        <SummaryCard label="Completados" value={data.statusBreakdown.find(s => s.status === 'completed')?.count ?? 0} />
        <SummaryCard label="En Progreso" value={data.statusBreakdown.find(s => s.status === 'in_progress')?.count ?? 0} />
      </div>

      {/* Enrollments Over Time */}
      {data.enrollmentsByMonth.length > 0 && (
        <ChartCard title="Inscripciones por mes">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.enrollmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4, fill: '#0ea5e9' }} name="Inscripciones" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Program */}
        {data.enrollmentsByProgram.length > 0 && (
          <ChartCard title="Inscripciones por programa">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.enrollmentsByProgram.map(d => ({ ...d, program: PROGRAM_LABELS[d.program] ?? d.program }))} dataKey="count" nameKey="program" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {data.enrollmentsByProgram.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Status Breakdown */}
        {data.statusBreakdown.length > 0 && (
          <ChartCard title="Distribución por estado">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.statusBreakdown.map(d => ({ ...d, label: STATUS_LABELS[d.status] ?? d.status }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis dataKey="label" type="category" width={100} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" name="Cantidad" radius={[0, 4, 4, 0]}>
                  {data.statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* By Course */}
      {data.enrollmentsByCourse.length > 0 && (
        <ChartCard title="Top cursos (inscritos vs completados)">
          <ResponsiveContainer width="100%" height={Math.max(280, data.enrollmentsByCourse.length * 32)}>
            <BarChart data={data.enrollmentsByCourse} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="course" type="category" width={180} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar dataKey="enrolled" name="Inscritos" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              <Bar dataKey="completed" name="Completados" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
};

const SummaryCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100">
    <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString('es-GT') : value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);

export default EnrollmentAnalytics;
