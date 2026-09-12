export interface SeoMeta {
  title: string;
  description: string;
}

export const SITE_NAME = 'Escuela Conecta Futuro | Red Ciudadana';
export const SITE_URL = 'https://escuelaredciudadana.org';
export const DEFAULT_IMAGE = `${SITE_URL}/logo/redciudadana.png`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/uploads/cover-red-ciudadana.png`;

export const SEO: Record<string, SeoMeta> = {
  '/': {
    title: 'Escuela Conecta Futuro – Cursos gratuitos de Red Ciudadana',
    description:
      'Plataforma de formación digital gratuita del sector público en Guatemala: cursos de datos abiertos, IA, Excel, Power BI, ciberseguridad e innovación pública. Inscríbete hoy.',
  },
  '/courses': {
    title: 'Catálogo de Cursos – Escuela Conecta Futuro',
    description:
      'Explora cursos gratuitos en línea sobre gobierno digital, datos abiertos, inteligencia artificial, Excel, Power BI y ciberseguridad. Formación para servidores públicos y emprendedores.',
  },
  '/learning-paths': {
    title: 'Rutas de Aprendizaje – Escuela Conecta Futuro',
    description:
      'Recorre rutas formativas guiadas en transformación digital, innovación pública y habilidades tecnológicas. Avanza paso a paso desde lo básico hasta lo avanzado a tu propio ritmo.',
  },
  '/primeros-pasos-digitales': {
    title: 'Mis Primeros Pasos Digitales – Escuela Conecta Futuro',
    description:
      'Curso gratuito para principiantes en Guatemala: aprende lo esencial del uso de computadora, internet, correo electrónico y herramientas digitales. Empieza hoy sin experiencia previa.',
  },
  '/digitaliza-tu-pyme': {
    title: 'Digitaliza tu Pyme – Escuela Conecta Futuro',
    description:
      'Aprende a llevar tu pequeña empresa al mundo digital: herramientas online, gestión de redes sociales, ventas por internet y facturación electrónica. Gratis para emprendedores guatemaltecos.',
  },
  '/diagnostico-digital': {
    title: 'Diagnóstico Digital – Escuela Conecta Futuro',
    description:
      'Mide el nivel de madurez digital de tu institución o empresa con un diagnóstico gratuito. Recibe recomendaciones personalizadas para mejorar tus capacidades tecnológicas en Guatemala.',
  },
  '/directorio-ia': {
    title: 'Directorio de Herramientas de IA – Escuela Conecta Futuro',
    description:
      'Catálogo de herramientas de inteligencia artificial para el sector público y emprendedores. Filtra por categoría, encuentra la solución adecuada y aprende a usarla en tu trabajo.',
  },
  '/banco-prompts': {
    title: 'Banco de Prompts para IA – Escuela Conecta Futuro',
    description:
      'Colección de prompts listos para usar con ChatGPT y otras IAs: redacción, análisis de datos, gobierno digital y más. Copia, adapta y mejora tu productividad con inteligencia artificial.',
  },
  '/tutoriales': {
    title: 'Tutoriales – Escuela Conecta Futuro',
    description:
      'Guías prácticas y videotutoriales sobre herramientas digitales: Excel, Power BI, IA, datos abiertos y más. Aprende paso a paso con contenido gratuito diseñado para el contexto guatemalteco.',
  },
  '/verify-certificate': {
    title: 'Verificar Certificados – Escuela Conecta Futuro',
    description:
      'Verifica la autenticidad de un certificado emitido por la Escuela Conecta Futuro de Red Ciudadana. Ingresa el código del certificado para confirmar su validez de forma rápida y segura.',
  },
  '/community': {
    title: 'Comunidad – Escuela Conecta Futuro',
    description:
      'Noticias, historias y experiencias de la comunidad de aprendizaje de Red Ciudadana. Conoce los proyectos de innovación pública y transformación digital que impulsan servidores públicos.',
  },
  '/about': {
    title: 'Sobre Nosotros – Escuela Conecta Futuro | Red Ciudadana',
    description:
      'Conoce a Red Ciudadana, organización guatemalteca que promueve la transparencia, la innovación pública y la transformación digital. Descubre nuestra misión y el impacto de nuestros cursos.',
  },
  '/contact': {
    title: 'Contacto – Escuela Conecta Futuro | Red Ciudadana',
    description:
      '¿Tienes dudas sobre los cursos o la plataforma? Contáctanos. Escríbenos por correo o redes sociales y te responderemos. Equipo de Red Ciudadana al servicio del sector público guatemalteco.',
  },
  '/conecta-futuro': {
    title: 'Conecta Futuro 2025 – Evento de Innovación Pública',
    description:
      'Encuentro virtual sobre interoperabilidad, datos abiertos y ciberseguridad para transformar el Estado guatemalteco. Revisa la agenda, las grabaciones y los expositores del evento.',
  },
  '/course-sessions': {
    title: 'Sesiones de Cursos – Escuela Conecta Futuro',
    description:
      'Accede a las sesiones de los cursos de la Escuela Conecta Futuro: materiales, videos, presentaciones y recursos de aprendizaje. Contenido disponible 24/7 para estudiar a tu ritmo.',
  },
  '/documentation': {
    title: 'Documentación – Escuela Conecta Futuro',
    description:
      'Manuales, guías y documentación técnica de la plataforma. Aprende a navegar los cursos, inscribirte, descargar certificados y aprovechar al máximo las herramientas de aprendizaje.',
  },
};
