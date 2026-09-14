export type ParticipantStatus = 'registered' | 'verified' | 'active' | 'inactive' | 'graduated' | 'dropped';
export type Gender = 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
export type DigitalSkillLevel = 'basico' | 'intermedio' | 'avanzado';
export type OrgType = 'empresa' | 'ong' | 'gobierno' | 'academia' | 'cooperativa' | 'otro';
export type OrgSize = 'micro' | 'pequeña' | 'mediana' | 'grande';
export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'dropped' | 'waitlisted';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type CourseStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
export type CourseProgram = 'primeros_pasos' | 'digitaliza_pyme' | 'directorio_ia' | 'otro';
export type CourseModality = 'presencial' | 'virtual' | 'hibrido' | 'autoestudio';
export type CertificateType = 'completion' | 'participation' | 'excellence';
export type EventType = 'registration' | 'verification' | 'enrollment' | 'attendance' | 'completion' | 'certification' | 'communication' | 'note' | 'status_change';

export interface Organization {
  id: string;
  name: string;
  type: OrgType | null;
  sector: string | null;
  size: OrgSize | null;
  municipality: string | null;
  department: string | null;
  phone: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  primary_email: string;
  phone: string | null;
  dpi: string | null;
  gender: Gender | null;
  birth_date: string | null;
  municipality: string | null;
  department: string | null;
  organization_id: string | null;
  role_in_org: string | null;
  digital_skill_level: DigitalSkillLevel | null;
  how_found_us: string | null;
  status: ParticipantStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  organization?: Organization | null;
  tags?: Tag[];
  enrollments?: Enrollment[];
}

export interface ParticipantEmail {
  id: string;
  participant_id: string;
  email: string;
  is_primary: boolean;
  is_verified: boolean;
  verified_at: string | null;
  verification_token: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  program: CourseProgram | null;
  modality: CourseModality | null;
  start_date: string | null;
  end_date: string | null;
  max_capacity: number | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface CourseSession {
  id: string;
  course_id: string;
  title: string;
  session_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  session_number: number | null;
  created_at: string;
  course?: Course;
}

export interface Enrollment {
  id: string;
  participant_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at: string | null;
  completion_percentage: number;
  final_grade: number | null;
  drop_reason: string | null;
  course?: Course;
  participant?: Participant;
}

export interface Attendance {
  id: string;
  participant_id: string;
  session_id: string;
  status: AttendanceStatus;
  check_in_time: string | null;
  notes: string | null;
  session?: CourseSession;
  participant?: Participant;
}

export interface ParticipationEvent {
  id: string;
  participant_id: string;
  event_type: EventType;
  event_data: Record<string, unknown>;
  created_by: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  participant_id: string;
  course_id: string;
  certificate_code: string;
  issued_at: string;
  certificate_type: CertificateType;
  pdf_url: string | null;
  metadata: Record<string, unknown>;
  course?: Course;
  participant?: Participant;
}

export interface AuditLogEntry {
  id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  changes: Record<string, unknown>;
  performed_by: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface ParticipantFilters {
  search?: string;
  status?: ParticipantStatus | '';
  department?: string;
  program?: CourseProgram | '';
  gender?: Gender | '';
  digital_skill_level?: DigitalSkillLevel | '';
  tag_id?: string;
  organization_id?: string;
}

export interface DashboardKPIs {
  totalParticipants: number;
  activeParticipants: number;
  totalEnrollments: number;
  completionRate: number;
  averageAttendance: number;
  certificatesIssued: number;
  statusBreakdown: Record<ParticipantStatus, number>;
  genderBreakdown: Record<string, number>;
  departmentBreakdown: Record<string, number>;
  programBreakdown: Record<string, number>;
  monthlyRegistrations: { month: string; count: number }[];
}

export const GUATEMALA_DEPARTMENTS = [
  'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 'Chiquimula',
  'El Progreso', 'Escuintla', 'Guatemala', 'Huehuetenango',
  'Izabal', 'Jalapa', 'Jutiapa', 'Petén',
  'Quetzaltenango', 'Quiché', 'Retalhuleu', 'Sacatepéquez',
  'San Marcos', 'Santa Rosa', 'Sololá', 'Suchitepéquez',
  'Totonicapán', 'Zacapa'
] as const;

export const STATUS_LABELS: Record<ParticipantStatus, string> = {
  registered: 'Registrado',
  verified: 'Verificado',
  active: 'Activo',
  inactive: 'Inactivo',
  graduated: 'Graduado',
  dropped: 'Desertor',
};

export const STATUS_COLORS: Record<ParticipantStatus, string> = {
  registered: 'bg-sky-100 text-sky-800',
  verified: 'bg-blue-100 text-blue-800',
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-gray-100 text-gray-800',
  graduated: 'bg-amber-100 text-amber-800',
  dropped: 'bg-red-100 text-red-800',
};

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  enrolled: 'Inscrito',
  in_progress: 'En Progreso',
  completed: 'Completado',
  dropped: 'Abandonó',
  waitlisted: 'En Espera',
};

export const PROGRAM_LABELS: Record<CourseProgram, string> = {
  primeros_pasos: 'Primeros Pasos Digitales',
  digitaliza_pyme: 'Digitaliza tu PyME',
  directorio_ia: 'Directorio IA',
  otro: 'Otro',
};
