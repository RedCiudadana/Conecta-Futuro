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
  AttendanceFormLink,
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

export interface BulkImportResult {
  created: number;
  skippedDuplicates: number;
  errors: { row: number; email: string; reason: string }[];
}

export async function bulkImportParticipants(
  rows: Array<{
    first_name: string;
    last_name: string;
    primary_email: string;
    phone?: string | null;
    dpi?: string | null;
    gender?: string | null;
    department?: string | null;
    municipality?: string | null;
    digital_skill_level?: string | null;
    how_found_us?: string | null;
    organization_name?: string | null;
  }>
): Promise<BulkImportResult> {
  const result: BulkImportResult = { created: 0, skippedDuplicates: 0, errors: [] };

  const { data: existingEmails } = await supabase
    .from('participants')
    .select('primary_email');
  const emailSet = new Set((existingEmails ?? []).map(e => e.primary_email.toLowerCase()));

  const { data: existingDpis } = await supabase
    .from('participants')
    .select('dpi')
    .not('dpi', 'is', null);
  const dpiSet = new Set((existingDpis ?? []).map(e => e.dpi));

  const batchToInsert: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const email = normalizeEmail(row.primary_email);

    if (!email || !row.first_name?.trim() || !row.last_name?.trim()) {
      result.errors.push({ row: i + 2, email: email || '', reason: 'Nombre, apellido o email vacío' });
      continue;
    }

    if (emailSet.has(email)) {
      result.skippedDuplicates++;
      continue;
    }

    if (row.dpi && dpiSet.has(row.dpi)) {
      result.skippedDuplicates++;
      continue;
    }

    emailSet.add(email);
    if (row.dpi) dpiSet.add(row.dpi);

    batchToInsert.push({
      first_name: row.first_name.trim(),
      last_name: row.last_name.trim(),
      primary_email: email,
      phone: row.phone || null,
      dpi: row.dpi || null,
      gender: row.gender || null,
      department: row.department || null,
      municipality: row.municipality || null,
      digital_skill_level: row.digital_skill_level || null,
      how_found_us: row.how_found_us || null,
      status: 'registered' as const,
    });
  }

  if (batchToInsert.length > 0) {
    const BATCH_SIZE = 50;
    for (let i = 0; i < batchToInsert.length; i += BATCH_SIZE) {
      const batch = batchToInsert.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase
        .from('participants')
        .insert(batch)
        .select('id, primary_email');

      if (error) {
        for (const item of batch) {
          result.errors.push({ row: 0, email: item.primary_email, reason: error.message });
        }
      } else {
        result.created += data.length;
        const emailInserts = data.map(d => ({
          participant_id: d.id,
          email: d.primary_email,
          is_primary: true,
        }));
        await supabase.from('participant_emails').insert(emailInserts);

        const eventInserts = data.map(d => ({
          participant_id: d.id,
          event_type: 'registration' as const,
          event_data: { source: 'csv_import' },
          created_by: 'admin',
        }));
        await supabase.from('participation_events').insert(eventInserts);
      }
    }
  }

  return result;
}

