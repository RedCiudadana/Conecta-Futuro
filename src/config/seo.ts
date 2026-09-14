export interface SeoMeta {
  title: string;
  description: string;
}

export const SITE_NAME = 'Escuela Red Ciudadana';
export const SITE_URL = 'https://escuelaredciudadana.org';
export const DEFAULT_IMAGE = `${SITE_URL}/logo/redciudadana.png`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/uploads/cover-red-ciudadana.png`;

export const SEO: Record<string, SeoMeta> = {
  '/': {
    title: 'Escuela Red Ciudadana – Habilidades digitales para ampliar oportunidades',
    description:
      'Plataforma de aprendizaje práctico que acerca formación, herramientas y tecnología a personas, emprendedores y organizaciones. Aprende habilidades digitales que puedes aplicar desde hoy.',
  },
  '/courses': {
    title: 'Cursos y recursos – Escuela Red Ciudadana',
    description:
      'Explora oportunidades de aprendizaje en habilidades digitales, inteligencia artificial, datos, transformación digital e innovación pública. Formación práctica para personas, emprendedores y organizaciones.',
  },
  '/learning-paths': {
    title: 'Rutas de Aprendizaje – Escuela Red Ciudadana',
    description:
      'Recorre rutas formativas guiadas en transformación digital, innovación pública y habilidades tecnológicas. Avanza paso a paso desde lo básico hasta lo avanzado a tu propio ritmo.',
  },
  '/primeros-pasos-digitales': {
    title: 'Primeros Pasos Digitales – Una puerta de entrada a las oportunidades digitales',
    description:
      'Programa práctico para personas que quieren comenzar a utilizar herramientas digitales de manera sencilla y segura. Aprende desde cero a comunicarte, organizarte y promocionar productos en entornos digitales.',
  },
  '/digitaliza-tu-pyme': {
    title: 'Digitaliza tu PyME – Tecnología práctica para pequeños negocios',
    description:
      'Ayudamos a emprendedores y pequeños negocios a utilizar herramientas digitales para mejorar productividad, comunicación y ventas. Diagnostica tu negocio, aprende herramientas y aplica soluciones concretas.',
  },
  '/diagnostico-digital': {
    title: 'Diagnóstico Digital – Escuela Red Ciudadana',
    description:
      'Mide el nivel de madurez digital de tu negocio con un diagnóstico rápido. Recibe recomendaciones personalizadas y una ruta sugerida para fortalecer tus capacidades tecnológicas.',
  },
  '/directorio-ia': {
    title: 'Directorio de IA – Encuentra herramientas y aprende a utilizarlas',
    description:
      'Directorio de herramientas de inteligencia artificial para personas, negocios y organizaciones. Filtra por categoría, encuentra la solución adecuada y aprende a usar tecnología de forma práctica y responsable.',
  },
  '/banco-prompts': {
    title: 'Banco de Prompts para IA – Escuela Red Ciudadana',
    description:
      'Colección de prompts listos para usar con ChatGPT y otras IAs: redacción, análisis de datos, productividad y más. Copia, adapta y mejora tu trabajo con inteligencia artificial.',
  },
  '/tutoriales': {
    title: 'Tutoriales – Escuela Red Ciudadana',
    description:
      'Guías prácticas y videotutoriales sobre herramientas digitales: Excel, Power BI, IA, datos abiertos y más. Aprende paso a paso con contenido gratuito diseñado para el contexto guatemalteco.',
  },
  '/verify-certificate': {
    title: 'Verificar Certificados – Escuela Red Ciudadana',
    description:
      'Verifica la autenticidad de un certificado emitido por la Escuela Red Ciudadana. Ingresa el código del certificado para confirmar su validez de forma rápida y segura.',
  },
  '/community': {
    title: 'Comunidad – Escuela Red Ciudadana',
    description:
      'Noticias, historias y experiencias de la comunidad de aprendizaje de Red Ciudadana. Conoce los proyectos de innovación pública y transformación digital que impulsan personas y organizaciones.',
  },
  '/about': {
    title: 'Sobre Nosotros – Escuela Red Ciudadana | Red Ciudadana',
    description:
      'Red Ciudadana es una organización guatemalteca que promueve la transparencia, la innovación pública y la transformación digital. Conoce nuestra misión y cómo acercamos oportunidades digitales a más personas.',
  },
  '/contact': {
    title: 'Contacto – Escuela Red Ciudadana | Red Ciudadana',
    description:
      '¿Tienes dudas sobre la plataforma o quieres conversar sobre una alianza? Contáctanos. Trabajamos con instituciones, empresas, cooperación, universidades y organizaciones.',
  },
  '/conecta-futuro': {
    title: 'Conecta Futuro 2025 – Evento de Innovación Pública',
    description:
      'Encuentro virtual sobre interoperabilidad, datos abiertos y ciberseguridad para transformar el Estado guatemalteco. Revisa la agenda, las grabaciones y los expositores del evento.',
  },
  '/course-sessions': {
    title: 'Sesiones de Cursos – Escuela Red Ciudadana',
    description:
      'Accede a las sesiones de los cursos: materiales, videos, presentaciones y recursos de aprendizaje. Contenido disponible 24/7 para estudiar a tu ritmo.',
  },
  '/documentation': {
    title: 'Documentación – Escuela Red Ciudadana',
    description:
      'Manuales, guías y documentación técnica de la plataforma. Aprende a navegar los cursos, inscribirte, descargar certificados y aprovechar al máximo las herramientas de aprendizaje.',
  },
};
