import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getCertificateAnalytics, type CertificateAnalyticsData as CA } from '../../../../services/analyticsService';

const COLORS = ['#0ea5e9', '#14b8a6', '#10b981', '#f59e0b', '#ef4444'];
const TYPE_LABELS: Record<string, string> = { completion: 'Completación', participation: 'Participación', excellence: 'Excelencia' };

const CertificateAnalytics: React.FC = () => {
  const [data, setData] = useState<CA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getCertificateAnalytics().then(setData).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-sky-500 animate-spin" /></div>;
  if (!data) return <p className="text-gray-400 text-center py-8">No hay datos disponibles</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-4 border border-gray-100 inline-block">
        <p className="text-2xl font-bold text-gray-900">{data.totalCertificates.toLocaleString('es-GT')}</p>
        <p className="text-xs text-gray-500 mt-1">Certificados emitidos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Over Time */}
        {data.certificatesByMonth.length > 0 && (
          <ChartCard title="Certificados emitidos por mes">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.certificatesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#d1fae5" strokeWidth={2} name="Certificados" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* By Type */}
        {data.certificateTypeBreakdown.length > 0 && (
          <ChartCard title="Tipo de certificado">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.certificateTypeBreakdown.map(d => ({ ...d, label: TYPE_LABELS[d.type] ?? d.type }))}
                  dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}
                >
                  {data.certificateTypeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* Top Courses */}
      {data.topCertifiedCourses.length > 0 && (
        <ChartCard title="Cursos con más certificados">
          <ResponsiveContainer width="100%" height={Math.max(250, data.topCertifiedCourses.length * 32)}>
            <BarChart data={data.topCertifiedCourses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="course" type="category" width={180} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" name="Certificados" fill="#f59e0b" radius={[0, 4, 4, 0]} />
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

export default CertificateAnalytics;
