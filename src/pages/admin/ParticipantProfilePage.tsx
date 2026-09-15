import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit, Mail, Phone, MapPin, Building2, GraduationCap,
  Award, Calendar, Clock, Tag, Trash2, UserCheck,
} from 'lucide-react';
import {
  getParticipantById,
  getParticipantEnrollments,
  getParticipantAttendance,
  getParticipantCertificates,
  getParticipantTimeline,
  getParticipantTags,
  deleteParticipant,
} from '../../services/participantService';
import type { Participant, Enrollment, Attendance, Certificate, ParticipationEvent, Tag as TagType } from '../../types/participants';
import { STATUS_LABELS, STATUS_COLORS, ENROLLMENT_STATUS_LABELS } from '../../types/participants';

const ParticipantProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [timeline, setTimeline] = useState<ParticipationEvent[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'attendance' | 'timeline'>('overview');
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    ])
      .then(([p, e, a, c, t, tg]) => {
        setParticipant(p);
        setEnrollments(e);
        setAttendance(a);
        setCertificates(c);
        setTimeline(t);
        setTags(tg);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    await deleteParticipant(id);
    navigate('/dashboard/participantes');
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

  const attendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
    : 0;

  const tabs = [
    { id: 'overview' as const, label: 'Resumen' },
    { id: 'enrollments' as const, label: `Inscripciones (${enrollments.length})` },
    { id: 'attendance' as const, label: `Asistencia (${attendance.length})` },
    { id: 'timeline' as const, label: `Historial (${timeline.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate('/admin/participantes')} className="p-2 rounded-lg hover:bg-gray-100 mt-1">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xl">
                {participant.first_name[0]}{participant.last_name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{participant.first_name} {participant.last_name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[participant.status]}`}>
                    {STATUS_LABELS[participant.status]}
                  </span>
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
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleDelete} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Confirmar
              </button>
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-medium">Inscripciones</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{enrollments.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-medium">Completados</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{enrollments.filter(e => e.status === 'completed').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-medium">Asistencia</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{attendanceRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-medium">Certificados</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{certificates.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 px-6">
          <nav className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{participant.primary_email}</span>
                  </div>
                  {participant.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{participant.phone}</span>
                    </div>
                  )}
                  {participant.department && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{participant.municipality ? `${participant.municipality}, ` : ''}{participant.department}</span>
                    </div>
                  )}
                  {participant.organization && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{(participant.organization as any).name}{participant.role_in_org ? ` - ${participant.role_in_org}` : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Detalles</h3>
                <dl className="space-y-3">
                  {participant.dpi && <DetailRow label="DPI" value={participant.dpi} />}
                  {participant.gender && <DetailRow label="Género" value={participant.gender} />}
                  {participant.birth_date && <DetailRow label="Fecha de nacimiento" value={new Date(participant.birth_date).toLocaleDateString('es-GT')} />}
                  {participant.digital_skill_level && <DetailRow label="Nivel digital" value={participant.digital_skill_level} />}
                  {participant.how_found_us && <DetailRow label="Cómo nos encontró" value={participant.how_found_us} />}
                  <DetailRow label="Registrado" value={new Date(participant.created_at).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })} />
                </dl>
              </div>

              {/* Notes */}
              {participant.notes && (
                <div className="lg:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Notas</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{participant.notes}</p>
                </div>
              )}

              {/* Certificates */}
              {certificates.length > 0 && (
                <div className="lg:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Certificados</h3>
                  <div className="space-y-2">
                    {certificates.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{c.course?.title || 'Curso'}</p>
                            <p className="text-xs text-gray-500">Código: {c.certificate_code}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(c.issued_at).toLocaleDateString('es-GT')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'enrollments' && (
            <div>
              {enrollments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Sin inscripciones registradas</p>
              ) : (
                <div className="space-y-3">
                  {enrollments.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-sky-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{e.course?.title || 'Curso'}</p>
                          <p className="text-xs text-gray-500">Inscrito: {new Date(e.enrolled_at).toLocaleDateString('es-GT')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-gray-600">{ENROLLMENT_STATUS_LABELS[e.status]}</span>
                        <div className="mt-1 w-24 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${e.completion_percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              {attendance.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Sin registros de asistencia</p>
              ) : (
                <div className="space-y-2">
                  {attendance.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <UserCheck className={`h-4 w-4 ${a.status === 'present' ? 'text-emerald-500' : a.status === 'late' ? 'text-amber-500' : 'text-red-400'}`} />
                        <div>
                          <p className="text-sm text-gray-700">{(a.session as any)?.title || 'Sesión'}</p>
                          <p className="text-xs text-gray-400">{(a.session as any)?.course?.title}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        a.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                        a.status === 'late' ? 'bg-amber-100 text-amber-700' :
                        a.status === 'excused' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {a.status === 'present' ? 'Presente' : a.status === 'late' ? 'Tarde' : a.status === 'excused' ? 'Excusado' : 'Ausente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              {timeline.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Sin eventos registrados</p>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <dt className="text-gray-500">{label}</dt>
    <dd className="text-gray-900 font-medium capitalize">{value}</dd>
  </div>
);

export default ParticipantProfilePage;
