import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit, Mail, Phone, MapPin, Building2, GraduationCap,
  Award, Calendar, Clock, Tag, Trash2, UserCheck, Briefcase,
  Star, BookOpen, Route, Shield, Copy, ExternalLink, ChevronRight,
} from 'lucide-react';
import {
  getParticipantById,
  getParticipantEnrollments,
  getParticipantAttendance,
  getParticipantCertificates,
  getParticipantTimeline,
  getParticipantTags,
  deleteParticipant,
  revokeCertificate,
} from '../../services/participantService';
import {
  getParticipantEffectiveSkills,
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_COLORS,
} from '../../services/skillService';
import type {
  Participant, Enrollment, Attendance, Certificate,
  ParticipationEvent, Tag as TagType, SkillLevel,
} from '../../types/participants';
import { STATUS_LABELS, STATUS_COLORS, ENROLLMENT_STATUS_LABELS } from '../../types/participants';

type TabId = 'overview' | 'courses' | 'attendance' | 'certificates' | 'skills' | 'history';

interface EffectiveSkill {
  skill: { id: string; name: string; slug: string; category: string; description: string | null };
  level: SkillLevel;
  sources: { source_type: string; source_id: string | null; date_acquired: string }[];
}

const ParticipantProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [timeline, setTimeline] = useState<ParticipationEvent[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [skills, setSkills] = useState<EffectiveSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getParticipantById(id),
      getParticipantEnrollments(id),
      getParticipantAttendance(id),
      getParticipantCertificates(id),
      getParticipantTimeline(id),
      getParticipantTags(id),
      getParticipantEffectiveSkills(id),
    ])
      .then(([p, e, a, c, t, tg, sk]) => {
        setParticipant(p);
        setEnrollments(e);
        setAttendance(a);
        setCertificates(c);
        setTimeline(t);
        setTags(tg);
        setSkills(sk);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    await deleteParticipant(id);
    navigate('/dashboard/participantes');
  };

  const handleRevoke = async (certId: string) => {
    setRevoking(certId);
    try {
      await revokeCertificate(certId);
      setCertificates(prev => prev.map(c => c.id === certId ? { ...c, status: 'revoked' as const, revoked_at: new Date().toISOString() } : c));
    } catch { /* ignore */ }
    setRevoking(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Participante no encontrado.</p>
        <Link to="/dashboard/participantes" className="text-sky-600 hover:underline text-sm mt-2 inline-block">
          Volver a la lista
        </Link>
      </div>
    );
  }

  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const attendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
    : 0;
  const totalHours = certificates.reduce((sum, c) => sum + (c.hours ?? 0), 0);
  const activeCerts = certificates.filter(c => c.status !== 'revoked');

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'overview', label: 'Resumen' },
    { id: 'courses', label: 'Cursos', count: enrollments.length },
    { id: 'attendance', label: 'Asistencia', count: attendance.length },
    { id: 'certificates', label: 'Certificados', count: activeCerts.length },
    { id: 'skills', label: 'Habilidades', count: skills.length },
    { id: 'history', label: 'Historial', count: timeline.length },
  ];

  const skillsByCategory = skills.reduce<Record<string, EffectiveSkill[]>>((acc, s) => {
    const cat = s.skill.category;
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate('/dashboard/participantes')} className="p-2 rounded-lg hover:bg-gray-100 mt-1">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {participant.first_name[0]}{participant.last_name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{participant.first_name} {participant.last_name}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[participant.status]}`}>
                    {STATUS_LABELS[participant.status]}
                  </span>
                  {participant.business_owner && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Briefcase className="h-3 w-3 mr-1" />Emprendedor
                    </span>
                  )}
                  {participant.public_official && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <Shield className="h-3 w-3 mr-1" />Servidor Público
                    </span>
                  )}
                  {tags.map(t => (
                    <span key={t.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700" style={{ borderLeft: `3px solid ${t.color}` }}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/participantes/${id}/editar`}
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium transition-colors">
            <Edit className="h-4 w-4 mr-2" />Editar
          </Link>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleDelete} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Confirmar</button>
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="Inscripciones" value={enrollments.length} icon={<BookOpen className="h-5 w-5 text-sky-500" />} />
        <KPICard label="Completados" value={completedCourses} icon={<GraduationCap className="h-5 w-5 text-emerald-500" />} />
        <KPICard label="Certificados" value={activeCerts.length} icon={<Award className="h-5 w-5 text-amber-500" />} />
        <KPICard label="Asistencia" value={`${attendanceRate}%`} icon={<UserCheck className="h-5 w-5 text-teal-500" />} />
        <KPICard label="Horas" value={totalHours} icon={<Clock className="h-5 w-5 text-blue-500" />} />
        <KPICard label="Habilidades" value={skills.length} icon={<Star className="h-5 w-5 text-rose-500" />} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 px-4 sm:px-6 overflow-x-auto">
          <nav className="flex gap-1 sm:gap-4 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-500'
                  }`}>{tab.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab participant={participant} enrollments={enrollments} certificates={activeCerts} skills={skills} skillsByCategory={skillsByCategory} />
          )}
          {activeTab === 'courses' && (
            <CoursesTab enrollments={enrollments} />
          )}
          {activeTab === 'attendance' && (
            <AttendanceTab attendance={attendance} />
          )}
          {activeTab === 'certificates' && (
            <CertificatesTab certificates={certificates} onRevoke={handleRevoke} revoking={revoking} onCopy={copyToClipboard} />
          )}
          {activeTab === 'skills' && (
            <SkillsTab skillsByCategory={skillsByCategory} />
          )}
          {activeTab === 'history' && (
            <HistoryTab timeline={timeline} />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const KPICard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
    <div className="flex items-center justify-between mb-2">
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 uppercase font-medium mt-0.5">{label}</p>
  </div>
);

const DetailRow: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 text-sm">
    {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
    <span className="text-gray-500 min-w-[120px]">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

const OverviewTab: React.FC<{
  participant: Participant;
  enrollments: Enrollment[];
  certificates: Certificate[];
  skills: EffectiveSkill[];
  skillsByCategory: Record<string, EffectiveSkill[]>;
}> = ({ participant, enrollments, certificates, skills, skillsByCategory }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Contacto</h3>
        <div className="space-y-2.5">
          <DetailRow label="Email" value={participant.primary_email} icon={<Mail className="h-4 w-4" />} />
          {participant.phone && <DetailRow label="Teléfono" value={participant.phone} icon={<Phone className="h-4 w-4" />} />}
          {participant.department && (
            <DetailRow
              label="Ubicación"
              value={`${participant.municipality ? `${participant.municipality}, ` : ''}${participant.department}${participant.country && participant.country !== 'Guatemala' ? `, ${participant.country}` : ''}`}
              icon={<MapPin className="h-4 w-4" />}
            />
          )}
          {(participant.institution || participant.organization) && (
            <DetailRow
              label="Institución"
              value={`${participant.institution || (participant.organization as any)?.name || ''}${participant.job_title ? ` - ${participant.job_title}` : participant.role_in_org ? ` - ${participant.role_in_org}` : ''}`}
              icon={<Building2 className="h-4 w-4" />}
            />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Detalles</h3>
        <dl className="space-y-2">
          {participant.dpi && <DetailRow label="DPI" value={participant.dpi} />}
          {participant.gender && <DetailRow label="Género" value={participant.gender} />}
          {participant.age_range && <DetailRow label="Rango de edad" value={participant.age_range} />}
          {participant.education_level && <DetailRow label="Educación" value={participant.education_level} />}
          {participant.digital_skill_level && <DetailRow label="Nivel digital" value={participant.digital_skill_level} />}
          <DetailRow label="Registrado" value={new Date(participant.created_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })} />
          {participant.last_activity_at && (
            <DetailRow label="Última actividad" value={new Date(participant.last_activity_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })} />
          )}
        </dl>
      </div>

      {participant.notes && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Notas</h3>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{participant.notes}</p>
        </div>
      )}
    </div>

    <div className="space-y-6">
      {enrollments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Cursos Recientes</h3>
          <div className="space-y-2">
            {enrollments.slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <GraduationCap className="h-4 w-4 text-sky-500 flex-shrink-0" />
                  <span className="text-sm text-gray-900 truncate">{e.course?.title || 'Curso'}</span>
                </div>
                <span className="text-xs font-medium text-gray-600 flex-shrink-0 ml-2">{ENROLLMENT_STATUS_LABELS[e.status]}</span>
              </div>
            ))}
            {enrollments.length > 5 && (
              <button onClick={() => {}} className="text-xs text-sky-600 hover:text-sky-700 font-medium">
                Ver todos ({enrollments.length})
              </button>
            )}
          </div>
        </div>
      )}

      {certificates.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Certificados</h3>
          <div className="space-y-2">
            {certificates.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-3 min-w-0">
                  <Award className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.course?.title || 'Curso'}</p>
                    <p className="text-xs text-gray-500">{c.certificate_code}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">{new Date(c.issued_at).toLocaleDateString('es-GT')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(skillsByCategory).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Habilidades</h3>
          <div className="space-y-3">
            {Object.entries(skillsByCategory).slice(0, 3).map(([cat, catSkills]) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">{cat}</p>
                <div className="flex flex-wrap gap-1.5">
                  {catSkills.map(s => (
                    <span key={s.skill.id} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SKILL_LEVEL_COLORS[s.level]}`}>
                      {s.skill.name} - {SKILL_LEVEL_LABELS[s.level]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const CoursesTab: React.FC<{ enrollments: Enrollment[] }> = ({ enrollments }) => {
  if (enrollments.length === 0) {
    return <EmptyState text="Sin inscripciones registradas" />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Curso</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Progreso</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {enrollments.map(e => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-sky-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{e.course?.title || 'Curso'}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
                {new Date(e.enrolled_at).toLocaleDateString('es-GT')}
              </td>
              <td className="px-4 py-3">
                <EnrollmentBadge status={e.status} />
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-sky-500 h-1.5 rounded-full transition-all" style={{ width: `${e.completion_percentage}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{e.completion_percentage}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AttendanceTab: React.FC<{ attendance: Attendance[] }> = ({ attendance }) => {
  if (attendance.length === 0) {
    return <EmptyState text="Sin registros de asistencia" />;
  }
  return (
    <div className="space-y-2">
      {attendance.map(a => (
        <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex items-center gap-3">
            <UserCheck className={`h-4 w-4 ${a.status === 'present' ? 'text-emerald-500' : a.status === 'late' ? 'text-amber-500' : a.status === 'excused' ? 'text-blue-500' : 'text-red-400'}`} />
            <div>
              <p className="text-sm text-gray-700">{(a.session as any)?.title || 'Sesión'}</p>
              <p className="text-xs text-gray-400">{(a.session as any)?.course?.title}</p>
            </div>
          </div>
          <AttendanceBadge status={a.status} />
        </div>
      ))}
    </div>
  );
};

const CertificatesTab: React.FC<{
  certificates: Certificate[];
  onRevoke: (id: string) => void;
  revoking: string | null;
  onCopy: (text: string) => void;
}> = ({ certificates, onRevoke, revoking, onCopy }) => {
  if (certificates.length === 0) {
    return <EmptyState text="Sin certificados emitidos" />;
  }

  const CERT_STATUS_COLORS: Record<string, string> = {
    emitted: 'bg-emerald-100 text-emerald-700',
    revoked: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  };
  const CERT_STATUS_LABELS: Record<string, string> = {
    emitted: 'Emitido',
    revoked: 'Revocado',
    pending: 'Pendiente',
  };

  return (
    <div className="space-y-3">
      {certificates.map(c => (
        <div key={c.id} className={`p-4 rounded-xl border ${c.status === 'revoked' ? 'border-red-100 bg-red-50/30' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Award className={`h-5 w-5 mt-0.5 flex-shrink-0 ${c.status === 'revoked' ? 'text-red-400' : 'text-amber-500'}`} />
              <div className="min-w-0">
                <p className={`text-sm font-medium ${c.status === 'revoked' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {c.course?.title || 'Curso'}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-gray-500">Código: {c.certificate_code}</span>
                  {c.hours && <span className="text-xs text-gray-500">{c.hours}h</span>}
                  <span className="text-xs text-gray-500">{new Date(c.issued_at).toLocaleDateString('es-GT')}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CERT_STATUS_COLORS[c.status] || ''}`}>
                    {CERT_STATUS_LABELS[c.status] || c.status}
                  </span>
                </div>
                {c.status === 'revoked' && c.revoked_at && (
                  <p className="text-xs text-red-500 mt-1">Revocado: {new Date(c.revoked_at).toLocaleDateString('es-GT')}</p>
                )}
              </div>
            </div>

            {c.status !== 'revoked' && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onCopy(c.certificate_code)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copiar código"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {c.verification_url && (
                  <Link
                    to={c.verification_url}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Verificar"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
                <button
                  onClick={() => onRevoke(c.id)}
                  disabled={revoking === c.id}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
                >
                  {revoking === c.id ? '...' : 'Revocar'}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const SkillsTab: React.FC<{ skillsByCategory: Record<string, EffectiveSkill[]> }> = ({ skillsByCategory }) => {
  if (Object.keys(skillsByCategory).length === 0) {
    return <EmptyState text="Sin habilidades registradas" />;
  }

  const levelDots: Record<SkillLevel, number> = { basico: 1, intermedio: 2, avanzado: 3, especializado: 4 };

  return (
    <div className="space-y-6">
      {Object.entries(skillsByCategory).map(([category, catSkills]) => (
        <div key={category}>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {catSkills.map(s => (
              <div key={s.skill.id} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{s.skill.name}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SKILL_LEVEL_COLORS[s.level]}`}>
                    {SKILL_LEVEL_LABELS[s.level]}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4].map(dot => (
                    <div
                      key={dot}
                      className={`h-2 w-2 rounded-full ${dot <= levelDots[s.level] ? 'bg-sky-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                {s.sources.length > 1 && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Adquirida en {s.sources.length} cursos
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const HistoryTab: React.FC<{ timeline: ParticipationEvent[] }> = ({ timeline }) => {
  if (timeline.length === 0) {
    return <EmptyState text="Sin eventos registrados" />;
  }
  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
      {timeline.map(ev => (
        <div key={ev.id} className="relative">
          <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-sky-500 border-2 border-white shadow-sm" />
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">{ev.event_type.replace('_', ' ')}</span>
              <span className="text-xs text-gray-400">{new Date(ev.created_at).toLocaleString('es-GT')}</span>
            </div>
            {Object.keys(ev.event_data).length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{JSON.stringify(ev.event_data)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const EnrollmentBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    enrolled: 'bg-sky-100 text-sky-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    dropped: 'bg-red-100 text-red-700',
    waitlisted: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {ENROLLMENT_STATUS_LABELS[status as keyof typeof ENROLLMENT_STATUS_LABELS] || status}
    </span>
  );
};

const AttendanceBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    present: 'bg-emerald-100 text-emerald-700',
    late: 'bg-amber-100 text-amber-700',
    excused: 'bg-blue-100 text-blue-700',
    absent: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = { present: 'Presente', late: 'Tarde', excused: 'Excusado', absent: 'Ausente' };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100'}`}>
      {labels[status] || status}
    </span>
  );
};

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-gray-400 text-sm text-center py-8">{text}</p>
);

export default ParticipantProfilePage;
