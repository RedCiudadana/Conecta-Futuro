import React, { useState, lazy, Suspense } from 'react';
import { BarChart3, GraduationCap, Users, Award, Star, Route, Loader2 } from 'lucide-react';

const EnrollmentAnalytics = lazy(() => import('../../components/ui/admin/analytics/EnrollmentAnalytics'));
const ParticipantDemographics = lazy(() => import('../../components/ui/admin/analytics/ParticipantDemographics'));
const CertificateAnalytics = lazy(() => import('../../components/ui/admin/analytics/CertificateAnalytics'));
const SkillsBadgeAnalytics = lazy(() => import('../../components/ui/admin/analytics/SkillsBadgeAnalytics'));
const PathAnalytics = lazy(() => import('../../components/ui/admin/analytics/PathAnalytics'));

type TabId = 'enrollments' | 'demographics' | 'certificates' | 'skills' | 'paths';

const tabs: { id: TabId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'enrollments', label: 'Inscripciones', icon: GraduationCap },
  { id: 'demographics', label: 'Demografía', icon: Users },
  { id: 'certificates', label: 'Certificados', icon: Award },
  { id: 'skills', label: 'Habilidades e Insignias', icon: Star },
  { id: 'paths', label: 'Rutas', icon: Route },
];

const Fallback = () => (
  <div className="flex justify-center py-16">
    <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
  </div>
);

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('enrollments');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="h-7 w-7 text-sky-600" />
          Analíticas
        </h1>
        <p className="text-gray-500 mt-1">Métricas y tendencias del programa de formación</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-1 -mb-px">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <Suspense fallback={<Fallback />}>
        {activeTab === 'enrollments' && <EnrollmentAnalytics />}
        {activeTab === 'demographics' && <ParticipantDemographics />}
        {activeTab === 'certificates' && <CertificateAnalytics />}
        {activeTab === 'skills' && <SkillsBadgeAnalytics />}
        {activeTab === 'paths' && <PathAnalytics />}
      </Suspense>
    </div>
  );
};

export default AnalyticsPage;
