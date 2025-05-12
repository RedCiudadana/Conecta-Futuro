import { Course } from '../../types/course';

export const dataProtectionCourse: Course = {
  id: 'data-protection-2024',
  title: 'Protección de Datos Personales',
  description: 'Curso completo sobre la protección de datos personales en el sector público, normativas internacionales y mejores prácticas.',
  thumbnail: 'https://images.pexels.com/photos/4960464/pexels-photo-4960464.jpeg',
  duration: '16 horas',
  level: 'Intermedio',
  language: 'Español',
  category: 'Gobierno Digital',
  instructor: {
    id: 'inst-001',
    name: 'Dr. Ana Martínez',
    title: 'Especialista en Protección de Datos',
    bio: 'Experta en legislación de protección de datos con más de 15 años de experiencia en el sector público.',
    photoUrl: 'https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg'
  },
  requirements: [
    'Conocimientos básicos sobre administración pública',
    'Comprensión general de procesos administrativos',
    'Acceso a computadora con conexión a internet'
  ],
  objectives: [
    'Comprender los fundamentos de la protección de datos personales',
    'Conocer el marco normativo internacional y nacional',
    'Implementar medidas de seguridad efectivas',
    'Desarrollar políticas institucionales de protección de datos'
  ],
  modules: [
    {
      id: 'mod-1',
      title: 'Introducción a la Protección de Datos Personales',
      description: 'Fundamentos y conceptos básicos de la protección de datos personales.',
      duration: '4 horas',
      order: 1,
      lessons: [
        {
          id: 'les-1-1',
          title: 'Definición y tipos de datos personales',
          description: 'Comprensión de los diferentes tipos de datos personales y su clasificación.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/video1',
            transcript: 'En esta lección abordaremos los conceptos fundamentales de datos personales, incluyendo datos sensibles, datos biométricos y datos de menores de edad.'
          },
          duration: '45 minutos',
          order: 1
        },
        {
          id: 'les-1-2',
          title: 'Relevancia en el sector público',
          description: 'Importancia de la protección de datos en instituciones gubernamentales.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/123456789',
            dateTime: new Date('2024-04-10T15:00:00'),
            host: 'Dr. Ana Martínez'
          },
          duration: '1 hora',
          order: 2
        },
        {
          id: 'les-1-3',
          title: 'Derechos ARCO',
          description: 'Acceso, Rectificación, Cancelación y Oposición en el manejo de datos personales.',
          type: 'document',
          content: {
            documentUrl: 'https://example.com/derechos-arco.pdf',
            type: 'pdf'
          },
          duration: '45 minutos',
          order: 3
        }
      ]
    },
    {
      id: 'mod-2',
      title: 'Principios y Derechos en Materia de Protección de Datos',
      description: 'Marco normativo y principios fundamentales.',
      duration: '4 horas',
      order: 2,
      lessons: [
        {
          id: 'les-2-1',
          title: 'Normativa internacional y nacional',
          description: 'GDPR, Convenio 108 y legislación local.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/video2',
            transcript: 'Análisis comparativo de las principales normativas internacionales en materia de protección de datos.'
          },
          duration: '1 hora',
          order: 1
        },
        {
          id: 'les-2-2',
          title: 'Principios fundamentales',
          description: 'Licitud, proporcionalidad y minimización de datos.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/987654321',
            dateTime: new Date('2024-04-17T15:00:00'),
            host: 'Dr. Ana Martínez'
          },
          duration: '2 horas',
          order: 2
        }
      ]
    },
    {
      id: 'mod-3',
      title: 'Obligaciones de los Servidores Públicos',
      description: 'Responsabilidades y deberes en el manejo de datos.',
      duration: '4 horas',
      order: 3,
      lessons: [
        {
          id: 'les-3-1',
          title: 'Responsabilidad proactiva',
          description: 'Implementación de medidas preventivas y documentación.',
          type: 'document',
          content: {
            documentUrl: 'https://example.com/responsabilidad-proactiva.pdf',
            type: 'pdf'
          },
          duration: '1 hora',
          order: 1
        },
        {
          id: 'les-3-2',
          title: 'Seguridad de datos',
          description: 'Medidas técnicas, administrativas y físicas.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/video3',
            transcript: 'Guía práctica para implementar medidas de seguridad en el tratamiento de datos personales.'
          },
          duration: '2 horas',
          order: 2
        }
      ]
    },
    {
      id: 'mod-4',
      title: 'Evaluación y Mitigación de Riesgos',
      description: 'Estrategias para identificar y minimizar riesgos.',
      duration: '4 horas',
      order: 4,
      lessons: [
        {
          id: 'les-4-1',
          title: 'Análisis de riesgos',
          description: 'Metodologías de evaluación de riesgos en protección de datos.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/456789123',
            dateTime: new Date('2024-04-24T15:00:00'),
            host: 'Dr. Ana Martínez'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-4-2',
          title: 'Evaluación final',
          description: 'Evaluación comprehensiva del curso.',
          type: 'quiz',
          content: {
            questions: [
              {
                id: 'q1',
                text: '¿Cuáles son los derechos ARCO?',
                options: [
                  'Acceso, Rectificación, Cancelación, Oposición',
                  'Autorización, Registro, Control, Organización',
                  'Análisis, Reporte, Consulta, Operación',
                  'Ninguna de las anteriores'
                ],
                correctOption: 0
              },
              {
                id: 'q2',
                text: '¿Qué principio establece que solo se deben recolectar los datos estrictamente necesarios?',
                options: [
                  'Principio de proporcionalidad',
                  'Principio de minimización',
                  'Principio de necesidad',
                  'Principio de limitación'
                ],
                correctOption: 1
              }
            ],
            passingScore: 80
          },
          duration: '1 hora',
          order: 2
        }
      ]
    }
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-03-01')
};