export async function getAllParticipantsForMatching(): Promise<{ id: string; first_name: string; last_name: string; primary_email: string }[]> {
  const { data, error } = await supabase
    .from('participants')
    .select('id, first_name, last_name, primary_email');

  if (error) throw error;
  return data ?? [];
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

export async function updateCourse(
  id: string,
  updates: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>
): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
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

export async function createCourseSession(
  session: { course_id: string; title: string; session_date?: string | null; start_time?: string | null; end_time?: string | null; location?: string | null; session_number?: number | null }
): Promise<CourseSession> {
  const { data, error } = await supabase
    .from('course_sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCourseSession(
  id: string,
  updates: Partial<{ title: string; session_date: string | null; start_time: string | null; end_time: string | null; location: string | null; session_number: number | null }>
): Promise<CourseSession> {
  const { data, error } = await supabase
    .from('course_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourseSession(id: string): Promise<void> {
  const { error } = await supabase.from('course_sessions').delete().eq('id', id);
  if (error) throw error;
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

// --- Public Registration ---

export interface PublicRegistrationData {
  first_name: string;
  last_name: string;
  primary_email: string;
  phone?: string;
  gender?: string;
  department?: string;
  municipality?: string;
  sector?: string;
  institution?: string;
  digital_skill_level?: string;
  how_found_us?: string;
  consent?: boolean;
}

export interface PublicRegistrationResult {
  success: boolean;
  alreadyEnrolled: boolean;
  participantId: string;
  enrollmentId?: string;
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function ensureCourseFromCMS(
  slug: string,
  cmsTitle?: string
): Promise<Course> {
  const { data: existing } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) return existing;

  const title = cmsTitle || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const { data: created, error } = await supabase
    .from('courses')
    .insert({ slug, title, status: 'open' })
    .select('*')
    .single();

  if (error) throw error;
  return created;
}

export interface SyncResult {
  created: number;
  existing: number;
  errors: string[];
}

export async function syncCMSCoursesToDB(
  cmsCourses: { slug: string; title: string }[]
): Promise<SyncResult> {
  const result: SyncResult = { created: 0, existing: 0, errors: [] };

  const { data: dbCourses } = await supabase
    .from('courses')
    .select('slug');

  const existingSlugs = new Set((dbCourses || []).map(c => c.slug));

  for (const cms of cmsCourses) {
    if (existingSlugs.has(cms.slug)) {
      result.existing++;
      continue;
    }
    try {
      await supabase.from('courses').insert({
        slug: cms.slug,
        title: cms.title,
        status: 'open',
      });
      result.created++;
    } catch (err: any) {
      result.errors.push(`${cms.slug}: ${err.message}`);
    }
  }

  return result;
}

export async function publicRegisterForCourse(
  courseSlug: string,
  registration: PublicRegistrationData,
  cmsTitle?: string
): Promise<PublicRegistrationResult> {
  const email = normalizeEmail(registration.primary_email);

  let course: { id: string; status: string; max_capacity: number | null } | null;

  const { data: found, error: courseErr } = await supabase
    .from('courses')
    .select('id, status, max_capacity')
    .eq('slug', courseSlug)
    .maybeSingle();

  if (courseErr) throw courseErr;

  if (!found) {
    const created = await ensureCourseFromCMS(courseSlug, cmsTitle);
    course = { id: created.id, status: created.status, max_capacity: created.max_capacity };
  } else {
    course = found;
  }

  if (course.status !== 'open') {
    throw new Error('Este curso no tiene inscripciones abiertas en este momento');
  }

  const { data: existing } = await supabase
    .from('participants')
    .select('id')
    .eq('primary_email', email)
    .maybeSingle();

  let participantId: string;

  if (existing) {
    participantId = existing.id;
  } else {
    const { data: created, error: createErr } = await supabase
      .from('participants')
      .insert({
        first_name: registration.first_name.trim(),
        last_name: registration.last_name.trim(),
        primary_email: email,
        phone: registration.phone || null,
        gender: registration.gender || null,
        department: registration.department || null,
        municipality: registration.municipality || null,
        sector: registration.sector || null,
        institution: registration.institution || null,
        digital_skill_level: registration.digital_skill_level || null,
        how_found_us: registration.how_found_us || null,
        status: 'registered' as const,
      })
      .select('id')
      .single();

    if (createErr) throw createErr;
    participantId = created.id;

    await supabase.from('participant_emails').insert({
      participant_id: participantId,
      email,
      is_primary: true,
    });

    await supabase.from('participation_events').insert({
      participant_id: participantId,
      event_type: 'registration',
      event_data: { source: 'public_form', course_slug: courseSlug },
      created_by: 'public',
    });
  }

  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('participant_id', participantId)
    .eq('course_id', course.id)
    .maybeSingle();

  if (existingEnrollment) {
    return { success: true, alreadyEnrolled: true, participantId };
  }

  if (course.max_capacity) {
    const { count } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', course.id)
      .in('status', ['enrolled', 'in_progress', 'completed']);

    if (count && count >= course.max_capacity) {
      throw new Error('Este curso ha alcanzado su capacidad máxima');
    }
  }

  const { data: enrollment, error: enrollErr } = await supabase
    .from('enrollments')
    .insert({ participant_id: participantId, course_id: course.id })
    .select('id')
    .single();

  if (enrollErr) throw enrollErr;

  await supabase.from('participation_events').insert({
    participant_id: participantId,
    event_type: 'enrollment',
    event_data: { course_id: course.id, course_slug: courseSlug, source: 'public_form' },
    created_by: 'public',
  });

  sendRegistrationEmail({
    to: email,
    firstName: registration.first_name.trim(),
    courseTitle: cmsTitle || courseSlug,
    courseSlug,
  });

  return { success: true, alreadyEnrolled: false, participantId, enrollmentId: enrollment.id };
}

// --- Attendance Form Links ---

export async function getOrCreateAttendanceLink(sessionId: string): Promise<AttendanceFormLink> {
  const { data: existing } = await supabase
    .from('attendance_form_links')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (existing) return existing;

  const token = crypto.randomUUID().replace(/-/g, '').slice(0, 12);

  const { data, error } = await supabase
    .from('attendance_form_links')
    .insert({ session_id: sessionId, token })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAttendanceLinkByToken(token: string): Promise<{
  link: AttendanceFormLink;
  session: CourseSession;
  course: Course;
} | null> {
  const { data, error } = await supabase
    .from('attendance_form_links')
    .select('*, session:course_sessions(*, course:courses(*))')
    .eq('token', token)
    .maybeSingle();

  if (error || !data) return null;

  const session = (data as any).session;
  const course = session?.course;
  if (!session || !course) return null;

  return {
    link: { id: data.id, session_id: data.session_id, token: data.token, is_active: data.is_active, expires_at: data.expires_at, created_at: data.created_at },
    session,
    course,
  };
}

export async function toggleAttendanceLinkActive(linkId: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('attendance_form_links')
    .update({ is_active: isActive })
    .eq('id', linkId);

  if (error) throw error;
}

export async function publicRecordAttendance(
  token: string,
  email: string,
  verifyName?: string,
  verifyInstitution?: string
): Promise<{ success: boolean; alreadyRecorded: boolean; participantName?: string }> {
  const linkData = await getAttendanceLinkByToken(token);
  if (!linkData) throw new Error('Enlace no válido');

  const { link, session } = linkData;

  if (!link.is_active) throw new Error('Este formulario de asistencia ya no está activo');

  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    throw new Error('Este enlace ha expirado');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const { data: participant } = await supabase
    .from('participants')
    .select('id, first_name, last_name, institution')
    .eq('primary_email', normalizedEmail)
    .maybeSingle();

  if (!participant) {
    throw new Error('No se encontró un participante registrado con este correo electrónico. Asegúrate de usar el mismo correo con el que te inscribiste al curso.');
  }

  if (verifyName && verifyName.trim()) {
    const dbFullName = `${participant.first_name} ${participant.last_name}`.toLowerCase();
    const inputName = verifyName.trim().toLowerCase();
    if (!dbFullName.includes(inputName) && !inputName.includes(dbFullName.split(' ')[0])) {
      throw new Error('El nombre ingresado no coincide con el participante registrado con este correo.');
    }
  }

  if (verifyInstitution && verifyInstitution.trim() && (participant as any).institution) {
    const dbInst = ((participant as any).institution as string).toLowerCase();
    const inputInst = verifyInstitution.trim().toLowerCase();
    if (!dbInst.includes(inputInst) && !inputInst.includes(dbInst)) {
      throw new Error('La institución ingresada no coincide con la registrada para este participante.');
    }
  }

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('participant_id', participant.id)
    .eq('course_id', session.course_id)
    .maybeSingle();

  if (!enrollment) {
    throw new Error('No estás inscrito en este curso. Debes inscribirte antes de registrar tu asistencia.');
  }

  const { data: existingAttendance } = await supabase
    .from('attendance')
    .select('id')
    .eq('participant_id', participant.id)
    .eq('session_id', session.id)
    .maybeSingle();

  if (existingAttendance) {
    return { success: true, alreadyRecorded: true, participantName: `${participant.first_name} ${participant.last_name}` };
  }

  const { error } = await supabase
    .from('attendance')
    .insert({
      participant_id: participant.id,
      session_id: session.id,
      status: 'present',
      check_in_time: new Date().toISOString(),
    });

  if (error) throw error;

  return { success: true, alreadyRecorded: false, participantName: `${participant.first_name} ${participant.last_name}` };
}

async function sendRegistrationEmail(payload: {
  to: string;
  firstName: string;
  courseTitle: string;
  courseSlug: string;
}) {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-registration-email`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('Email send failed:', res.status);
    }
  } catch (err) {
    console.error('Email send error:', err);
  }
}
