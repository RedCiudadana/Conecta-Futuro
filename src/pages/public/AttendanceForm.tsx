import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, ClipboardCheck, Calendar, MapPin, Clock, ArrowLeft, RotateCcw } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
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
      const result = await publicRecordAttendance(
        token,
        email.trim(),
        name.trim() || undefined,
        institution.trim() || undefined
      );
      setParticipantName(result.participantName || '');
      setStep(result.alreadyRecorded ? 'already' : 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrio un error inesperado');
      setStep('error');
    }
  };

  const handleRetry = () => {
    setStep('form');
    setErrorMsg('');
  };

  const isFormValid = email.trim() && email.includes('@');

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="text-sm text-gray-500">Cargando formulario...</p>
      </div>
    );
  }

  if (invalid || expired) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Seo title="Asistencia no disponible" />
        <div className="max-w-sm text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {expired ? 'Enlace expirado' : 'Enlace no disponible'}
          </h1>
          <p className="text-gray-600 mb-8">
            {expired
              ? 'Este formulario de asistencia ha expirado. Contacta al instructor para obtener un enlace actualizado.'
              : 'Este enlace de asistencia no es valido o ya fue desactivado. Pide al instructor un enlace actualizado.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success' || step === 'already') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Seo title={`Asistencia - ${session?.title}`} />
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className={`h-16 w-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
              step === 'success' ? 'bg-emerald-100' : 'bg-sky-100'
            }`}>
              <CheckCircle className={`h-8 w-8 ${step === 'success' ? 'text-emerald-600' : 'text-sky-600'}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'success' ? 'Asistencia registrada' : 'Ya registraste tu asistencia'}
            </h1>
            <p className="text-gray-600">
              {participantName && (
                <>
                  <span className="font-semibold text-gray-900">{participantName}</span>
                  {step === 'success'
                    ? ', tu asistencia ha sido registrada correctamente.'
                    : ', ya habias registrado tu asistencia para esta sesion.'}
                </>
              )}
            </p>
          </div>

          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-900">{course?.title}</p>
            <p className="text-sm text-gray-500 mt-1">{session?.title}</p>
            {session?.session_date && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(session.session_date + 'T12:00:00').toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <Seo title={`Asistencia - ${session?.title}`} description={`Registra tu asistencia para ${session?.title}`} />

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="h-7 w-7 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Registro de asistencia</h1>
          <p className="text-primary-600 font-medium">{course?.title}</p>
        </div>

        {/* Session info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-base font-semibold text-gray-900 mb-2">{session?.title}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {session?.session_date && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{new Date(session.session_date + 'T12:00:00').toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}
            {(session?.start_time || session?.end_time) && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{session.start_time}{session.end_time ? ` - ${session.end_time}` : ''}</span>
              </div>
            )}
            {session?.location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{session.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {step === 'error' && (
          <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">No se pudo registrar la asistencia</p>
                <p className="text-sm text-red-600 mt-1">{errorMsg}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            {/* Email - required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electronico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                autoFocus
                disabled={step === 'submitting'}
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Usa el mismo correo con el que te registraste al curso.
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Secondary validation fields */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Verificacion adicional
              </p>
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    disabled={step === 'submitting'}
                  />
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Institucion
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="Nombre de tu institucion u organizacion"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    disabled={step === 'submitting'}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Estos campos son opcionales, pero ayudan a confirmar tu identidad.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || step === 'submitting'}
            className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
    </div>
  );
};

export default AttendanceForm;
