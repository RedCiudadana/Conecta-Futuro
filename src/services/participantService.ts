import { supabase } from '../config/supabase';
import type {
  Participant,
  ParticipantFilters,
  ParticipantEmail,
  Organization,
  Tag,
  Enrollment,
  Attendance,
  ParticipationEvent,
  Certificate,
  Course,
  CourseSession,
  DashboardKPIs,
  ParticipantStatus,
  AuditLogEntry,
} from '../types/participants';

const PAGE_SIZE = 25;

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// --- Participants ---

export async function getParticipants(
  filters: ParticipantFilters = {},
  page = 1
): Promise<{ data: Participant[]; count: number }> {
  let query = supabase
    .from('participants')
    .select('*, organization:organizations(*)', { count: 'exact' });

  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(
      `first_name.ilike.${term},last_name.ilike.${term},primary_email.ilike.${term},dpi.ilike.${term}`
    );
  }
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.department) query = query.eq('department', filters.department);
  if (filters.gender) query = query.eq('gender', filters.gender);
  if (filters.digital_skill_level) query = query.eq('digital_skill_level', filters.digital_skill_level);
  if (filters.organization_id) query = query.eq('organization_id', filters.organization_id);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getParticipantById(id: string): Promise<Participant | null> {
  const { data, error } = await supabase
    .from('participants')
    .select('*, organization:organizations(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createParticipant(
  participant: Omit<Participant, 'id' | 'created_at' | 'updated_at' | 'organization' | 'tags' | 'enrollments'>
): Promise<Participant> {
  const normalized = { ...participant, primary_email: normalizeEmail(participant.primary_email) };

  const { data, error } = await supabase
    .from('participants')
    .insert(normalized)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('participant_emails').insert({
    participant_id: data.id,
    email: normalized.primary_email,
    is_primary: true,
  });

  await logParticipationEvent(data.id, 'registration', { source: 'admin' });

  return data;
}

export async function updateParticipant(
  id: string,
  updates: Partial<Omit<Participant, 'id' | 'created_at' | 'updated_at' | 'organization' | 'tags' | 'enrollments'>>
): Promise<Participant> {
  if (updates.primary_email) {
    updates.primary_email = normalizeEmail(updates.primary_email);
  }

  const { data, error } = await supabase
    .from('participants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteParticipant(id: string): Promise<void> {
  const { error } = await supabase.from('participants').delete().eq('id', id);
  if (error) throw error;
}

export async function checkDuplicateEmail(email: string, excludeId?: string): Promise<Participant | null> {
  let query = supabase
    .from('participants')
    .select('*')
    .eq('primary_email', normalizeEmail(email));

  if (excludeId) query = query.neq('id', excludeId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

export async function checkDuplicateDPI(dpi: string, excludeId?: string): Promise<Participant | null> {
  if (!dpi) return null;
  let query = supabase
    .from('participants')
    .select('*')
    .eq('dpi', dpi);

  if (excludeId) query = query.neq('id', excludeId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

// --- Organizations ---

export async function getOrganizations(): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('name');

  if (error) throw error;
  return data ?? [];
}

export async function createOrganization(
  org: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
): Promise<Organization> {
  const { data, error } = await supabase
    .from('organizations')
    .insert(org)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --- Tags ---

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from('tags').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function createTag(name: string, color = '#6B7280'): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name, color })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getParticipantTags(participantId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('participant_tags')
    .select('tag:tags(*)')
    .eq('participant_id', participantId);

  if (error) throw error;
  return (data ?? []).map((d: any) => d.tag).filter(Boolean);
}

export async function addTagToParticipant(participantId: string, tagId: string): Promise<void> {
  const { error } = await supabase
    .from('participant_tags')
    .insert({ participant_id: participantId, tag_id: tagId });

  if (error && !error.message.includes('duplicate')) throw error;
}

export async function removeTagFromParticipant(participantId: string, tagId: string): Promise<void> {
  const { error } = await supabase
    .from('participant_tags')
    .delete()
    .eq('participant_id', participantId)
    .eq('tag_id', tagId);

  if (error) throw error;
}

// --- Courses ---

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createCourse(
  course: Omit<Course, 'id' | 'created_at' | 'updated_at'>
): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCourseSessions(courseId: string): Promise<CourseSession[]> {
  const { data, error } = await supabase
    .from('course_sessions')
    .select('*, course:courses(*)')
    .eq('course_id', courseId)
    .order('session_number');

  if (error) throw error;
  return data ?? [];
}

// --- Enrollments ---

export async function getParticipantEnrollments(participantId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, course:courses(*)')
    .eq('participant_id', participantId)
    .order('enrolled_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, participant:participants(*)')
    .eq('course_id', courseId)
    .order('enrolled_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function enrollParticipant(
  participantId: string,
  courseId: string
): Promise<Enrollment> {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ participant_id: participantId, course_id: courseId })
    .select()
    .single();

  if (error) throw error;

  await logParticipationEvent(participantId, 'enrollment', { course_id: courseId });
  return data;
}

export async function updateEnrollment(
  id: string,
  updates: Partial<Pick<Enrollment, 'status' | 'completion_percentage' | 'final_grade' | 'completed_at' | 'drop_reason'>>
): Promise<Enrollment> {
  const { data, error } = await supabase
    .from('enrollments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --- Attendance ---

export async function getSessionAttendance(sessionId: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*, participant:participants(id, first_name, last_name, primary_email)')
    .eq('session_id', sessionId);

  if (error) throw error;
  return data ?? [];
}

export async function getParticipantAttendance(participantId: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*, session:course_sessions(*, course:courses(*))')
    .eq('participant_id', participantId)
    .order('check_in_time', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function recordAttendance(
  participantId: string,
  sessionId: string,
  status: Attendance['status'] = 'present'
): Promise<Attendance> {
  const { data, error } = await supabase
    .from('attendance')
    .upsert(
      { participant_id: participantId, session_id: sessionId, status, check_in_time: new Date().toISOString() },
      { onConflict: 'participant_id,session_id' }
    )
    .select()
    .single();

  if (error) throw error;

  await logParticipationEvent(participantId, 'attendance', { session_id: sessionId, status });
  return data;
}

export async function bulkRecordAttendance(
  records: { participant_id: string; session_id: string; status: Attendance['status'] }[]
): Promise<void> {
  const withTimestamp = records.map(r => ({ ...r, check_in_time: new Date().toISOString() }));
  const { error } = await supabase
    .from('attendance')
    .upsert(withTimestamp, { onConflict: 'participant_id,session_id' });

  if (error) throw error;
}

// --- Certificates ---

export async function getParticipantCertificates(participantId: string): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, course:courses(*)')
    .eq('participant_id', participantId)
    .order('issued_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// --- Participation Events (Timeline) ---

export async function getParticipantTimeline(participantId: string): Promise<ParticipationEvent[]> {
  const { data, error } = await supabase
    .from('participation_events')
    .select('*')
    .eq('participant_id', participantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

async function logParticipationEvent(
  participantId: string,
  eventType: ParticipationEvent['event_type'],
  eventData: Record<string, unknown> = {},
  createdBy = 'system'
): Promise<void> {
  await supabase.from('participation_events').insert({
    participant_id: participantId,
    event_type: eventType,
    event_data: eventData,
    created_by: createdBy,
  });
}

// --- Dashboard KPIs ---

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const [
    { count: totalParticipants },
    { data: statusData },
    { data: genderData },
    { data: deptData },
    { count: totalEnrollments },
    { data: enrollmentStatusData },
    { count: certificatesIssued },
    { data: attendanceData },
    { data: monthlyData },
    { data: enrollProgramData },
  ] = await Promise.all([
    supabase.from('participants').select('*', { count: 'exact', head: true }),
    supabase.from('participants').select('status'),
    supabase.from('participants').select('gender'),
    supabase.from('participants').select('department'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('status'),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
    supabase.from('attendance').select('status'),
    supabase.from('participants').select('created_at'),
    supabase.from('enrollments').select('course:courses(program)'),
  ]);

  const statusBreakdown = (statusData ?? []).reduce((acc, r) => {
    acc[r.status as ParticipantStatus] = (acc[r.status as ParticipantStatus] || 0) + 1;
    return acc;
  }, {} as Record<ParticipantStatus, number>);

  const activeParticipants = (statusBreakdown.active || 0) + (statusBreakdown.verified || 0);

  const genderBreakdown = (genderData ?? []).reduce((acc, r) => {
    const g = r.gender || 'no_especificado';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentBreakdown = (deptData ?? []).reduce((acc, r) => {
    const d = r.department || 'No especificado';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completedEnrollments = (enrollmentStatusData ?? []).filter(e => e.status === 'completed').length;
  const totalEnroll = enrollmentStatusData?.length || 1;
  const completionRate = Math.round((completedEnrollments / totalEnroll) * 100);

  const presentCount = (attendanceData ?? []).filter(a => a.status === 'present' || a.status === 'late').length;
  const totalAttendance = attendanceData?.length || 1;
  const averageAttendance = Math.round((presentCount / totalAttendance) * 100);

  const programBreakdown = (enrollProgramData ?? []).reduce((acc, r: any) => {
    const p = r.course?.program || 'otro';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyRegistrations = getMonthlyRegistrations(monthlyData ?? []);

  return {
    totalParticipants: totalParticipants ?? 0,
    activeParticipants,
    totalEnrollments: totalEnrollments ?? 0,
    completionRate,
    averageAttendance,
    certificatesIssued: certificatesIssued ?? 0,
    statusBreakdown,
    genderBreakdown,
    departmentBreakdown,
    programBreakdown,
    monthlyRegistrations,
  };
}

function getMonthlyRegistrations(data: { created_at: string }[]): { month: string; count: number }[] {
  const months: Record<string, number> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = 0;
  }

  for (const row of data) {
    const d = new Date(row.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (key in months) months[key]++;
  }

  return Object.entries(months).map(([month, count]) => ({ month, count }));
}

// --- Audit Log ---

export async function getAuditLog(page = 1): Promise<{ data: AuditLogEntry[]; count: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from('audit_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function logAuditEntry(
  entityType: string,
  entityId: string | null,
  action: string,
  changes: Record<string, unknown> = {},
  performedBy?: string
): Promise<void> {
  await supabase.from('audit_log').insert({
    entity_type: entityType,
    entity_id: entityId,
    action,
    changes,
    performed_by: performedBy,
  });
}
