import { Course } from '../../types/course';

export const powerBiCourse: Course = {
  id: 'power-bi-2024',
  title: 'Introducción a Power BI',
  description: 'Curso práctico para dominar Power BI y crear visualizaciones efectivas de datos.',
  thumbnail: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
  duration: '20 horas',
  level: 'Básico',
  language: 'Español',
  category: 'Análisis de Datos',
  instructor: {
    id: 'inst-002',
    name: 'Carlos Ramírez',
    title: 'Especialista en Business Intelligence',
    bio: 'Consultor de BI con experiencia en implementación de soluciones de datos en el sector público.',
    photoUrl: 'https://images.pexels.com/photos/5397723/pexels-photo-5397723.jpeg'
  },
  requirements: [
    'Conocimientos básicos de Excel',
    'Computadora con Windows 8 o superior',
    'Power BI Desktop instalado'
  ],
  objectives: [
    'Dominar la interfaz de Power BI Desktop',
    'Crear visualizaciones efectivas de datos',
    'Desarrollar dashboards interactivos',
    'Publicar y compartir informes'
  ],
  modules: [
    {
      id: 'mod-1',
      title: 'Conceptos Básicos de Power BI',
      description: 'Introducción a la interfaz y funcionalidades básicas.',
      duration: '4 horas',
      order: 1,
      lessons: [
        {
          id: 'les-1-1',
          title: 'Introducción a Power BI',
          description: 'Visión general de la herramienta y sus componentes.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/powerbi-intro',
            transcript: 'Exploración detallada de la interfaz de Power BI Desktop y sus principales características.'
          },
          duration: '1 hora',
          order: 1
        },
        {
          id: 'les-1-2',
          title: 'Importación de Datos',
          description: 'Conexión a diferentes fuentes de datos.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/234567891',
            dateTime: new Date('2024-04-12T16:00:00'),
            host: 'Carlos Ramírez'
          },
          duration: '2 horas',
          order: 2
        }
      ]
    },
    {
      id: 'mod-2',
      title: 'Power Query: Transformación de Datos',
      description: 'Técnicas de limpieza y preparación de datos.',
      duration: '6 horas',
      order: 2,
      lessons: [
        {
          id: 'les-2-1',
          title: 'Editor de Power Query',
          description: 'Uso del editor para transformar datos.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/power-query',
            transcript: 'Tutorial paso a paso sobre el uso del Editor de Power Query para la limpieza de datos.'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-2-2',
          title: 'Ejercicios Prácticos',
          description: 'Casos de uso reales con datos públicos.',
          type: 'document',
          content: {
            documentUrl: 'https://example.com/ejercicios-powerquery.pdf',
            type: 'pdf'
          },
          duration: '2 horas',
          order: 2
        }
      ]
    },
    {
      id: 'mod-3',
      title: 'Power Pivot y Fórmulas DAX',
      description: 'Modelado de datos y análisis avanzado.',
      duration: '6 horas',
      order: 3,
      lessons: [
        {
          id: 'les-3-1',
          title: 'Introducción a DAX',
          description: 'Fundamentos de fórmulas DAX.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/345678912',
            dateTime: new Date('2024-04-19T16:00:00'),
            host: 'Carlos Ramírez'
          },
          duration: '3 horas',
          order: 1
        },
        {
          id: 'les-3-2',
          title: 'Ejercicios DAX',
          description: 'Práctica con fórmulas comunes.',
          type: 'quiz',
          content: {
            questions: [
              {
                id: 'q1',
                text: '¿Cuál es la función DAX para calcular la suma?',
                options: ['SUM', 'TOTAL', 'ADD', 'SUMX'],
                correctOption: 0
              },
              {
                id: 'q2',
                text: '¿Qué función se usa para filtrar datos en DAX?',
                options: ['FILTER', 'SELECT', 'WHERE', 'QUERY'],
                correctOption: 0
              }
            ],
            passingScore: 80
          },
          duration: '1 hora',
          order: 2
        }
      ]
    },
    {
      id: 'mod-4',
      title: 'Dashboards Interactivos',
      description: 'Creación de paneles visuales efectivos.',
      duration: '4 horas',
      order: 4,
      lessons: [
        {
          id: 'les-4-1',
          title: 'Diseño de Dashboards',
          description: 'Principios de diseño visual y UX.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/dashboard-design',
            transcript: 'Guía completa sobre principios de diseño y mejores prácticas para crear dashboards efectivos.'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-4-2',
          title: 'Proyecto Final',
          description: 'Creación de dashboard completo.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/456789123',
            dateTime: new Date('2024-04-26T16:00:00'),
            host: 'Carlos Ramírez'
          },
          duration: '2 horas',
          order: 2
        }
      ]
    }
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-03-15')
};