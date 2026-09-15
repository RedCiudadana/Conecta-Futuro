export interface ImportFieldDef {
  key: string;
  label: string;
  required: boolean;
  autoMatchPatterns: string[];
}

export interface ImportConfig {
  id: string;
  title: string;
  subtitle: string;
  fields: ImportFieldDef[];
  previewColumns: string[];
}

export const enrollmentImportConfig: ImportConfig = {
  id: 'enrollments',
  title: 'Importar Inscripciones',
  subtitle: 'Email del participante, nombre del curso, fecha y estado',
  fields: [
    { key: 'email', label: 'Email participante', required: true, autoMatchPatterns: ['email', 'correo', 'correo electronico', 'correo electrónico'] },
    { key: 'course_name', label: 'Nombre o slug del curso', required: true, autoMatchPatterns: ['curso', 'course', 'nombre_curso', 'nombre del curso', 'course_name'] },
    { key: 'enrolled_at', label: 'Fecha inscripción', required: false, autoMatchPatterns: ['fecha', 'date', 'enrolled', 'fecha_inscripcion', 'fecha inscripción'] },
    { key: 'status', label: 'Estado', required: false, autoMatchPatterns: ['estado', 'status'] },
  ],
  previewColumns: ['email', 'course_name', 'enrolled_at', 'status'],
};

export const certificateImportConfig: ImportConfig = {
  id: 'certificates',
  title: 'Importar Certificados',
  subtitle: 'Email, curso, código de certificado y fecha de emisión',
  fields: [
    { key: 'email', label: 'Email participante', required: true, autoMatchPatterns: ['email', 'correo', 'correo electronico'] },
    { key: 'course_name', label: 'Nombre o slug del curso', required: true, autoMatchPatterns: ['curso', 'course', 'nombre_curso', 'nombre del curso'] },
    { key: 'certificate_code', label: 'Código certificado', required: true, autoMatchPatterns: ['codigo', 'code', 'certificate', 'certificado', 'certificate_code', 'codigo_certificado'] },
    { key: 'issued_at', label: 'Fecha emisión', required: false, autoMatchPatterns: ['fecha', 'date', 'issued', 'emision', 'fecha_emision', 'issued_at'] },
    { key: 'verification_url', label: 'URL verificación', required: false, autoMatchPatterns: ['url', 'verificacion', 'link', 'verification_url'] },
  ],
  previewColumns: ['email', 'course_name', 'certificate_code', 'issued_at'],
};

export const attendanceImportConfig: ImportConfig = {
  id: 'attendance',
  title: 'Importar Asistencia',
  subtitle: 'Email, nombre de sesión, fecha y estado de asistencia',
  fields: [
    { key: 'email', label: 'Email participante', required: true, autoMatchPatterns: ['email', 'correo', 'correo electronico'] },
    { key: 'session_name', label: 'Nombre de sesión', required: true, autoMatchPatterns: ['sesion', 'session', 'titulo', 'nombre_sesion', 'session_name', 'título', 'sesión'] },
    { key: 'date', label: 'Fecha', required: false, autoMatchPatterns: ['fecha', 'date'] },
    { key: 'status', label: 'Estado', required: true, autoMatchPatterns: ['estado', 'status', 'asistencia', 'attendance'] },
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
