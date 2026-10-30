import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from '../../contexts/AccountContext';
import {
  GraduationCap, Clock, CheckCircle, Loader2,
  Calendar, ArrowRight, BookOpen,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  enrolled: 'Inscrito',
  active: 'En progreso',
  completed: 'Completado',
  dropped: 'Abandonado',
  pending: 'Pendiente',
};

const STATUS_COLORS: Record<string, string> = {
  enrolled: 'bg-sky-50 text-sky-700',
  active: 'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700',
  dropped: 'bg-red-50 text-red-600',
  pending: 'bg-gray-100 text-gray-500',
};

const MyCourses: React.FC = () => {
  const { accountData, loading } = useAccount();

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-600" /></div>;
  }

  const enrollments = accountData?.enrollments ?? [];
  const active = enrollments.filter(e => e.status === 'active' || e.status === 'enrolled');
  const completed = enrollments.filter(e => e.status === 'completed');
  const other = enrollments.filter(e => !['active', 'enrolled', 'completed'].includes(e.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Mis Cursos</h1>
        <p className="text-sm text-gray-500">Consulta tus inscripciones, progreso e historial</p>
      </div>

      {enrollments.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aún no estás inscrito en ningún curso</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-3 bg-sky-600 text-white rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors">
            Explorar cursos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Active courses */}
      {active.length > 0 && (
        <Section title="En progreso" count={active.length}>
          {active.map((enr) => (
            <EnrollmentCard key={enr.id} enrollment={enr} />
          ))}
        </Section>
      )}

      {/* Completed courses */}
      {completed.length > 0 && (
        <Section title="Completados" count={completed.length}>
          {completed.map((enr) => (
            <EnrollmentCard key={enr.id} enrollment={enr} />
          ))}
        </Section>
      )}

      {/* Other statuses */}
      {other.length > 0 && (
        <Section title="Historial" count={other.length}>
          {other.map((enr) => (
            <EnrollmentCard key={enr.id} enrollment={enr} />
          ))}
        </Section>
      )}
    </div>
  );
};

const Section: React.FC<{ title: string; count: number; children: React.ReactNode }> = ({ title, count, children }) => (
  <div>
    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
      {title} <span className="text-gray-400 font-normal">({count})</span>
    </h2>
    <div className="grid gap-4 md:grid-cols-2">
      {children}
    </div>
  </div>
);

const EnrollmentCard: React.FC<{ enrollment: any }> = ({ enrollment }) => {
  const course = enrollment.course;
  const statusLabel = STATUS_LABELS[enrollment.status] ?? enrollment.status;
  const statusColor = STATUS_COLORS[enrollment.status] ?? 'bg-gray-100 text-gray-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5 text-sky-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 truncate">{course?.title ?? 'Curso'}</h3>
            {course?.category && <p className="text-xs text-gray-400">{course.category}</p>}
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        {enrollment.enrolled_at && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Inscrito: {new Date(enrollment.enrolled_at).toLocaleDateString('es-GT')}
          </span>
        )}
        {enrollment.completed_at && (
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" />
            Completado: {new Date(enrollment.completed_at).toLocaleDateString('es-GT')}
          </span>
        )}
        {course?.duration && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
        )}
      </div>

      {course?.slug && (
        <Link
          to={`/course/${course.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700"
        >
          Ver curso <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
};

export default MyCourses;
