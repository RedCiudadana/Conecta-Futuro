import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getSkillsBadgeAnalytics, type SkillsBadgeAnalyticsData as SBA } from '../../../../services/analyticsService';

const COLORS = ['#0ea5e9', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const BADGE_TYPE_LABELS: Record<string, string> = {
  path_completion: 'Ruta Completada', skill_combo: 'Combinación', milestone: 'Logro', manual: 'Manual',
};

const SkillsBadgeAnalytics: React.FC = () => {
  const [data, setData] = useState<SBA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getSkillsBadgeAnalytics().then(setData).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-sky-500 animate-spin" /></div>;
  if (!data) return <p className="text-gray-400 text-center py-8">No hay datos disponibles</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{data.totalSkillsAwarded.toLocaleString('es-GT')}</p>
          <p className="text-xs text-gray-500 mt-1">Habilidades otorgadas</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{data.totalBadgesAwarded.toLocaleString('es-GT')}</p>
          <p className="text-xs text-gray-500 mt-1">Insignias otorgadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badge Types */}
        {data.badgesByType.length > 0 && (
          <ChartCard title="Insignias por tipo">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.badgesByType.map(d => ({ ...d, label: BADGE_TYPE_LABELS[d.type] ?? d.type }))}
                  dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}
                >
                  {data.badgesByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Top Skills placeholder when no data */}
        {data.topSkills.length === 0 && data.badgesByType.length === 0 && (
          <p className="text-gray-400 text-center py-8 col-span-2">No hay habilidades ni insignias registradas</p>
        )}
      </div>

      {/* Top Skills */}
      {data.topSkills.length > 0 && (
        <ChartCard title="Habilidades más otorgadas">
          <ResponsiveContainer width="100%" height={Math.max(250, data.topSkills.length * 28)}>
            <BarChart data={data.topSkills} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: number) => [v, 'Participantes']} />
              <Bar dataKey="count" name="Participantes" radius={[0, 4, 4, 0]}>
                {data.topSkills.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
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

export default SkillsBadgeAnalytics;
