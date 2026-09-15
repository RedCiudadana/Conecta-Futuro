import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Shield, Star, Route, Calendar, MapPin, Building2, ExternalLink, Loader2 } from 'lucide-react';
import { getPublicProfile, type PublicProfileData } from '../../services/publicProfileService';
import { BADGE_COLORS } from '../../services/badgeService';
import { SKILL_LEVEL_LABELS, SKILL_LEVEL_COLORS } from '../../services/skillService';
import type { SkillLevel } from '../../types/participants';

const PublicProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }
    getPublicProfile(slug)
      .then(d => { if (d) setData(d); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Shield className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-700 mb-2">Perfil no encontrado</h1>
        <p className="text-gray-500 text-sm text-center max-w-md">
          Este perfil no existe o no es público. El participante puede haber desactivado su perfil público.
        </p>
        <Link to="/" className="mt-6 text-sky-600 hover:text-sky-700 text-sm font-medium">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const { participant: p } = data;
  const initials = `${p.first_name[0] ?? ''}${p.last_name[0] ?? ''}`.toUpperCase();
  const memberSince = new Date(p.created_at).toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });

  const skillsByCategory = data.skills.reduce<Record<string, typeof data.skills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8 px-4 sm:py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-sky-500 to-teal-400" />
          <div className="px-6 pb-6 -mt-10">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-sky-600 bg-sky-50 shrink-0">
                {initials}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900">{p.first_name} {p.last_name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                  {p.institution && (
                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{p.institution}</span>
                  )}
                  {p.department && (
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.department}</span>
                  )}
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Miembro desde {memberSince}</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              <StatPill label="Certificados" value={data.certificates.length} />
              <StatPill label="Insignias" value={data.badges.length} />
              <StatPill label="Habilidades" value={data.skills.length} />
              <StatPill label="Rutas" value={data.pathProgress.length} />
            </div>
          </div>
        </div>

        {/* Badges */}
        {data.badges.length > 0 && (
          <Section title="Insignias" icon={<Shield className="h-5 w-5 text-sky-600" />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.badges.map((b, i) => {
                const colors = BADGE_COLORS[b.color] ?? BADGE_COLORS.sky;
                return (
                  <div key={i} className={`p-4 rounded-xl border ${colors.border} ${colors.bg} transition-shadow hover:shadow-sm`}>
                    <span className="text-2xl">{b.icon}</span>
                    <p className={`text-sm font-semibold mt-2 ${colors.text}`}>{b.name}</p>
                    {b.description && <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{b.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(b.awarded_at).toLocaleDateString('es-GT', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Certificates */}
        {data.certificates.length > 0 && (
          <Section title="Certificados" icon={<Award className="h-5 w-5 text-amber-500" />}>
            <div className="divide-y divide-gray-50">
              {data.certificates.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.course_title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(c.issued_at).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  {c.verification_url && (
                    <a href={c.verification_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-sky-600">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <Section title="Habilidades" icon={<Star className="h-5 w-5 text-teal-500" />}>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                <div key={cat}>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{cat}</h4>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((s, i) => (
                      <span key={i} className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${SKILL_LEVEL_COLORS[s.level as SkillLevel] ?? 'bg-gray-100 text-gray-600'}`}>
                        {s.name} -- {SKILL_LEVEL_LABELS[s.level as SkillLevel] ?? s.level}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Path Progress */}
        {data.pathProgress.length > 0 && (
          <Section title="Rutas de Aprendizaje" icon={<Route className="h-5 w-5 text-emerald-500" />}>
            <div className="space-y-3">
              {data.pathProgress.map((path, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-gray-700">{path.path_name}</p>
                    <span className="text-xs font-semibold text-gray-500">{path.completion_percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${path.completion_percentage >= 100 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                      style={{ width: `${Math.min(path.completion_percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pt-4">
          Perfil verificado por Escuela Red Ciudadana -- Conecta Futuro
        </p>
      </div>
    </div>
  );
};

const StatPill: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3 text-center">
    <p className="text-lg font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
      {icon} {title}
    </h2>
    {children}
  </div>
);

export default PublicProfile;
