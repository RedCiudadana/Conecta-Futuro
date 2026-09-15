import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, BookOpen, Clock, Star, GraduationCap, ChevronRight,
  Shield, Route, Lock, LogIn, Sparkles, TrendingUp, Share2, Check, Link as LinkIcon,
  Mail, KeyRound, ArrowRight, AlertCircle, Loader2, LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabase';
import type { Enrollment, Certificate, SkillLevel } from '../../types/participants';
import {
  getParticipantEffectiveSkills,
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_COLORS,
} from '../../services/skillService';
import {
  getParticipantBadges,
  getParticipantPathProgress,
  getRecommendations,
  checkAndAwardSkillBadges,
  checkMilestoneBadges,
  BADGE_COLORS,
} from '../../services/badgeService';
import type { ParticipantBadge, PathProgress, CourseRecommendation } from '../../services/badgeService';
import { togglePublicProfile } from '../../services/publicProfileService';

interface PassportData {
  participant: { id: string; first_name: string; last_name: string; primary_email: string; created_at: string; public_profile_enabled?: boolean; profile_slug?: string | null } | null;
  enrollments: Enrollment[];
  certificates: Certificate[];
  skills: { skill: { id: string; name: string; category: string }; level: SkillLevel; sources: any[] }[];
  badges: ParticipantBadge[];
  pathProgress: PathProgress[];
  recommendations: CourseRecommendation[];
  paths: { id: string; name: string; slug: string }[];
}

