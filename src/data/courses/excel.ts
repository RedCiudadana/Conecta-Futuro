import { Course } from '../../types/course';

export const excelCourse: Course = {
  id: 'excel-gestion-publica-2024',
  title: 'Excel para la Gestión Pública',
  description: 'Curso diseñado para funcionarios y servidores públicos que desean mejorar sus habilidades en Excel, optimizando la gestión de datos, reportes y análisis en la administración pública.',
  thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
  duration: '24 horas',
  level: 'Básico',
  language: 'Español',
  category: 'Gobierno Digital',
  instructor: {
    id: 'inst-003',
    name: 'Lic. Roberto Méndez',
    title: 'Especialista en Análisis de Datos Gubernamentales',
    bio: 'Experto en gestión de datos públicos con más de 10 años de experiencia en capacitación a funcionarios públicos.',
    photoUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  requirements: [
    'Conocimientos básicos de computación',
    'Microsoft Excel instalado (2016 o superior)',
    'Computadora con Windows o macOS'
  ],
  objectives: [
    'Dominar las funciones básicas y avanzadas de Excel',
    'Optimizar la gestión de datos en el sector público',
    'Crear reportes efectivos para la toma de decisiones',
    'Automatizar tareas repetitivas mediante fórmulas y funciones'
  ],
  modules: [
    {
      id: 'mod-1',
      title: 'Fundamentos y Manejo de Excel',
      description: 'Conceptos básicos y navegación eficiente en Excel.',
      duration: '6 horas',
      order: 1,
      lessons: [
        {
          id: 'les-1-1',
          title: 'Exploración de la interfaz y funciones básicas',
          description: 'Introducción a la interfaz de Excel y sus componentes principales.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/excel-basics',
            transcript: 'En esta lección exploraremos la interfaz de Excel, la cinta de opciones y las funciones básicas más utilizadas.'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-1-2',
          title: 'Tipos de cursores y navegación',
          description: 'Aprende a navegar eficientemente en hojas de cálculo.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/excel-navigation',
            transcript: 'Conoce los diferentes tipos de cursores y técnicas de navegación para moverte eficientemente en Excel.'
          },
          duration: '2 horas',
          order: 2
        },
        {
          id: 'les-1-3',
          title: 'Operaciones esenciales',
          description: 'Operaciones básicas y gestión de hojas de cálculo.',
          type: 'quiz',
          content: {
            questions: [
              {
                id: 'q1',
                text: '¿Cuál es el atajo de teclado para copiar en Excel?',
                options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + Z'],
                correctOption: 0
              },
              {
                id: 'q2',
                text: '¿Cómo se inserta una nueva hoja en Excel?',
                options: [
                  'Clic derecho en la pestaña de hoja > Nueva hoja',
                  'Archivo > Nueva hoja',
                  'Ctrl + N',
                  'Alt + Insert'
                ],
                correctOption: 0
              }
            ],
            passingScore: 80
          },
          duration: '2 horas',
          order: 3
        }
      ]
    },
    {
      id: 'mod-2',
      title: 'Ingreso y Manipulación de Datos',
      description: 'Técnicas efectivas para el manejo de datos.',
      duration: '6 horas',
      order: 2,
      lessons: [
        {
          id: 'les-2-1',
          title: 'Formato de datos y celdas',
          description: 'Aprende a dar formato profesional a tus datos.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/excel-formatting',
            transcript: 'Exploraremos las diferentes opciones de formato para datos y celdas en Excel.'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-2-2',
          title: 'Fórmulas básicas y herramientas de datos',
          description: 'Introducción a fórmulas esenciales para el análisis de datos.',
          type: 'document',
          content: {
            documentUrl: 'https://example.com/excel-formulas.pdf',
            type: 'pdf'
          },
          duration: '2 horas',
          order: 2
        },
        {
          id: 'les-2-3',
          title: 'Copiar, pegar y manipular datos',
          description: 'Técnicas avanzadas de manipulación de datos.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/excel-data-manipulation',
            transcript: 'Aprenderás técnicas eficientes para copiar, pegar y manipular datos en Excel.'
          },
          duration: '2 horas',
          order: 3
        }
      ]
    },
    {
      id: 'mod-3',
      title: 'Tablas y Gestión de Datos',
      description: 'Manejo avanzado de tablas y análisis de datos.',
      duration: '6 horas',
      order: 3,
      lessons: [
        {
          id: 'les-3-1',
          title: 'Conversión de datos en tablas',
          description: 'Aprende a crear y gestionar tablas en Excel.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/excel-tables',
            transcript: 'Descubre cómo convertir rangos de datos en tablas y aprovechar sus funcionalidades.'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-3-2',
          title: 'Aplicación de filtros y gráficos',
          description: 'Visualización y filtrado efectivo de datos.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/123456789',
            dateTime: new Date('2024-04-15T15:00:00'),
            host: 'Lic. Roberto Méndez'
          },
          duration: '2 horas',
          order: 2
        },
        {
          id: 'les-3-3',
          title: 'Uso de fórmulas dentro de tablas',
          description: 'Fórmulas avanzadas para el análisis de datos en tablas.',
          type: 'document',
          content: {
            documentUrl: 'https://example.com/excel-table-formulas.pdf',
            type: 'pdf'
          },
          duration: '2 horas',
          order: 3
        }
      ]
    },
    {
      id: 'mod-4',
      title: 'Procesamiento y Análisis Avanzado',
      description: 'Herramientas avanzadas para el análisis de datos.',
      duration: '6 horas',
      order: 4,
      lessons: [
        {
          id: 'les-4-1',
          title: 'Validación de datos y operaciones avanzadas',
          description: 'Técnicas de validación y control de datos.',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/excel-validation',
            transcript: 'Aprenderás a implementar validación de datos y operaciones avanzadas en Excel.'
          },
          duration: '2 horas',
          order: 1
        },
        {
          id: 'les-4-2',
          title: 'Tablas dinámicas y resúmenes de datos',
          description: 'Creación y análisis con tablas dinámicas.',
          type: 'zoom',
          content: {
            meetingUrl: 'https://zoom.us/j/987654321',
            dateTime: new Date('2024-04-22T15:00:00'),
            host: 'Lic. Roberto Méndez'
          },
          duration: '2 horas',
          order: 2
        },
        {
          id: 'les-4-3',
          title: 'Fórmulas condicionales y automatización',
          description: 'Automatización de tareas mediante fórmulas avanzadas.',
          type: 'quiz',
          content: {
            questions: [
              {
                id: 'q1',
                text: '¿Qué función se utiliza para buscar valores en una tabla?',
                options: ['BUSCARV', 'SUMA', 'PROMEDIO', 'CONCATENAR'],
                correctOption: 0
              },
              {
                id: 'q2',
                text: '¿Cuál es la función para contar celdas con criterios específicos?',
                options: ['CONTAR.SI', 'SUMA', 'PROMEDIO.SI', 'CONTAR'],
                correctOption: 0
              }
            ],
            passingScore: 80
          },
          duration: '2 horas',
          order: 3
        }
      ]
    }
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-03-15')
};