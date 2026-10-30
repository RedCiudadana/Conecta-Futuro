import React from 'react';
import { useAccount } from '../../contexts/AccountContext';
import { CalendarCheck, Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  present: 'Presente',
  absent: 'Ausente',
  late: 'Tarde',
  excused: 'Justificado',
};

const STATUS_COLORS: Record<string, string> = {
  present: 'bg-emerald-50 text-emerald-700',
  absent: 'bg-red-50 text-red-600',
  late: 'bg-amber-50 text-amber-700',
  excused: 'bg-sky-50 text-sky-700',
};

const STATUS_ICONS: Record<string, React.FC<any>> = {
  present: CheckCircle,
  absent: XCircle,
  late: Clock,
  excused: CalendarCheck,
};

const MyAttendance: React.FC = () => {
  const { accountData, loading } = useAccount();

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-600" /></div>;
  }

  const attendance = accountData?.attendance ?? [];
  const present = attendance.filter(a => a.status === 'present').length;
  const total = attendance.length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Mis Asistencias</h1>
        <p className="text-sm text-gray-500">Registro de tu participación en sesiones</p>
      </div>

      {attendance.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay registros de asistencia todavía</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-400 mt-1">Total sesiones</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <p className="text-2xl font-bold text-emerald-600">{present}</p>
              <p className="text-xs text-gray-400 mt-1">Presente</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <p className="text-2xl font-bold text-sky-600">{rate}%</p>
              <p className="text-xs text-gray-400 mt-1">Tasa de asistencia</p>
            </div>
          </div>

          {/* Attendance list */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {attendance.map((rec) => {
                const StatusIcon = STATUS_ICONS[rec.status] ?? CalendarCheck;
                return (
                  <div key={rec.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <StatusIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {rec.session?.title ?? rec.course?.title ?? 'Sesión'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {rec.course?.title ?? ''}
                        {rec.session?.session_date && ` · ${new Date(rec.session.session_date).toLocaleDateString('es-GT')}`}
                        {rec.session?.start_time && ` · ${rec.session.start_time}`}
                      </p>
                      {rec.notes && <p className="text-xs text-gray-400 mt-1 italic">{rec.notes}</p>}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${STATUS_COLORS[rec.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {STATUS_LABELS[rec.status] ?? rec.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyAttendance;
