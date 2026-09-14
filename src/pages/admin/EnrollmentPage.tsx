import React, { useEffect, useState } from 'react';
import { GraduationCap, Plus, Search } from 'lucide-react';
import {
  getCourses,
  getCourseEnrollments,
  getParticipants,
  enrollParticipant,
  updateEnrollment,
} from '../../services/participantService';
import type { Course, Enrollment, Participant } from '../../types/participants';
import { ENROLLMENT_STATUS_LABELS, PROGRAM_LABELS } from '../../types/participants';

const EnrollmentPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    getCourses().then(c => { setCourses(c); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const selectCourse = async (course: Course) => {
    setSelectedCourse(course);
    setLoading(true);
    try {
      const e = await getCourseEnrollments(course.id);
      setEnrollments(e);
    } catch { }
    setLoading(false);
  };

  const searchParticipants = async () => {
    if (!searchTerm.trim()) return;
    try {
      const { data } = await getParticipants({ search: searchTerm }, 1);
      setSearchResults(data);
    } catch { }
  };

  const handleEnroll = async (participantId: string) => {
    if (!selectedCourse) return;
    setEnrolling(true);
    try {
      await enrollParticipant(participantId, selectedCourse.id);
      const e = await getCourseEnrollments(selectedCourse.id);
      setEnrollments(e);
      setShowEnrollModal(false);
      setSearchTerm('');
      setSearchResults([]);
    } catch { }
    setEnrolling(false);
  };

  const handleStatusChange = async (enrollmentId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
        updates.completion_percentage = 100;
      }
      await updateEnrollment(enrollmentId, updates);
      if (selectedCourse) {
        const e = await getCourseEnrollments(selectedCourse.id);
        setEnrollments(e);
      }
    } catch { }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inscripciones</h1>
        <p className="text-gray-500 mt-1">Gestiona las inscripciones a cursos y programas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Cursos</h2>
          </div>
          {loading && !selectedCourse ? (
            <div className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-sky-600 mx-auto"></div></div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No hay cursos registrados</div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
              {courses.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectCourse(c)}
                  className={`w-full text-left p-4 hover:bg-sky-50 transition-colors ${selectedCourse?.id === c.id ? 'bg-sky-50 border-l-4 border-sky-500' : ''}`}
                >
                  <p className="text-sm font-medium text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {c.program ? PROGRAM_LABELS[c.program] : 'Sin programa'}
                    {c.start_date && ` | ${new Date(c.start_date).toLocaleDateString('es-GT')}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Enrollment List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {!selectedCourse ? (
            <div className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Selecciona un curso para ver las inscripciones</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedCourse.title}</h2>
                  <p className="text-sm text-gray-500">{enrollments.length} inscritos{selectedCourse.max_capacity ? ` / ${selectedCourse.max_capacity} cupos` : ''}</p>
                </div>
                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="inline-flex items-center px-3 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700"
                >
                  <Plus className="h-4 w-4 mr-1" /> Inscribir
                </button>
              </div>

              {enrollments.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">Sin inscripciones aún</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {enrollments.map(e => (
                    <div key={e.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold text-sm">
                          {(e.participant as any)?.first_name?.[0]}{(e.participant as any)?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {(e.participant as any)?.first_name} {(e.participant as any)?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{(e.participant as any)?.primary_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${e.completion_percentage}%` }} />
                        </div>
                        <select
                          value={e.status}
                          onChange={ev => handleStatusChange(e.id, ev.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                          {Object.entries(ENROLLMENT_STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Inscribir Participante</h2>
              <p className="text-sm text-gray-500 mt-1">Busca y selecciona un participante para inscribir en {selectedCourse?.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && searchParticipants()}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <button onClick={searchParticipants} className="px-3 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700">Buscar</button>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                {searchResults.map(p => {
                  const alreadyEnrolled = enrollments.some(e => e.participant_id === p.id);
                  return (
                    <div key={p.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</p>
                        <p className="text-xs text-gray-500">{p.primary_email}</p>
                      </div>
                      {alreadyEnrolled ? (
                        <span className="text-xs text-gray-400">Ya inscrito</span>
                      ) : (
                        <button
                          onClick={() => handleEnroll(p.id)}
                          disabled={enrolling}
                          className="px-3 py-1 bg-sky-100 text-sky-700 rounded-lg text-xs font-medium hover:bg-sky-200 disabled:opacity-50"
                        >
                          Inscribir
                        </button>
                      )}
                    </div>
                  );
                })}
                {searchResults.length === 0 && searchTerm && (
                  <p className="text-sm text-gray-400 py-4 text-center">No se encontraron participantes</p>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end">
              <button onClick={() => { setShowEnrollModal(false); setSearchResults([]); setSearchTerm(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentPage;
