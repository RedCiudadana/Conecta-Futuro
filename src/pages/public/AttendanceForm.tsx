import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, ClipboardCheck, Calendar, MapPin, Clock } from 'lucide-react';
import { getAttendanceLinkByToken, publicRecordAttendance } from '../../services/participantService';
import type { CourseSession, Course, AttendanceFormLink } from '../../types/participants';
import Seo from '../../components/Seo';

type FormStep = 'form' | 'submitting' | 'success' | 'already' | 'error';

const AttendanceForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<CourseSession | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [link, setLink] = useState<AttendanceFormLink | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [expired, setExpired] = useState(false);

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<FormStep>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    if (!token) return;
    async function load() {
      setLoading(true);
      try {
        const result = await getAttendanceLinkByToken(token!);
        if (!result) {
          setInvalid(true);
        } else {
          setSession(result.session);
          setCourse(result.course);
          setLink(result.link);
          if (!result.link.is_active) setInvalid(true);
          if (result.link.expires_at && new Date(result.link.expires_at) < new Date()) setExpired(true);
        }
      } catch {
        setInvalid(true);
      }
      setLoading(false);
    }
    load();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email.trim()) return;

    setStep('submitting');
    setErrorMsg('');

    try {
      const result = await publicRecordAttendance(token, email.trim());
      setParticipantName(result.participantName || '');
      setStep(result.alreadyRecorded ? 'already' : 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrio un error');
      setStep('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (invalid || expired) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <Seo title="Asistencia no disponible" />
        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {expired ? 'Enlace expirado' : 'Enlace no valido'}
        </h1>
        <p className="text-gray-600 mb-6">
          {expired
            ? 'Este formulario de asistencia ha expirado. Contacta al instructor para obtener un enlace actualizado.'
            : 'Este enlace de asistencia no es valido o ya fue desactivado.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          Ir al inicio
        </Link>
      </div>
    );
  }

  if (step === 'success' || step === 'already') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <Seo title={`Asistencia - ${session?.title}`} />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className={`h-16 w-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
            step === 'success' ? 'bg-emerald-100' : 'bg-sky-100'
          }`}>
            <CheckCircle className={`h-8 w-8 ${step === 'success' ? 'text-emerald-600' : 'text-sky-600'}`} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {step === 'success' ? 'Asistencia registrada' : 'Ya registraste tu asistencia'}
          </h1>
          <p className="text-gray-600 mb-2">
            {participantName && <span className="font-medium text-gray-900">{participantName}</span>}
            {step === 'success'
              ? ', tu asistencia ha sido registrada correctamente.'
              : ', ya habias registrado tu asistencia para esta sesion.'}
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left">
            <p className="text-sm font-medium text-gray-900">{course?.title}</p>
            <p className="text-sm text-gray-500 mt-1">{session?.title}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
      <Seo title={`Asistencia - ${session?.title}`} description={`Registra tu asistencia para ${session?.title}`} />

      <div className="mb-8 text-center">
        <div className="h-14 w-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className="h-7 w-7 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Registro de asistencia</h1>
        <p className="text-primary-600 font-medium">{course?.title}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{session?.title}</h2>
        <div className="space-y-2">
          {session?.session_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{new Date(session.session_date + 'T12:00:00').toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          )}
          {(session?.start_time || session?.end_time) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{session.start_time}{session.end_time ? ` - ${session.end_time}` : ''}</span>
            </div>
          )}
          {session?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{session.location}</span>
            </div>
          )}
        </div>
      </div>

      {step === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">No se pudo registrar la asistencia</p>
            <p className="text-sm text-red-600 mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electronico con el que te inscribiste *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus
          />
          <p className="text-xs text-gray-400 mt-2">
            Usa el mismo correo con el que te registraste al curso.
          </p>
        </div>

        <button
          type="submit"
          disabled={!email.trim() || !email.includes('@') || step === 'submitting'}
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {step === 'submitting' ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Registrar mi asistencia
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;
