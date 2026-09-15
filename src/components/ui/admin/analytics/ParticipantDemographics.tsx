import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getDemographicsAnalytics, type DemographicsAnalytics as DA } from '../../../../services/analyticsService';

const COLORS = ['#0ea5e9', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];
const GENDER_LABELS: Record<string, string> = {
  male: 'Masculino', female: 'Femenino', other: 'Otro', 'No especificado': 'No especificado',
};
const LEVEL_LABELS: Record<string, string> = {
  none: 'Ninguno', basic: 'Básico', intermediate: 'Intermedio', advanced: 'Avanzado', 'No evaluado': 'No evaluado',
};

const ParticipantDemographics: React.FC = () => {
  const [data, setData] = useState<DA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getDemographicsAnalytics().then(setData).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-sky-500 animate-spin" /></div>;
  if (!data) return <p className="text-gray-400 text-center py-8">No hay datos disponibles</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-4 border border-gray-100 inline-block">
        <p className="text-2xl font-bold text-gray-900">{data.totalParticipants.toLocaleString('es-GT')}</p>
        <p className="text-xs text-gray-500 mt-1">Total de participantes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender */}
        {data.genderBreakdown.length > 0 && (
          <ChartCard title="Distribución por género">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.genderBreakdown.map(d => ({ ...d, label: GENDER_LABELS[d.gender] ?? d.gender }))}
                  dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}
                >
                  {data.genderBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Skill Level */}
        {data.skillLevelDistribution.length > 0 && (
          <ChartCard title="Nivel digital">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.skillLevelDistribution.map(d => ({ ...d, label: LEVEL_LABELS[d.level] ?? d.level }))}
                  dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}
                >
                  {data.skillLevelDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* Departments */}
      {data.departmentDistribution.length > 0 && (
        <ChartCard title="Participantes por departamento">
          <ResponsiveContainer width="100%" height={Math.max(300, data.departmentDistribution.length * 28)}>
            <BarChart data={data.departmentDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="department" type="category" width={140} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" name="Participantes" fill="#0ea5e9" radius={[0, 4, 4, 0]}>
                {data.departmentDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Top Institutions */}
      {data.topInstitutions.length > 0 && (
        <ChartCard title="Top instituciones">
          <ResponsiveContainer width="100%" height={Math.max(250, data.topInstitutions.length * 28)}>
            <BarChart data={data.topInstitutions} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="institution" type="category" width={180} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" name="Participantes" fill="#14b8a6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
};

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);

export default ParticipantDemographics;
