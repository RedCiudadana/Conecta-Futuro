import { supabase } from '../config/supabase';

export interface BulkImportResult {
  created: number;
  duplicatesSkipped: number;
  participantsNotFound: string[];
  coursesNotFound: string[];
  sessionsNotFound: string[];
  errors: { row: number; reason: string }[];
}

function emptyResult(): BulkImportResult {
  return { created: 0, duplicatesSkipped: 0, participantsNotFound: [], coursesNotFound: [], sessionsNotFound: [], errors: [] };
}

async function buildParticipantEmailMap(): Promise<Map<string, string>> {
  const { data } = await supabase.from('participants').select('id, primary_email');
  const map = new Map<string, string>();
  for (const p of data ?? []) map.set(p.primary_email.toLowerCase().trim(), p.id);
  return map;
}

async function buildCourseNameMap(): Promise<Map<string, string>> {
  const { data } = await supabase.from('courses').select('id, title, slug');
  const map = new Map<string, string>();
  for (const c of data ?? []) {
    map.set(c.title.toLowerCase().trim(), c.id);
    if (c.slug) map.set(c.slug.toLowerCase().trim(), c.id);
  }
  return map;
}

async function buildSessionNameMap(): Promise<Map<string, string>> {
  const { data } = await supabase.from('course_sessions').select('id, title');
  const map = new Map<string, string>();
  for (const s of data ?? []) map.set(s.title.toLowerCase().trim(), s.id);
  return map;
}

function normalizeStatus(raw: string, validSet: string[], fallback: string): string {
  const lower = raw.toLowerCase().trim();
  const aliases: Record<string, string> = {
    inscrito: 'enrolled', completado: 'completed', 'en progreso': 'in_progress',
    abandonado: 'dropped', presente: 'present', ausente: 'absent', tarde: 'late',
    excusado: 'excused', emitido: 'emitted', revocado: 'revoked', pendiente: 'pending',
  };
  const resolved = aliases[lower] ?? lower;
  return validSet.includes(resolved) ? resolved : fallback;
}

export async function bulkImportEnrollments(rows: Record<string, string>[]): Promise<BulkImportResult> {
  const result = emptyResult();
  const [pMap, cMap] = await Promise.all([buildParticipantEmailMap(), buildCourseNameMap()]);
  const validStatuses = ['enrolled', 'in_progress', 'completed', 'dropped', 'waitlisted'];
  const toInsert: Record<string, unknown>[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const email = (row.email ?? '').toLowerCase().trim();
    const courseName = (row.course_name ?? '').toLowerCase().trim();
    if (!email || !courseName) { result.errors.push({ row: i + 1, reason: 'Email o curso vacío' }); continue; }

    const participantId = pMap.get(email);
    if (!participantId) { if (!result.participantsNotFound.includes(email)) result.participantsNotFound.push(email); continue; }

    const courseId = cMap.get(courseName);
    if (!courseId) { if (!result.coursesNotFound.includes(row.course_name)) result.coursesNotFound.push(row.course_name); continue; }

    toInsert.push({
      participant_id: participantId,
      course_id: courseId,
      status: normalizeStatus(row.status ?? 'enrolled', validStatuses, 'enrolled'),
      enrolled_at: row.enrolled_at || new Date().toISOString(),
      completed_at: (row.status ?? '').toLowerCase().includes('complet') ? (row.enrolled_at || new Date().toISOString()) : null,
    });
  }

  for (let i = 0; i < toInsert.length; i += 100) {
    const batch = toInsert.slice(i, i + 100);
    const { data, error } = await supabase.from('enrollments').upsert(batch, { onConflict: 'participant_id,course_id', ignoreDuplicates: true }).select('id');
    if (error) { result.errors.push({ row: i + 1, reason: error.message }); }
    else { result.created += (data?.length ?? 0); result.duplicatesSkipped += batch.length - (data?.length ?? 0); }
  }
  return result;
}

export async function bulkImportCertificates(rows: Record<string, string>[]): Promise<BulkImportResult> {
  const result = emptyResult();
  const [pMap, cMap] = await Promise.all([buildParticipantEmailMap(), buildCourseNameMap()]);
  const toInsert: Record<string, unknown>[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const email = (row.email ?? '').toLowerCase().trim();
    const courseName = (row.course_name ?? '').toLowerCase().trim();
    const code = (row.certificate_code ?? '').trim();
    if (!email || !courseName || !code) { result.errors.push({ row: i + 1, reason: 'Email, curso o código vacío' }); continue; }

    const participantId = pMap.get(email);
    if (!participantId) { if (!result.participantsNotFound.includes(email)) result.participantsNotFound.push(email); continue; }

    const courseId = cMap.get(courseName);
    if (!courseId) { if (!result.coursesNotFound.includes(row.course_name)) result.coursesNotFound.push(row.course_name); continue; }

    toInsert.push({
      participant_id: participantId,
      course_id: courseId,
      certificate_code: code,
      issued_at: row.issued_at || new Date().toISOString(),
      verification_url: row.verification_url || null,
      certificate_type: 'completion',
      status: 'emitted',
    });
  }

  for (let i = 0; i < toInsert.length; i += 100) {
    const batch = toInsert.slice(i, i + 100);
    const { data, error } = await supabase.from('certificates').upsert(batch, { onConflict: 'certificate_code', ignoreDuplicates: true }).select('id');
    if (error) { result.errors.push({ row: i + 1, reason: error.message }); }
    else { result.created += (data?.length ?? 0); result.duplicatesSkipped += batch.length - (data?.length ?? 0); }
  }
  return result;
}

export async function bulkImportAttendance(rows: Record<string, string>[]): Promise<BulkImportResult> {
  const result = emptyResult();
  const [pMap, sMap] = await Promise.all([buildParticipantEmailMap(), buildSessionNameMap()]);
  const validStatuses = ['present', 'absent', 'late', 'excused'];
  const toInsert: Record<string, unknown>[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const email = (row.email ?? '').toLowerCase().trim();
    const sessionName = (row.session_name ?? '').toLowerCase().trim();
    if (!email || !sessionName) { result.errors.push({ row: i + 1, reason: 'Email o sesión vacío' }); continue; }

    const participantId = pMap.get(email);
    if (!participantId) { if (!result.participantsNotFound.includes(email)) result.participantsNotFound.push(email); continue; }

    const sessionId = sMap.get(sessionName);
    if (!sessionId) { if (!result.sessionsNotFound.includes(row.session_name)) result.sessionsNotFound.push(row.session_name); continue; }

    toInsert.push({
      participant_id: participantId,
      session_id: sessionId,
      status: normalizeStatus(row.status ?? 'present', validStatuses, 'present'),
      check_in_time: row.date || null,
    });
  }

  for (let i = 0; i < toInsert.length; i += 100) {
    const batch = toInsert.slice(i, i + 100);
    const { data, error } = await supabase.from('attendance').upsert(batch, { onConflict: 'participant_id,session_id', ignoreDuplicates: true }).select('id');
    if (error) { result.errors.push({ row: i + 1, reason: error.message }); }
    else { result.created += (data?.length ?? 0); result.duplicatesSkipped += batch.length - (data?.length ?? 0); }
  }
  return result;
}
