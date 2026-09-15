import React, { useEffect, useState } from 'react';
import { ClipboardCheck, Upload, Check, X as XIcon, Clock, AlertTriangle, Link2, Copy, CheckCheck, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  getCourses,
  getCourseSessions,
  getSessionAttendance,
  getCourseEnrollments,
  recordAttendance,
  getOrCreateAttendanceLink,
  toggleAttendanceLinkActive,
} from '../../services/participantService';
import type { Course, CourseSession, Attendance, Enrollment, AttendanceStatus, AttendanceFormLink } from '../../types/participants';
import AttendanceImportModal from '../../components/ui/admin/AttendanceImportModal';

const AttendancePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [enrolledParticipants, setEnrolledParticipants] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);

  const [formLink, setFormLink] = useState<AttendanceFormLink | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getCourses().then(c => { setCourses(c); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedSession('');
    setAttendanceRecords([]);
    setFormLink(null);
    if (!courseId) { setSessions([]); return; }
    const s = await getCourseSessions(courseId);
    setSessions(s);
    const e = await getCourseEnrollments(courseId);
    setEnrolledParticipants(e);
  };

  const handleSessionChange = async (sessionId: string) => {
    setSelectedSession(sessionId);
    setFormLink(null);
    if (!sessionId) { setAttendanceRecords([]); return; }
    setLoading(true);
    const a = await getSessionAttendance(sessionId);
    setAttendanceRecords(a);
    setLoading(false);
  };

  const refreshAttendance = async () => {
    if (!selectedSession) return;
    const a = await getSessionAttendance(selectedSession);
    setAttendanceRecords(a);
  };

  const toggleAttendance = async (participantId: string, status: AttendanceStatus) => {
    if (!selectedSession) return;
    await recordAttendance(participantId, selectedSession, status);
    await refreshAttendance();
  };

  const getAttendanceForParticipant = (participantId: string) => {
    return attendanceRecords.find(a => a.participant_id === participantId);
  };

  const handleGenerateLink = async () => {
    if (!selectedSession) return;
    setLinkLoading(true);
    try {
      const link = await getOrCreateAttendanceLink(selectedSession);
      setFormLink(link);
    } catch (err) {
      console.error('Error generating link:', err);
    }
    setLinkLoading(false);
  };

  const getPublicUrl = () => {
    if (!formLink) return '';
    const base = window.location.origin;
    return `${base}/asistencia/${formLink.token}`;
  };

  const handleCopyLink = async () => {
    const url = getPublicUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleLink = async () => {
    if (!formLink) return;
    try {
      await toggleAttendanceLinkActive(formLink.id, !formLink.is_active);
      setFormLink({ ...formLink, is_active: !formLink.is_active });
    } catch (err) {
      console.error('Error toggling link:', err);
    }
  };

  const statusButtons: { status: AttendanceStatus; label: string; icon: React.ReactNode; activeColor: string }[] = [
    { status: 'present', label: 'Presente', icon: <Check className="h-3.5 w-3.5" />, activeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    { status: 'late', label: 'Tarde', icon: <Clock className="h-3.5 w-3.5" />, activeColor: 'bg-amber-100 text-amber-700 border-amber-300' },
    { status: 'excused', label: 'Excusado', icon: <AlertTriangle className="h-3.5 w-3.5" />, activeColor: 'bg-blue-100 text-blue-700 border-blue-300' },
    { status: 'absent', label: 'Ausente', icon: <XIcon className="h-3.5 w-3.5" />, activeColor: 'bg-red-100 text-red-700 border-red-300' },
  ];

  const presentCount = attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asistencia</h1>
          <p className="text-gray-500 mt-1">Registra y consulta la asistencia a sesiones</p>
        </div>

        {/* Selectors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
              <select
                value={selectedCourse}
                onChange={e => handleCourseChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Seleccionar curso...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sesion</label>
              <select
                value={selectedSession}
                onChange={e => handleSessionChange(e.target.value)}
                disabled={!selectedCourse}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-50"
              >
                <option value="">Seleccionar sesion...</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title}{s.session_date ? ` (${new Date(s.session_date).toLocaleDateString('es-GT')})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedSession && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{presentCount}</span> de <span className="font-medium">{enrolledParticipants.length}</span> presentes
                {enrolledParticipants.length > 0 && (
                  <span className="ml-2 text-gray-400">({Math.round((presentCount / enrolledParticipants.length) * 100)}%)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateLink}
                  disabled={linkLoading}
                  className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  {linkLoading ? 'Generando...' : 'Formulario publico'}
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Share Link Panel */}
        {formLink && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Enlace de asistencia</h3>
              </div>
              <button
                onClick={handleToggleLink}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  formLink.is_active
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {formLink.is_active ? (
                  <><ToggleRight className="h-4 w-4" /> Activo</>
                ) : (
                  <><ToggleLeft className="h-4 w-4" /> Inactivo</>
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-3">
              Comparte este enlace con los participantes para que registren su asistencia usando su correo electronico.
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 font-mono truncate select-all">
                {getPublicUrl()}
              </div>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                {copied ? (
                  <><CheckCheck className="h-4 w-4 mr-1.5" /> Copiado</>
                ) : (
                  <><Copy className="h-4 w-4 mr-1.5" /> Copiar</>
                )}
              </button>
              <a
                href={getPublicUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {!formLink.is_active && (
              <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                El enlace esta desactivado. Los participantes no podran registrar su asistencia hasta que lo actives.
              </p>
            )}
          </div>
        )}

        {/* Attendance Table */}
        {selectedSession && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-sky-600 mx-auto"></div></div>
            ) : enrolledParticipants.length === 0 ? (
              <div className="p-12 text-center">
                <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay participantes inscritos en este curso</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {enrolledParticipants.map(ep => {
                  const p = ep.participant as any;
                  if (!p) return null;
                  const record = getAttendanceForParticipant(p.id);
                  return (
                    <div key={p.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold text-sm">
                          {p.first_name?.[0]}{p.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</p>
                          <p className="text-xs text-gray-500">{p.primary_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {statusButtons.map(btn => (
                          <button
                            key={btn.status}
                            onClick={() => toggleAttendance(p.id, btn.status)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              record?.status === btn.status ? btn.activeColor : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {btn.icon}
                            <span className="hidden sm:inline">{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showImportModal && selectedSession && (
        <AttendanceImportModal
          sessionId={selectedSession}
          enrolledParticipants={enrolledParticipants}
          onClose={() => setShowImportModal(false)}
          onComplete={refreshAttendance}
        />
      )}
    </>
  );
};

export default AttendancePage;
