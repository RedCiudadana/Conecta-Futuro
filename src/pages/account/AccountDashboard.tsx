import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from '../../contexts/AccountContext';
import {
  GraduationCap, Award, CalendarCheck, BookOpen,
  TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight,
} from 'lucide-react';

const AccountDashboard: React.FC = () => {
  const { accountData, loading } = useAccount();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!accountData?.participant) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No encontramos tu cuenta</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Tu correo no está vinculado a un registro de participante todavía.
          Si ya tomaste un curso con nosotros, contacta al equipo de soporte
          para conectar tu cuenta.
        </p>
      </div>
    );
  }

  const p = accountData.participant;
  const completedCourses = accountData.enrollments.filter(e => e.status === 'completed').length;
  const activeEnrollments = accountData.enrollments.filter(e => e.status === 'active' || e.status === 'enrolled').length;
  const availableCerts = accountData.certificates.filter(c => c.status === 'emitted' || c.status === 'issued').length;
  const pendingCerts = accountData.certificates.filter(c => c.status === 'pending').length;
  const attendanceCount = accountData.attendance.length;

  const stats = [
    {
      label: 'Cursos inscritos',
      value: accountData.enrollments.length,
      icon: BookOpen,
      color: 'bg-sky-50 text-sky-600',
      link: '/mi-cuenta/cursos',
    },
    {
      label: 'Cursos completados',
      value: completedCourses,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-600',
      link: '/mi-cuenta/cursos',
    },
    {
      label: 'Certificados',
      value: availableCerts,
      icon: Award,
      color: 'bg-violet-50 text-violet-600',
      link: '/mi-cuenta/certificados',
    },
    {
      label: 'Asistencias',
      value: attendanceCount,
      icon: CalendarCheck,
      color: 'bg-amber-50 text-amber-600',
      link: '/mi-cuenta/asistencias',
    },
  ];

  const recentEnrollments = accountData.enrollments.slice(0, 4);
  const recentCerts = accountData.certificates.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-6 md:p-8 text-white shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          Hola, {p.first_name}!
        </h1>
        <p className="text-sky-100 text-sm">
          Bienvenida a tu espacio personal en Conecta Futuro
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Mis cursos recientes</h2>
            <Link to="/mi-cuenta/cursos" className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentEnrollments.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">Aún no tienes inscripciones</p>
          ) : (
            <ul className="space-y-3">
              {recentEnrollments.map((enr) => (
                <li key={enr.id} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-4 w-4 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{enr.course?.title ?? 'Curso'}</p>
                    <p className="text-xs text-gray-400">
                      {enr.status === 'completed' ? 'Completado' :
                       enr.status === 'active' || enr.status === 'enrolled' ? 'En progreso' :
                       enr.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent certificates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Certificados recientes</h2>
            <Link to="/mi-cuenta/certificados" className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentCerts.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No tienes certificados todavía</p>
          ) : (
            <ul className="space-y-3">
              {recentCerts.map((cert) => (
                <li key={cert.id} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <Award className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{cert.course?.title ?? 'Curso'}</p>
                    <p className="text-xs text-gray-400">
                      {cert.status === 'emitted' || cert.status === 'issued' ? 'Emitido' :
                       cert.status === 'pending' ? 'Pendiente' : cert.status}
                      {cert.issued_at ? ` · ${new Date(cert.issued_at).toLocaleDateString('es-GT')}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Active enrollments highlight */}
      {activeEnrollments > 0 && (
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sky-900">Tienes {activeEnrollments} curso(s) en progreso</p>
            <p className="text-xs text-sky-700">Continúa donde lo dejaste</p>
          </div>
          <Link to="/mi-cuenta/cursos" className="text-sm font-medium text-sky-700 hover:text-sky-900 flex items-center gap-1">
            Continuar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Skills & badges summary */}
      {(accountData.skills.length > 0 || accountData.badges.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {accountData.skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {accountData.skills.slice(0, 6).map((s) => (
                  <span key={s.id} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {s.skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {accountData.badges.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Insignias</h3>
              <div className="flex flex-wrap gap-2">
                {accountData.badges.slice(0, 6).map((b) => (
                  <span key={b.id} className="px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                    {b.badge.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDashboard;
