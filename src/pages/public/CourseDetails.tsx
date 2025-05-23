import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Award,
  ChevronRight,
  Share2,
  Medal,
  BookOpen,
  FileText,
  Users,
  Video,
  Calendar
} from 'lucide-react';

import { decapContentService } from '../../services/courseService';
import type {
  CourseFM,
  SessionFM,
  InstructorFM,
  WithSlug,
} from '../../types/course';

import CourseCard from '../../components/courses/CourseCard';

/* --------------------------------------------------------------------
 *  Tipos auxiliares
 * ------------------------------------------------------------------ */

type CourseFull = WithSlug<CourseFM> & {
  /** Instructor expandido */
  instructor: InstructorFM | null;
  /** Sesiones ligadas a este curso */
  sesiones: WithSlug<SessionFM>[];
};

/* --------------------------------------------------------------------
 *  Utilidades de UI
 * ------------------------------------------------------------------ */

function getResourceIcon(key: keyof SessionFM) {
  switch (key) {
    case 'video_zoom':
      return <Video className="w-5 h-5 text-primary-600" />;
    case 'handout':
      return <FileText className="w-5 h-5 text-primary-600" />;
    case 'bienvenida':
    case 'teoria':
    default:
      return <BookOpen className="w-5 h-5 text-primary-600" />;
  }
}

/* --------------------------------------------------------------------
 *  Componente principal
 * ------------------------------------------------------------------ */

const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [course, setCourse] = useState<CourseFull | null>(null);
  const [related, setRelated] = useState<WithSlug<CourseFM>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNoSessionsModal, setShowNoSessionsModal] = useState(false);

  /* -------------------- Carga del curso --------------------------- */
  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      setLoading(true);

      // 1) Curso + instructor + sesiones
      const data = (await decapContentService.getCourseBySlug(slug!)) as
        | CourseFull
        | null;
      setCourse(data);

      // 2) Obtener todos los cursos para sugerir relacionados
      const all = await decapContentService.getCourses();
      if (data) {
        const rel = all.filter(
          c =>
            c.slug !== data.slug &&
            (c.nivel === data.nivel || (c as any).category === (data as any).category),
        );
        setRelated(rel.slice(0, 3));
      }

      setLoading(false);
    }

    loadData();
  }, [slug]);

  /* -------------------- Estados base ----------------------------- */
  if (loading) {
    return <div className="p-6 text-center">Cargando…</div>;
  }

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Curso no encontrado
        </h1>
        <p className="mt-4 text-gray-600">
          El curso que buscas no existe o ha sido movido.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ChevronRight className="w-5 h-5 mr-1" /> Ver todos los cursos
        </Link>
      </div>
    );
  }

  /* -------------------- Render ----------------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {course.descripcion}
            </p>

            <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
              <span className="flex items-center">
                <Clock className="w-5 h-5 mr-2" /> {course.duracion}
              </span>
              <span className="flex items-center">
                <Award className="w-5 h-5 mr-2" /> {course.nivel}
              </span>
              <span className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" /> {course.estado}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              {course.enlace_contenido && (
                <button
                  onClick={() => {
                    if (course.sesiones.length === 0) {
                      setShowNoSessionsModal(true);
                    } else {
                      window.location.href = `/course/${slug}/session`;
                    }
                  }}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Ir al contenido
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              )}

              {course.enlace_registro && (
                <a
                  href={course.enlace_registro}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Registrarse
                </a>
              )}
            </div>
          </div>

          {course.thumbnail && (
            <div>
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Instructor */}
      {course.instructor && (
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Instructor</h2>
          <div className="flex items-start space-x-4">
            {course.instructor.foto && (
              <img
                src={course.instructor.foto}
                alt={course.instructor.title}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold">
                {course.instructor.title}
              </h3>
              <p className="text-gray-600">
                {course.instructor.descripcion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Certificado */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-start space-x-6">
          <div className="p-3 bg-primary-100 rounded-lg flex-shrink-0">
            <Medal className="w-12 h-12 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              ¡Comparte tus logros con un certificado!
            </h2>
            <p className="text-gray-600 mb-4">
              Cuando termines el curso tendrás acceso al certificado digital
              para compartirlo con tu familia, amigos, empleadores y la
              comunidad.
            </p>
            <div className="flex items-center space-x-2 text-primary-600">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">
                Comparte tu éxito en redes sociales
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 hidden md:block">
            <img
              src="https://images.pexels.com/photos/5905555/pexels-photo-5905555.jpeg"
              alt="Certificado Digital"
              className="w-48 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Sesiones */}
      {course.sesiones.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Sesiones</h2>
          <div className="space-y-6">
            {course.sesiones.map(session => (
              <div key={session.slug} className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {session.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cursos relacionados */}
      {related.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">Cursos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(rc => (
              <Link key={rc.slug} to={`/course/${rc.slug}`}>
                <CourseCard course={rc} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {showNoSessionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No hay sesiones disponibles
            </h2>
            <p className="text-gray-600 mb-6">
              Este curso aún no tiene sesiones publicadas. Por favor, vuelve más tarde o contacta al instructor.
            </p>
            <button
              onClick={() => setShowNoSessionsModal(false)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseDetails;
