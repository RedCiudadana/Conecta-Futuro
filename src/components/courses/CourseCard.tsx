import React from 'react';
import { Clock, BookOpen, Award, Gift, Monitor, Wifi, Users } from 'lucide-react';

import type { CourseFM, WithSlug } from '../../types/course';
import type { InstructorFM } from '../../types/course';

export type CourseCardData = WithSlug<CourseFM> & {
  thumbnail?: string;
  category?: string;
  sesiones?: unknown[];
  modules?: unknown[];
  instructorObj?: InstructorFM;
  modality?: string;
  is_free?: boolean;
  is_sponsored?: boolean;
  has_certificate?: boolean;
};

interface Props {
  course: CourseCardData;
}

const MODALITY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  presencial: { label: 'Presencial', icon: <Users className="w-4 h-4" /> },
  virtual: { label: 'Virtual', icon: <Wifi className="w-4 h-4" /> },
  hibrido: { label: 'Híbrido', icon: <Monitor className="w-4 h-4" /> },
  autoestudio: { label: 'Autoestudio', icon: <BookOpen className="w-4 h-4" /> },
};

const CourseCard: React.FC<Props> = ({ course }) => {
  const {
    title = 'Curso sin título',
    nivel: level = 'Sin nivel',
    duracion: duration = '',
    thumbnail = (course as any).image ?? 'https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg',
    categoria = (course as any).categoria ?? '',
    estado = (course as any).estado ?? '',
  } = course;

  const rawDesc = (course as any).descripcion ?? (course as any).description ?? '';
  const description = String(rawDesc).trim();

  const moduleCount = course.modules?.length ?? course.sesiones?.length ?? 0;

  const instructor =
    course.instructorObj ??
    { title: course.instructor ?? '', foto: '', especializacion: '' };

  const modality = (course as any).modality ?? '';
  const modalityInfo = MODALITY_LABELS[modality?.toLowerCase()];
  const isFree = (course as any).is_free ?? true;
  const isSponsored = (course as any).is_sponsored ?? false;
  const hasCertificate = (course as any).has_certificate ?? true;

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

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {/* Badge de costo sobre la imagen */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          {isFree && (
            <span className="px-2 py-1 bg-emerald-500/90 text-white text-xs font-semibold rounded backdrop-blur-sm">
              <Gift className="w-3 h-3 inline mr-0.5" />Gratuito
            </span>
          )}
          {isSponsored && (
            <span className="px-2 py-1 bg-amber-500/90 text-white text-xs font-semibold rounded backdrop-blur-sm">
              Patrocinado
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between h-full">
        <div className="flex-1">
          {/* Etiquetas */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
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

          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          )}

          {/* Metadata: duración, modalidad, módulos */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
            {duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {duration}
              </div>
            )}
            {modalityInfo && (
              <div className="flex items-center">
                {modalityInfo.icon}
                <span className="ml-1">{modalityInfo.label}</span>
              </div>
            )}
            {moduleCount > 0 && (
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {moduleCount} {moduleCount === 1 ? 'módulo' : 'módulos'}
              </div>
            )}
          </div>

          {/* Badge de certificado */}
          {hasCertificate && (
            <div className="flex items-center gap-1.5 text-sm text-primary-600 mb-3">
              <Award className="w-4 h-4" />
              <span>Incluye certificado</span>
            </div>
          )}

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
                <p className="text-sm font-medium text-gray-900">{instructor.title}</p>
                {instructor.especializacion && (
                  <p className="text-xs text-gray-500">{instructor.especializacion}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="w-full text-center bg-primary-600 text-white py-2 px-4 rounded-md transition-colors duration-200 mt-4">
          Ver Curso
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
