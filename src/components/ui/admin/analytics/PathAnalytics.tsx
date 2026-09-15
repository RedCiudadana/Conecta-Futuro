import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getPathAnalytics, type PathAnalyticsData as PA } from '../../../../services/analyticsService';

const PathAnalytics: React.FC = () => {
  const [data, setData] = useState<PA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getPathAnalytics().then(setData).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-sky-500 animate-spin" /></div>;
  if (!data || data.pathCompletionRates.length === 0) return <p className="text-gray-400 text-center py-8">No hay datos de rutas disponibles</p>;

  return (
    <div className="space-y-6">
      {/* Summary table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Ruta</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Inscritos</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Completados</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Progreso prom.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.pathCompletionRates.map(p => (
              <tr key={p.path} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{p.path}</td>
                <td className="text-center px-4 py-3 text-gray-600">{p.totalEnrolled}</td>
                <td className="text-center px-4 py-3 text-gray-600">{p.completed}</td>
                <td className="text-center px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${p.avgProgress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{p.avgProgress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Progreso por ruta</h3>
        <ResponsiveContainer width="100%" height={Math.max(250, data.pathCompletionRates.length * 48)}>
          <BarChart data={data.pathCompletionRates} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" unit="%" />
            <YAxis dataKey="path" type="category" width={160} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: number) => [`${v}%`, '']} />
            <Legend />
            <Bar dataKey="avgProgress" name="Progreso promedio" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PathAnalytics;
