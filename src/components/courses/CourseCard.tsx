import React from 'react';
import { Clock, BookOpen } from 'lucide-react';

import type { CourseFM, WithSlug } from '../../types/course';
import type { InstructorFM } from '../../types/course'; // si lo necesitas

/* -------------------------------------------------------- */
/*  Tipo flexible: admite propiedades adicionales opcionales */
/* -------------------------------------------------------- */
export type CourseCardData = WithSlug<CourseFM> & {
  /** thumb opcional que podrías añadir en el front-matter */
  thumbnail?: string;
  /** categoría opcional en front-matter */
  category?: string;
  /** si ya resolviste las sesiones/módulos */
  sesiones?: unknown[];
  modules?: unknown[];      // compat. con el modelo anterior
  /** instructor resuelto (no solo el string) */
  instructorObj?: InstructorFM;
};

interface Props {
  course: CourseCardData;
}

const CourseCard: React.FC<Props> = ({ course }) => {
  /* ---- Normalizar todos los campos que podrían venir vacíos ---- */
  const {
    title = 'Curso sin título',
    nivel: level = 'Sin nivel',
    duracion: duration = '',
    thumbnail = (course as any).image ?? 'https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg', 
    categoria = (course as any).categoria ?? '',
    estado = (course as any).estado ?? '',
  } = course;

  const rawDesc =
  (course as any).descripcion ??
  (course as any).description ??
  '';
  const description = String(rawDesc).trim();


  // Número de módulos o sesiones
  const moduleCount =
    (course.modules?.length ?? course.sesiones?.length ?? 0);

  // Instructor (puede que solo tengas el string con el nombre)
  const instructor =
    course.instructorObj ??
    { title: course.instructor ?? '', foto: '', especializacion: '' };

  const getEstadoClasses = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'finalizado':
        return 'bg-green-100 text-green-800';
      case 'por iniciar':
        return 'bg-red-100 text-red-800';
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  /* ------------------------ UI ------------------------ */
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
      <img
        src= {thumbnail}
        alt={title}
        className="w-full h-48 object-cover rounded-t-lg"
      />

      <div className="p-6">
        {/* Etiquetas de nivel y categoría */}
        <div className="flex items-center space-x-2 mb-2">
          {level && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
              {level}
            </span>
          )}
          {categoria && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
              {categoria}
            </span>
          )}
          {estado && (
            <span className={`px-2 py-1 text-xs font-medium rounded ${getEstadoClasses(estado)}`}>
              {estado}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Duración y total de módulos (solo si hay datos) */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          {duration && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {duration}
            </div>
          )}
          {moduleCount > 0 && (
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {moduleCount} módulos
            </div>
          )}
        </div>

        {/* Instructor (solo si tenemos algo más que el string) */}
        {instructor.title && (
          <div className="flex items-center space-x-3 mb-4">
            {instructor.foto && (
              <img
                src={instructor.foto}
                alt={instructor.title}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {instructor.title}
              </p>
              {instructor.especializacion && (
                <p className="text-xs text-gray-500">
                  {instructor.especializacion}
                </p>
              )}
            </div>
          </div>
        )}

        <button className="w-full text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200">
          Ver Curso
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
