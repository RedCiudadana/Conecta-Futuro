import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, BookOpen, Clock, Star, GraduationCap, ChevronRight,
  Shield, Route, Lock, LogIn,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabase';
import type { Enrollment, Certificate, SkillLevel } from '../../types/participants';
import {
  getParticipantEffectiveSkills,
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_COLORS,
} from '../../services/skillService';
import { getLearningPaths } from '../../services/learningPathService';
import type { LearningPathWithCourses } from '../../types/learningPath';

interface PassportData {
  participant: { id: string; first_name: string; last_name: string; primary_email: string; created_at: string } | null;
  enrollments: Enrollment[];
  certificates: Certificate[];
  skills: { skill: { id: string; name: string; category: string }; level: SkillLevel; sources: any[] }[];
  paths: LearningPathWithCourses[];
}

const DigitalPassport: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) { setLoading(false); return; }
    loadPassport(user.email);
  }, [user?.email]);

  async function loadPassport(email: string) {
    setLoading(true);
    try {
      const { data: participant } = await supabase
        .from('participants')
        .select('id, first_name, last_name, primary_email, created_at')
        .eq('primary_email', email.toLowerCase().trim())
        .maybeSingle();

      if (!participant) { setData(null); setLoading(false); return; }

      const [enrollRes, certRes, skills, paths] = await Promise.all([
        supabase.from('enrollments').select('*, course:courses(*)').eq('participant_id', participant.id).order('enrolled_at', { ascending: false }),
        supabase.from('certificates').select('*, course:courses(*)').eq('participant_id', participant.id).neq('status', 'revoked').order('issued_at', { ascending: false }),
        getParticipantEffectiveSkills(participant.id),
        getLearningPaths(),
      ]);

      setData({
        participant,
        enrollments: enrollRes.data ?? [],
        certificates: certRes.data ?? [],
        skills,
        paths: paths as LearningPathWithCourses[],
      });
    } catch {
      setData(null);
    }
    setLoading(false);
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Pasaporte Conecta Futuro</h1>
          <p className="text-gray-500 mb-6">Inicia sesión para ver tu trayectoria de aprendizaje, certificados y habilidades adquiridas.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors">
            <LogIn className="h-5 w-5 mr-2" />Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-600" />
      </div>
    );
  }

  if (!data?.participant) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pasaporte No Disponible</h1>
          <p className="text-gray-500 mb-6">No encontramos un perfil de participante asociado a tu cuenta. Inscríbete en un curso para comenzar tu trayectoria.</p>
          <Link to="/courses" className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors">
            <BookOpen className="h-5 w-5 mr-2" />Ver Cursos
          </Link>
        </div>
      </div>
    );
  }

  const { participant, enrollments, certificates, skills, paths } = data;
  const completed = enrollments.filter(e => e.status === 'completed');
  const totalHours = certificates.reduce((sum, c) => sum + ((c as any).hours ?? 0), 0);
  const memberSince = new Date(participant.created_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long' });

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.skill.category] ??= []).push(s);
    return acc;
  }, {});

  const completedSlugs = new Set(
    enrollments.filter(e => e.status === 'completed').map(e => (e.course as any)?.slug).filter(Boolean)
  );

  const levelDots: Record<SkillLevel, number> = { basico: 1, intermedio: 2, avanzado: 3, especializado: 4 };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-600 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <p className="text-sky-200 text-sm font-medium uppercase tracking-wider mb-2">Pasaporte Digital</p>
          <h1 className="text-3xl font-bold mb-1">{participant.first_name} {participant.last_name}</h1>
          <p className="text-sky-100 text-sm">Miembro desde {memberSince}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatCard icon={<BookOpen className="h-5 w-5" />} value={completed.length} label="Cursos Completados" />
            <StatCard icon={<Award className="h-5 w-5" />} value={certificates.length} label="Certificados" />
            <StatCard icon={<Clock className="h-5 w-5" />} value={totalHours} label="Horas" />
            <StatCard icon={<Star className="h-5 w-5" />} value={skills.length} label="Habilidades" />
          </div>
        </div>
      </div>

      {/* Mi Trayectoria */}
      {enrollments.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mi Trayectoria</h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />
            {enrollments.map((e, i) => {
              const course = e.course as any;
              const cert = certificates.find(c => (c as any).course_id === e.course_id);
              return (
                <div key={e.id} className="relative mb-4 last:mb-0">
                  <div className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                    e.status === 'completed' ? 'bg-emerald-500' : e.status === 'in_progress' ? 'bg-sky-500' : 'bg-gray-300'
                  }`} />
                  <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course?.title || 'Curso'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(e.enrolled_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {cert && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Award className="h-3 w-3 mr-1" />Certificado
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          e.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          e.status === 'in_progress' ? 'bg-sky-100 text-sky-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {e.status === 'completed' ? 'Completado' : e.status === 'in_progress' ? 'En curso' : 'Inscrito'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Mis Certificados */}
      {certificates.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mis Certificados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map(c => {
              const course = (c as any).course;
              return (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{course?.title || 'Curso'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(c.issued_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500 font-mono">{c.certificate_code}</span>
                        {(c as any).hours && (
                          <span className="text-xs text-gray-400">{(c as any).hours}h</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {c.verification_url && (
                    <Link to={c.verification_url}
                      className="mt-3 inline-flex items-center text-xs text-sky-600 hover:text-sky-700 font-medium group-hover:underline">
                      Verificar certificado <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Mis Habilidades */}
      {Object.keys(skillsByCategory).length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mis Habilidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(skillsByCategory).map(([category, catSkills]) => (
              <div key={category} className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{category}</h3>
                <div className="space-y-3">
                  {catSkills.map(s => (
                    <div key={s.skill.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{s.skill.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4].map(d => (
                            <div key={d} className={`h-2 w-2 rounded-full ${
                              d <= levelDots[s.level] ? 'bg-sky-500' : 'bg-gray-200'
                            }`} />
                          ))}
                        </div>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${SKILL_LEVEL_COLORS[s.level]}`}>
                          {SKILL_LEVEL_LABELS[s.level]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mis Rutas */}
      {paths.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mis Rutas de Aprendizaje</h2>
          <div className="space-y-3">
            {paths.map(path => {
              const pathCourses = path.courses || [];
              const totalRequired = pathCourses.filter(pc => pc.is_required).length || pathCourses.length;
              const completedInPath = pathCourses.filter(pc => completedSlugs.has(pc.course_slug)).length;
              const pct = totalRequired > 0 ? Math.round((completedInPath / totalRequired) * 100) : 0;

              if (completedInPath === 0) return null;

              return (
                <div key={path.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                        <Route className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{path.name}</p>
                        <p className="text-xs text-gray-400">{completedInPath} de {totalRequired} cursos</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  {pct < 100 && (
                    <Link to={`/rutas/${path.slug}`}
                      className="mt-3 inline-flex items-center text-xs text-teal-600 hover:text-teal-700 font-medium">
                      Continuar <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  )}
                </div>
              );
            }).filter(Boolean)}
          </div>
        </section>
      )}

      {/* Siguiente Paso Recomendado */}
      <NextStepRecommendation enrollments={enrollments} />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
    <div className="flex items-center gap-2 mb-1 text-sky-100">{icon}</div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-sky-200">{label}</p>
  </div>
);

const NextStepRecommendation: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  const completedSlugs = new Set(
    enrollments.filter(e => e.status === 'completed').map(e => (e.course as any)?.slug).filter(Boolean)
  );

  const recommendations = [
    { condition: completedSlugs.has('mis-primeros-pasos-digitales'), course: 'Introducción a la IA', slug: 'inteligencia-artificial-basico', reason: 'Ya completaste Primeros Pasos Digitales' },
    { condition: completedSlugs.has('inteligencia-artificial-basico'), course: 'IA para la Gestión Pública', slug: 'aplicando-la-ia-herramientas-y-soluciones-para-la-gestion-publica', reason: 'Tienes las bases de IA' },
    { condition: completedSlugs.has('introduccion-a-datos-abiertos'), course: 'Power BI', slug: 'introduccion-a-powerbi', reason: 'Complementa tu conocimiento en datos' },
  ];

  const rec = recommendations.find(r => r.condition && !completedSlugs.has(r.slug));
  if (!rec) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Tu Siguiente Paso Recomendado</h2>
      <div className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-xl border border-sky-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{rec.course}</p>
            <p className="text-xs text-gray-500 mt-0.5">{rec.reason}</p>
            <Link to={`/course/${rec.slug}`}
              className="mt-3 inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors">
              Ver curso <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalPassport;
