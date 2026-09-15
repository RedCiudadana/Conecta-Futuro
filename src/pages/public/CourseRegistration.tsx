import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { decapContentService } from '../../services/courseService';
import { getCourseBySlug, publicRegisterForCourse } from '../../services/participantService';
import type { PublicRegistrationData } from '../../services/participantService';
import { GUATEMALA_DEPARTMENTS } from '../../types/participants';
import Seo from '../../components/Seo';

type RegistrationStep = 'form' | 'submitting' | 'success' | 'already' | 'error';

const CourseRegistration: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [courseExists, setCourseExists] = useState<boolean | null>(null);
  const [courseOpen, setCourseOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<RegistrationStep>('form');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState<PublicRegistrationData>({
    first_name: '',
    last_name: '',
    primary_email: '',
    phone: '',
    dpi: '',
    gender: '',
    department: '',
    municipality: '',
    organization_name: '',
    digital_skill_level: '',
    how_found_us: '',
  });

  useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      try {
        const cmsCourse = await decapContentService.getCourseBySlug(slug!);
        if (cmsCourse) setCourseTitle(cmsCourse.title);

        const dbCourse = await getCourseBySlug(slug!);
        setCourseExists(!!(cmsCourse || dbCourse));
        if (dbCourse) {
          if (!cmsCourse) setCourseTitle(dbCourse.title);
          setCourseOpen(dbCourse.status === 'open');
        } else {
          setCourseOpen(true);
        }
      } catch {
        setCourseExists(false);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  const updateField = (field: keyof PublicRegistrationData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isValid = form.first_name.trim() && form.last_name.trim() && form.primary_email.trim() && form.primary_email.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !slug) return;

    setStep('submitting');
    setErrorMsg('');

    try {
      const result = await publicRegisterForCourse(slug, form, courseTitle || undefined);
      setStep(result.alreadyEnrolled ? 'already' : 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al registrarte');
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

  if (!courseExists || !courseOpen) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registro no disponible</h1>
        <p className="text-gray-600 mb-6">
          {!courseOpen
            ? 'Las inscripciones para este curso están cerradas. Solo es posible registrarse cuando el curso tiene inscripciones abiertas.'
            : 'Este curso no tiene registro abierto en este momento. Puede que aún no se haya habilitado o que el curso ya haya iniciado.'}
        </p>
        <Link
          to={slug ? `/course/${slug}` : '/courses'}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al curso
        </Link>
      </div>
    );
  }

  if (step === 'success' || step === 'already') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <Seo title={`Registro - ${courseTitle}`} description={`Registro para ${courseTitle}`} />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className={`h-16 w-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
            step === 'success' ? 'bg-emerald-100' : 'bg-sky-100'
          }`}>
            <CheckCircle className={`h-8 w-8 ${step === 'success' ? 'text-emerald-600' : 'text-sky-600'}`} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {step === 'success' ? '!Registro exitoso!' : 'Ya estás inscrito'}
          </h1>
          <p className="text-gray-600 mb-2">
            {step === 'success'
              ? `Te has registrado correctamente en ${courseTitle}. Pronto recibirás información sobre el curso.`
              : `Ya tienes una inscripción activa en ${courseTitle}. No necesitas registrarte de nuevo.`
            }
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Si tienes preguntas, no dudes en contactarnos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/course/${slug}`}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Ver el curso
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Explorar más cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <Seo title={`Registro - ${courseTitle}`} description={`Formulario de registro para ${courseTitle}`} />

      {/* Back link */}
      <Link
        to={`/course/${slug}`}
        className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Volver al curso
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscripción al curso</h1>
        <p className="text-lg text-primary-600 font-medium">{courseTitle}</p>
        <p className="text-gray-500 mt-2">Completa el formulario para registrarte. Los campos marcados con * son obligatorios.</p>
      </div>

      {step === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">No se pudo completar el registro</p>
            <p className="text-sm text-red-600 mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información personal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={e => updateField('first_name', e.target.value)}
                placeholder="Tu nombre"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={e => updateField('last_name', e.target.value)}
                placeholder="Tu apellido"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
              <input
                type="email"
                required
                value={form.primary_email}
                onChange={e => updateField('primary_email', e.target.value)}
                placeholder="tu@correo.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => updateField('phone', e.target.value)}
                placeholder="+502 1234-5678"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DPI</label>
              <input
                type="text"
                value={form.dpi}
                onChange={e => updateField('dpi', e.target.value)}
                placeholder="Número de DPI"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                value={form.gender}
                onChange={e => updateField('gender', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero_no_decir">Prefiero no decir</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <select
                value={form.department}
                onChange={e => updateField('department', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {GUATEMALA_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
              <input
                type="text"
                value={form.municipality}
                onChange={e => updateField('municipality', e.target.value)}
                placeholder="Tu municipio"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Additional */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información adicional</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organización o empresa</label>
              <input
                type="text"
                value={form.organization_name}
                onChange={e => updateField('organization_name', e.target.value)}
                placeholder="Nombre de tu organización"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de habilidades digitales</label>
              <select
                value={form.digital_skill_level}
                onChange={e => updateField('digital_skill_level', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">¿Cómo te enteraste de este curso?</label>
              <select
                value={form.how_found_us}
                onChange={e => updateField('how_found_us', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                <option value="redes_sociales">Redes sociales</option>
                <option value="referido">Referido por alguien</option>
                <option value="buscador">Buscador (Google)</option>
                <option value="correo">Correo electrónico</option>
                <option value="institucion">Mi institución / organización</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!isValid || step === 'submitting'}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {step === 'submitting' ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Completar inscripción
              </>
            )}
          </button>
          <Link
            to={`/course/${slug}`}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Al registrarte aceptas que tus datos sean utilizados para la gestión del curso por Red Ciudadana.
        </p>
      </form>
    </div>
  );
};

export default CourseRegistration;
