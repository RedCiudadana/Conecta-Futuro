import { Course } from '../../types/course';

export const dataExchangeCourse: Course = {
  id: 'data-exchange-2024',
  title: 'Intercambio de Datos en el Sector Público',
  description: 'El curso "Intercambio de Datos para la Transformación Digital en el Sector Público" es un programa de formación gratuito dirigido a funcionarios públicos, con el objetivo de fortalecer sus conocimientos y habilidades en interoperabilidad dentro de sus instituciones.',
  thumbnail: 'https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg',
  duration: '20 horas',
  level: 'Intermedio',
  language: 'Español',
  category: 'Gobierno Digital',
  instructor: {
    id: 'inst-004',
    name: 'Dra. María González',
    title: 'Especialista en Interoperabilidad Gubernamental',
    bio: 'Experta en transformación digital y sistemas de intercambio de datos con más de 12 años de experiencia en el sector público.',
    photoUrl: 'https://images.pexels.com/photos/5905905/pexels-photo-5905905.jpeg'
  },
  requirements: [
    'Conocimientos básicos de administración pública',
    'Familiaridad con conceptos básicos de tecnología',
    'Computadora con conexión a internet'
  ],
  objectives: [
    'Comprender los fundamentos de la interoperabilidad y su importancia en el sector público',
    'Explorar estándares internacionales y marcos regulatorios relevantes',
    'Conocer casos de éxito y estrategias para la implementación efectiva de interoperabilidad en el gobierno'
  ],
  modules: [
    {
      id: 'mod-1',
      title: 'Fundamentos de Interoperabilidad',
      description: 'Conceptos básicos y principios de interoperabilidad en el gobierno.',
      duration: '5 horas',
      order: 1,
      lessons: [
        {
          id: 'les-1-1',
          title: 'Introducción a la Interoperabilidad',
          description: 'Conceptos fundamentales y tipos de interoperabilidad.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/interop-intro',
            transcript: 'Exploraremos los conceptos básicos de interoperabilidad y su importancia en la transformación digital del sector público.'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-1-2',
          title: 'Marco Legal y Normativo',
          description: 'Regulaciones y estándares internacionales.',
          type: 'document',
          content: {
            documentUrl: 'https://example.com/legal-framework.pdf',
            type: 'pdf'
          },
          duration: '1.5 horas',
          order: 2
        },
        {
          id: 'les-1-3',
          title: 'Beneficios y Desafíos',
          description: 'Análisis de ventajas y retos en la implementación.',
          type: 'quiz',
          content: {
            questions: [
              {
                id: 'q1',
                text: '¿Cuál es el principal beneficio de la interoperabilidad?',
                options: [
                  'Reducción de duplicidad de datos',
                  'Mayor complejidad técnica',
                  'Aumento de costos operativos',
                  'Menor seguridad de datos'
                ],
                correctOption: 0
              },
              {
                id: 'q2',
                text: '¿Qué tipo de interoperabilidad se refiere a la capacidad de compartir datos?',
                options: [
                  'Técnica',
                  'Semántica',
                  'Organizacional',
                  'Legal'
                ],
                correctOption: 1
              }
            ],
            passingScore: 80
          },
          duration: '1.5 horas',
          order: 3
        }
      ]
    },
    {
      id: 'mod-2',
      title: 'Estándares y Arquitecturas',
      description: 'Estándares técnicos y arquitecturas de interoperabilidad.',
      duration: '5 horas',
      order: 2,
      lessons: [
        {
          id: 'les-2-1',
          title: 'Estándares Internacionales',
          description: 'Principales estándares de interoperabilidad.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/standards',
            transcript: 'Análisis detallado de los estándares internacionales más relevantes en interoperabilidad gubernamental.'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-2-2',
          title: 'Arquitecturas de Referencia',
          description: 'Modelos y frameworks de interoperabilidad.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/123456789',
            dateTime: new Date('2024-05-15T15:00:00'),
            host: 'Dra. María González'
          },
          duration: '2 hours',
          order: 2
        },
        {
          id: 'les-2-3',
          title: 'Evaluación de Madurez',
          description: 'Metodologías de evaluación de madurez en interoperabilidad.',
          type: 'document',
          content: {
            documentUrl: 'https://example.com/maturity-assessment.pdf',
            type: 'pdf'
          },
          duration: '1 hour',
          order: 3
        }
      ]
    },
    {
      id: 'mod-3',
      title: 'Implementación Práctica',
      description: 'Aspectos prácticos de la implementación.',
      duration: '5 horas',
      order: 3,
      lessons: [
        {
          id: 'les-3-1',
          title: 'Planificación de Proyectos',
          description: 'Metodología para proyectos de interoperabilidad.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/project-planning',
            transcript: 'Guía paso a paso para planificar proyectos de interoperabilidad en el sector público.'
          },
          duration: '2 hours',
          order: 1
        },
        {
          id: 'les-3-2',
          title: 'Gestión del Cambio',
          description: 'Estrategias para la adopción organizacional.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/987654321',
            dateTime: new Date('2024-05-22T15:00:00'),
            host: 'Dra. María González'
          },
          duration: '2 hours',
          order: 2
        },
        {
          id: 'les-3-3',
          title: 'Mejores Prácticas',
          description: 'Lecciones aprendidas y recomendaciones.',
          type: 'quiz',
          content: {
            questions: [
              {
                id: 'q1',
                text: '¿Cuál es el primer paso en un proyecto de interoperabilidad?',
                options: [
                  'Evaluación de necesidades',
                  'Implementación técnica',
                  'Capacitación del personal',
                  'Documentación'
                ],
                correctOption: 0
              },
              {
                id: 'q2',
                text: '¿Qué factor es más importante en la gestión del cambio?',
                options: [
                  'Comunicación efectiva',
                  'Presupuesto',
                  'Tecnología',
                  'Tiempo'
                ],
                correctOption: 0
              }
            ],
            passingScore: 80
          },
          duration: '1 hour',
          order: 3
        }
      ]
    },
    {
      id: 'mod-4',
      title: 'Casos de Éxito',
      description: 'Análisis de implementaciones exitosas.',
      duration: '5 horas',
      order: 4,
      lessons: [
        {
          id: 'les-4-1',
          title: 'Casos Internacionales',
          description: 'Experiencias exitosas a nivel global.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/success-cases',
            transcript: 'Análisis de casos de éxito en implementación de interoperabilidad en diferentes países.'
          },
          duration: '2 hours',
          order: 1
        },
        {
          id: 'les-4-2',
          title: 'Casos Regionales',
          description: 'Experiencias en América Latina.',
          type: 'document',
          content: {
            documentUrl: 'https://example.com/regional-cases.pdf',
            type: 'pdf'
          },
          duration: '2 hours',
          order: 2
        },
        {
          id: 'les-4-3',
          title: 'Evaluación Final',
          description: 'Evaluación comprehensiva del curso.',
          type: 'quiz',
          content: {
            questions: [
              {
                id: 'q1',
                text: '¿Qué factor fue clave en el éxito del caso de Estonia?',
                options: [
                  'Marco legal sólido',
                  'Presupuesto ilimitado',
                  'Tecnología propietaria',
                  'Ausencia de regulación'
                ],
                correctOption: 0
              },
              {
                id: 'q2',
                text: '¿Cuál es el principal aprendizaje de los casos latinoamericanos?',
                options: [
                  'Importancia de la colaboración institucional',
                  'Necesidad de mayor presupuesto',
                  'Preferencia por soluciones cerradas',
                  'Evitar estándares internacionales'
                ],
                correctOption: 0
              }
            ],
            passingScore: 80
          },
          duration: '1 hour',
          order: 3
        }
      ]
    }
  ],
  createdAt: new Date('2024-03-01'),
  updatedAt: new Date('2024-03-15')
};