const DigitalPassport: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileEnabled, setProfileEnabled] = useState(false);
  const [profileSlug, setProfileSlug] = useState<string | null>(null);
  const [shareToggeling, setShareToggeling] = useState(false);
  const [copied, setCopied] = useState(false);

  // Email + code access flow (for non-authenticated users)
  const [accessEmail, setAccessEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [verifiedParticipantId, setVerifiedParticipantId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) { loadPassport(user.email); }
    else if (verifiedParticipantId) { loadPassportById(verifiedParticipantId); }
    else { setLoading(false); }
  }, [user?.email, verifiedParticipantId]);

  async function loadPassport(email: string) {
    setLoading(true);
    try {
      const { data: p } = await supabase.rpc('lookup_participant_for_passport', { p_email: email });
      if (p && p.length > 0) { await loadPassportData(p[0]); }
      else { setData(null); }
    } catch { setData(null); }
    setLoading(false);
  }

  async function loadPassportById(participantId: string) {
    setLoading(true);
    try {
      const { data: p } = await supabase
        .from('participants')
        .select('id, first_name, last_name, primary_email, created_at, public_profile_enabled, profile_slug')
        .eq('id', participantId)
        .maybeSingle();
      if (p) { await loadPassportData(p); }
      else { setData(null); }
    } catch { setData(null); }
    setLoading(false);
  }

  async function loadPassportData(participant: any) {
    const [enrollRes, certRes, skills, badges, pathProgress, recommendations, pathsRes] = await Promise.all([
      supabase.from('enrollments').select('*, course:courses(*)').eq('participant_id', participant.id).order('enrolled_at', { ascending: false }),
      supabase.from('certificates').select('*, course:courses(*)').eq('participant_id', participant.id).neq('status', 'revoked').order('issued_at', { ascending: false }),
      getParticipantEffectiveSkills(participant.id),
      getParticipantBadges(participant.id),
      getParticipantPathProgress(participant.id),
      getRecommendations(participant.id, 4),
      supabase.from('learning_paths').select('id, name, slug').eq('status', 'active').eq('is_visible', true),
    ]);
    checkAndAwardSkillBadges(participant.id).catch(() => {});
    checkMilestoneBadges(participant.id).catch(() => {});
    setProfileEnabled(participant.public_profile_enabled ?? false);
    setProfileSlug(participant.profile_slug ?? null);
    setData({
      participant,
      enrollments: enrollRes.data ?? [],
      certificates: certRes.data ?? [],
      skills,
      badges,
      pathProgress,
      recommendations,
      paths: pathsRes.data ?? [],
    });
  }

  async function sendAccessCode() {
    if (!accessEmail.trim()) { setAccessError('Ingresa tu correo electronico'); return; }
    setSendingCode(true);
    setAccessError(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-passport-code`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: accessEmail }),
      });
      const result = await res.json();
      if (!res.ok) { setAccessError(result.error || 'Error al enviar el codigo'); }
      else { setCodeSent(true); }
    } catch { setAccessError('Error de conexion'); }
    setSendingCode(false);
  }

  async function verifyAccessCode() {
    if (!accessCode.trim()) { setAccessError('Ingresa el codigo de 6 digitos'); return; }
    setVerifying(true);
    setAccessError(null);
    try {
      const { data: codeRow } = await supabase
        .from('passport_access_codes')
        .select('id, participant_id, expires_at, used_at')
        .eq('email', accessEmail.toLowerCase().trim())
        .eq('code', accessCode.trim())
        .is('used_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!codeRow) { setAccessError('Codigo invalido'); setVerifying(false); return; }
      if (new Date(codeRow.expires_at) < new Date()) { setAccessError('El codigo ha expirado. Solicita uno nuevo.'); setVerifying(false); return; }
      if (!codeRow.participant_id) { setAccessError('No se encontro participante asociado'); setVerifying(false); return; }

      await supabase.from('passport_access_codes').update({ used_at: new Date().toISOString() }).eq('id', codeRow.id);
      setVerifiedParticipantId(codeRow.participant_id);
    } catch { setAccessError('Error al verificar'); }
    setVerifying(false);
  }

  if (!user && !verifiedParticipantId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-sky-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Pasaporte Conecta Futuro</h1>
            <p className="text-gray-500">Accede a tu trayectoria: certificados, insignias, habilidades y avances.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            {!codeSent ? (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Mail className="h-4 w-4 text-sky-500" /> Ingresa tu correo electronico
                </div>
                <p className="text-xs text-gray-500">
                  Te enviaremos un codigo de 6 digitos para verificar tu identidad y proteger tus datos.
                </p>
                <input
                  type="email"
                  value={accessEmail}
                  onChange={e => setAccessEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAccessCode()}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                {accessError && (
                  <div className="flex items-center gap-2 text-xs text-red-600"><AlertCircle className="h-3.5 w-3.5" />{accessError}</div>
                )}
                <button
                  onClick={sendAccessCode}
                  disabled={sendingCode}
                  className="w-full px-4 py-3 bg-sky-600 text-white rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sendingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="h-4 w-4" /> Enviar codigo</>}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <KeyRound className="h-4 w-4 text-sky-500" /> Ingresa el codigo
                </div>
                <p className="text-xs text-gray-500">
                  Enviamos un codigo de 6 digitos a <strong className="text-gray-700">{accessEmail}</strong>. Expira en 10 minutos.
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={accessCode}
                  onChange={e => setAccessCode(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && verifyAccessCode()}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                {accessError && (
                  <div className="flex items-center gap-2 text-xs text-red-600"><AlertCircle className="h-3.5 w-3.5" />{accessError}</div>
                )}
                <button
                  onClick={verifyAccessCode}
                  disabled={verifying || accessCode.length !== 6}
                  className="w-full px-4 py-3 bg-sky-600 text-white rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Acceder</>}
                </button>
                <button
                  onClick={() => { setCodeSent(false); setAccessCode(''); setAccessError(null); }}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cambiar correo
                </button>
              </>
            )}
          </div>

          {/* Data protection notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Proteccion de datos: Solo tu puedes ver tu informacion completa. No compartimos tus datos personales (DPI, telefono, direccion) con nadie. Tu pasaporte muestra unicamente tus logros academicos: cursos, certificados, insignias y habilidades.
              </p>
            </div>
          </div>

          {user === null && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">¿Ya tienes cuenta?</p>
              <Link to="/login" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                Inicia sesion
              </Link>
            </div>
          )}
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
          <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pasaporte No Disponible</h1>
          <p className="text-gray-500 mb-6">No encontramos un perfil asociado a tu cuenta. Inscribete en un curso para comenzar.</p>
          <Link to="/courses" className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors">
            <BookOpen className="h-5 w-5 mr-2" />Ver Cursos
          </Link>
        </div>
      </div>
    );
  }

  const { participant, enrollments, certificates, skills, badges, pathProgress, recommendations, paths } = data;
  const completed = enrollments.filter(e => e.status === 'completed');
  const totalHours = certificates.reduce((sum, c) => sum + ((c as any).hours ?? 0), 0);
  const memberSince = new Date(participant.created_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long' });
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.skill.category] ??= []).push(s);
    return acc;
  }, {});
  const levelDots: Record<SkillLevel, number> = { basico: 1, intermedio: 2, avanzado: 3, especializado: 4 };
  const isGuestAccess = !user && !!verifiedParticipantId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-sky-600 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <p className="text-sky-200 text-sm font-medium uppercase tracking-wider mb-2">Pasaporte Digital</p>
          <h1 className="text-3xl font-bold mb-1">{participant.first_name} {participant.last_name}</h1>
          <p className="text-sky-100 text-sm">Miembro desde {memberSince}</p>
          {isGuestAccess && (
            <button
              onClick={() => { setVerifiedParticipantId(null); setData(null); setCodeSent(false); setAccessCode(''); setAccessEmail(''); }}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-medium text-white transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Salir
            </button>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            <StatCard icon={<BookOpen className="h-5 w-5" />} value={completed.length} label="Completados" />
            <StatCard icon={<Award className="h-5 w-5" />} value={certificates.length} label="Certificados" />
            <StatCard icon={<Clock className="h-5 w-5" />} value={totalHours} label="Horas" />
            <StatCard icon={<Star className="h-5 w-5" />} value={skills.length} label="Habilidades" />
            <StatCard icon={<Sparkles className="h-5 w-5" />} value={badges.length} label="Insignias" />
          </div>
        </div>
      </div>

      {/* Public Profile Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-sky-50 rounded-xl border border-sky-100">
        <div>
          <p className="text-sm font-semibold text-sky-900">Perfil público</p>
          <p className="text-xs text-sky-600 mt-0.5">Comparte tus logros en LinkedIn o tu currículum</p>
        </div>
        <div className="flex items-center gap-3">
          {profileEnabled && profileSlug && (
            <button
              onClick={() => {
                const url = `${window.location.origin}/perfil/${profileSlug}`;
                navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
              }}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-sky-200 text-sky-700 hover:bg-sky-100 transition-colors"
            >
              {copied ? <><Check className="h-3.5 w-3.5 mr-1" />Copiado</> : <><LinkIcon className="h-3.5 w-3.5 mr-1" />Copiar enlace</>}
            </button>
          )}
          <button
            disabled={shareToggeling}
            onClick={async () => {
              if (!participant) return;
              setShareToggeling(true);
              const newVal = !profileEnabled;
              const slug = await togglePublicProfile(participant.id, newVal);
              setProfileEnabled(newVal);
              if (slug) setProfileSlug(slug);
              setShareToggeling(false);
            }}
            className={`relative w-11 h-6 rounded-full transition-colors ${profileEnabled ? 'bg-sky-500' : 'bg-gray-300'} ${shareToggeling ? 'opacity-60' : ''}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${profileEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Badges Showcase */}
      {badges.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />Mis Insignias
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {badges.map(pb => {
              const badge = pb.badge;
              if (!badge) return null;
              const c = BADGE_COLORS[badge.color] || BADGE_COLORS.sky;
              return (
                <div key={pb.id} className={`rounded-xl border ${c.border} p-4 text-center hover:shadow-md transition-shadow ${c.bg}`}>
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center bg-white shadow-sm`}>
                    <Award className={`h-7 w-7 ${c.text}`} />
                  </div>
                  <p className={`text-sm font-bold ${c.text}`}>{badge.name}</p>
                  {badge.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{badge.description}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(pb.awarded_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'short' })}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Path Progress */}
      {pathProgress.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5 text-teal-500" />Mis Rutas de Aprendizaje
          </h2>
          <div className="space-y-3">
            {pathProgress.map(pp => {
              const pathInfo = paths.find(p => p.id === pp.learning_path_id);
              const isComplete = pp.status === 'completed';
              return (
                <div key={pp.id} className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow ${isComplete ? 'border-emerald-200' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isComplete ? 'bg-emerald-100' : 'bg-teal-100'}`}>
                        {isComplete ? <GraduationCap className="h-5 w-5 text-emerald-600" /> : <Route className="h-5 w-5 text-teal-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{pathInfo?.name || 'Ruta'}</p>
                        <p className="text-xs text-gray-400">{pp.courses_completed} de {pp.courses_total} cursos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${isComplete ? 'text-emerald-600' : 'text-gray-900'}`}>{pp.completion_percentage}%</span>
                      {isComplete && <p className="text-xs text-emerald-600 font-medium">Completada</p>}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all duration-700 ${isComplete ? 'bg-emerald-500' : 'bg-teal-500'}`}
                      style={{ width: `${pp.completion_percentage}%` }} />
                  </div>
                  {!isComplete && pathInfo?.slug && (
                    <Link to={`/rutas/${pathInfo.slug}`}
                      className="mt-3 inline-flex items-center text-xs text-teal-600 hover:text-teal-700 font-medium">
                      Continuar <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  )}
                  {isComplete && pp.completed_at && (
                    <p className="text-xs text-gray-400 mt-2">
                      Completada el {new Date(pp.completed_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />Mis Certificados
          </h2>
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
                        {(c as any).hours && <span className="text-xs text-gray-400">{(c as any).hours}h</span>}
                      </div>
                    </div>
                  </div>
                  {c.verification_url && (
                    <Link to={c.verification_url}
                      className="mt-3 inline-flex items-center text-xs text-sky-600 hover:text-sky-700 font-medium group-hover:underline">
                      Verificar <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {Object.keys(skillsByCategory).length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-sky-500" />Mis Habilidades
          </h2>
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
                            <div key={d} className={`h-2 w-2 rounded-full ${d <= levelDots[s.level] ? 'bg-sky-500' : 'bg-gray-200'}`} />
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

      {/* Timeline */}
      {enrollments.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-500" />Mi Trayectoria
          </h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />
            {enrollments.slice(0, 10).map(e => {
              const course = e.course as any;
              const cert = certificates.find(c => (c as any).course_id === e.course_id);
              return (
                <div key={e.id} className="relative mb-3 last:mb-0">
                  <div className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                    e.status === 'completed' ? 'bg-emerald-500' : e.status === 'in_progress' ? 'bg-sky-500' : 'bg-gray-300'
                  }`} />
                  <div className="bg-white rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{course?.title || 'Curso'}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(e.enrolled_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {cert && <Award className="h-3.5 w-3.5 text-amber-500" />}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
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

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />Recomendado Para Ti
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map((rec, i) => (
              <Link key={rec.course.id} to={`/course/${rec.course.slug}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-sky-200 transition-all group">
                <div className="flex items-start gap-3">
                  {rec.course.thumbnail_url ? (
                    <img src={rec.course.thumbnail_url} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-sky-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-sky-700 transition-colors truncate">
                      {rec.course.title}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {rec.course.level && <span className="text-[10px] text-gray-400">{rec.course.level}</span>}
                      {rec.course.category && <span className="text-[10px] text-gray-400">{rec.course.category}</span>}
                    </div>
                    <div className="mt-2 space-y-0.5">
                      {rec.reasons.slice(0, 2).map((reason, ri) => (
                        <p key={ri} className="text-xs text-teal-600 flex items-center gap-1">
                          <ChevronRight className="h-3 w-3 flex-shrink-0" />{reason}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
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

export default DigitalPassport;
