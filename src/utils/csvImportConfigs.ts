export interface ImportFieldDef {
  key: string;
  label: string;
  required: boolean;
  autoMatchPatterns: string[];
  description: string;
  example: string;
  validValues?: string[];
}

export interface ImportConfig {
  id: string;
  title: string;
  subtitle: string;
  fields: ImportFieldDef[];
  previewColumns: string[];
  sampleHeader: string;
}

export const enrollmentImportConfig: ImportConfig = {
  id: 'enrollments',
  title: 'Importar Inscripciones',
  subtitle: 'Email del participante, nombre del curso, fecha y estado',
  sampleHeader: 'email,course_name,enrolled_at,status',
  fields: [
    {
      key: 'email',
      label: 'Email participante',
      required: true,
      autoMatchPatterns: ['email', 'correo', 'correo electronico', 'correo electrónico'],
      description: 'Correo electrónico del participante. Debe coincidir exactamente con un participante ya registrado en el sistema.',
      example: 'juana.perez@muni.gob.gt',
    },
    {
      key: 'course_name',
      label: 'Nombre o slug del curso',
      required: true,
      autoMatchPatterns: ['curso', 'course', 'nombre_curso', 'nombre del curso', 'course_name'],
      description: 'Nombre completo del curso tal como aparece en el sistema, o su slug (ej: excel-para-la-gestion-publica). Debe coincidir con un curso existente.',
      example: 'Excel para la Gestión Pública',
    },
    {
      key: 'enrolled_at',
      label: 'Fecha inscripción',
      required: false,
      autoMatchPatterns: ['fecha', 'date', 'enrolled', 'fecha_inscripcion', 'fecha inscripción'],
      description: 'Fecha en que el participante se inscribió. Se acepta formato YYYY-MM-DD (2026-01-15) o DD/MM/YYYY (15/01/2026). Si se omite, se usa la fecha actual.',
      example: '2026-01-15',
    },
    {
      key: 'status',
      label: 'Estado',
      required: false,
      autoMatchPatterns: ['estado', 'status'],
      description: 'Estado de la inscripción. Valores aceptados: inscrito, en progreso, completado, abandonado, en espera. También acepta los valores en inglés: enrolled, in_progress, completed, dropped, waitlisted. Si se omite, se asigna "inscrito".',
      example: 'completado',
      validValues: ['inscrito', 'en progreso', 'completado', 'abandonado', 'en espera', 'enrolled', 'in_progress', 'completed', 'dropped', 'waitlisted'],
    },
  ],
  previewColumns: ['email', 'course_name', 'enrolled_at', 'status'],
};

export const certificateImportConfig: ImportConfig = {
  id: 'certificates',
  title: 'Importar Certificados',
  subtitle: 'Email, curso, código de certificado y fecha de emisión',
  sampleHeader: 'email,course_name,certificate_code,issued_at,verification_url',
  fields: [
    {
      key: 'email',
      label: 'Email participante',
      required: true,
      autoMatchPatterns: ['email', 'correo', 'correo electronico'],
      description: 'Correo electrónico del participante. Debe coincidir exactamente con un participante ya registrado en el sistema.',
      example: 'juana.perez@muni.gob.gt',
    },
    {
      key: 'course_name',
      label: 'Nombre o slug del curso',
      required: true,
      autoMatchPatterns: ['curso', 'course', 'nombre_curso', 'nombre del curso'],
      description: 'Nombre completo del curso tal como aparece en el sistema, o su slug. Debe coincidir con un curso existente.',
      example: 'Introducción a Datos Abiertos',
    },
    {
      key: 'certificate_code',
      label: 'Código certificado',
      required: true,
      autoMatchPatterns: ['codigo', 'code', 'certificate', 'certificado', 'certificate_code', 'codigo_certificado'],
      description: 'Código único del certificado. Si ya existe un certificado con el mismo código, se omite (no se duplica).',
      example: 'RC-2025AB3-XK42',
    },
    {
      key: 'issued_at',
      label: 'Fecha emisión',
      required: false,
      autoMatchPatterns: ['fecha', 'date', 'issued', 'emision', 'fecha_emision', 'issued_at'],
      description: 'Fecha de emisión del certificado. Formato YYYY-MM-DD (2026-01-15) o DD/MM/YYYY (15/01/2026). Si se omite, se usa la fecha actual.',
      example: '2026-01-20',
    },
    {
      key: 'verification_url',
      label: 'URL verificación',
      required: false,
      autoMatchPatterns: ['url', 'verificacion', 'link', 'verification_url'],
      description: 'Enlace para verificar el certificado en línea. Debe ser una URL completa (incluyendo https://). Si se omite, el certificado no tendrá enlace de verificación.',
      example: 'https://redciudadana.org/verify?code=RC-2025AB3-XK42',
    },
  ],
  previewColumns: ['email', 'course_name', 'certificate_code', 'issued_at'],
};

export const attendanceImportConfig: ImportConfig = {
  id: 'attendance',
  title: 'Importar Asistencia',
  subtitle: 'Email, nombre de sesión, fecha y estado de asistencia',
  sampleHeader: 'email,session_name,date,status',
  fields: [
    {
      key: 'email',
      label: 'Email participante',
      required: true,
      autoMatchPatterns: ['email', 'correo', 'correo electronico'],
      description: 'Correo electrónico del participante. Debe coincidir exactamente con un participante ya registrado en el sistema.',
      example: 'juana.perez@muni.gob.gt',
    },
    {
      key: 'session_name',
      label: 'Nombre de sesión',
      required: true,
      autoMatchPatterns: ['sesion', 'session', 'titulo', 'nombre_sesion', 'session_name', 'título', 'sesión'],
      description: 'Título de la sesión exactamente como aparece en el sistema. Debe coincidir con una sesión ya registrada para algún curso.',
      example: 'Sesión 1 – Introducción a los Datos Abiertos',
    },
    {
      key: 'date',
      label: 'Fecha',
      required: false,
      autoMatchPatterns: ['fecha', 'date'],
      description: 'Fecha de la sesión. Formato YYYY-MM-DD (2026-01-15) o DD/MM/YYYY (15/01/2026). Si se omite, no se registra hora de check-in.',
      example: '2026-01-15',
    },
    {
      key: 'status',
      label: 'Estado',
      required: true,
      autoMatchPatterns: ['estado', 'status', 'asistencia', 'attendance'],
      description: 'Estado de asistencia del participante en la sesión. Valores aceptados: presente, ausente, tarde, excusado. También acepta inglés: present, absent, late, excused.',
      example: 'presente',
      validValues: ['presente', 'ausente', 'tarde', 'excusado', 'present', 'absent', 'late', 'excused'],
    },
  ],
  previewColumns: ['email', 'session_name', 'date', 'status'],
};

export function autoMapFields(headers: string[], config: ImportConfig): Record<string, string> {
  const mapping: Record<string, string> = {};
  for (const field of config.fields) {
    const normalizedPatterns = field.autoMatchPatterns.map(p => p.toLowerCase().replace(/[_\s]/g, ''));
    const match = headers.find(h => {
      const normalized = h.toLowerCase().replace(/[_\s]/g, '');
      return normalizedPatterns.includes(normalized) || normalized === field.key.toLowerCase().replace(/[_\s]/g, '');
    });
    if (match) mapping[field.key] = match;
  }
  return mapping;
}
