import { supabase } from '../config/supabase';

export interface ImpactMetrics {
  total_registered: number;
  total_trained: number;
  total_enrollments: number;
  total_completed: number;
  completion_rate: number;
  certificates_issued: number;
  territories_reached: number;
  active_courses: number;
  last_updated: string;
}

export interface DepartmentBreakdown {
  department: string;
  trained: number;
  registered: number;
}

export interface GenderBreakdown {
  gender: string;
  count: number;
}

export interface AgeBreakdown {
  age_range: string;
  count: number;
}

export interface SurveyResult {
  survey_type: string;
  total: number;
  avg_satisfaction: number | null;
  avg_learning: number | null;
  applied_intention: number | null;
}

export async function getImpactMetrics(): Promise<ImpactMetrics> {
  const { data, error } = await supabase
    .from('impact_metrics')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data ?? {
    total_registered: 0,
    total_trained: 0,
    total_enrollments: 0,
    total_completed: 0,
    completion_rate: 0,
    certificates_issued: 0,
    territories_reached: 0,
    active_courses: 0,
    last_updated: new Date().toISOString(),
  };
}

export async function getDepartmentBreakdown(): Promise<DepartmentBreakdown[]> {
  const { data: trained, error: e1 } = await supabase
    .from('enrollments')
    .select('participant:participants(department)')
    .eq('status', 'completed');

  if (e1) throw e1;

  const trainedCounts = new Map<string, number>();
  for (const row of trained ?? []) {
    const dept = (row as any)?.participant?.department;
    if (dept) {
      trainedCounts.set(dept, (trainedCounts.get(dept) ?? 0) + 1);
    }
  }

  const { data: registered, error: e2 } = await supabase
    .from('participants')
    .select('department')
    .not('department', 'is', null);

  if (e2) throw e2;

  const registeredCounts = new Map<string, number>();
  for (const row of registered ?? []) {
    const dept = (row as any)?.department;
    if (dept) {
      registeredCounts.set(dept, (registeredCounts.get(dept) ?? 0) + 1);
    }
  }

  const allDepts = new Set([...trainedCounts.keys(), ...registeredCounts.keys()]);
  return Array.from(allDepts).map(dept => ({
    department: dept,
    trained: trainedCounts.get(dept) ?? 0,
    registered: registeredCounts.get(dept) ?? 0,
  })).sort((a, b) => b.trained - a.trained);
}

export async function getGenderBreakdown(): Promise<GenderBreakdown[]> {
  const { data, error } = await supabase
    .from('participants')
    .select('gender')
    .not('gender', 'is', null);

  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const g = (row as any)?.gender;
    if (g) counts.set(g, (counts.get(g) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([gender, count]) => ({ gender, count }))
    .filter(r => r.count >= 10)
    .sort((a, b) => b.count - a.count);
}

export async function getAgeBreakdown(): Promise<AgeBreakdown[]> {
  const { data, error } = await supabase
    .from('participants')
    .select('age_range')
    .not('age_range', 'is', null);

  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const ar = (row as any)?.age_range;
    if (ar) counts.set(ar, (counts.get(ar) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([age_range, count]) => ({ age_range, count }))
    .filter(r => r.count >= 10)
    .sort((a, b) => b.count - a.count);
}

export async function getSurveyResults(courseId?: string): Promise<SurveyResult[]> {
  let query = supabase.from('impact_surveys').select('survey_type, responses');
  if (courseId) query = query.eq('course_id', courseId);

  const { data, error } = await query;
  if (error) throw error;

  const byType = new Map<string, { satisfaction: number[]; learning: number[]; applied: number[] }>();

  for (const row of data ?? []) {
    const type = (row as any).survey_type;
    const responses = (row as any).responses ?? {};
    if (!byType.has(type)) byType.set(type, { satisfaction: [], learning: [], applied: [] });
    const bucket = byType.get(type)!;
    if (typeof responses.satisfaction === 'number') bucket.satisfaction.push(responses.satisfaction);
    if (typeof responses.learning === 'number') bucket.learning.push(responses.learning);
    if (typeof responses.applied_intention === 'number') bucket.applied.push(responses.applied_intention);
  }

  return Array.from(byType.entries()).map(([survey_type, bucket]) => ({
    survey_type,
    total: bucket.satisfaction.length + bucket.learning.length,
    avg_satisfaction: bucket.satisfaction.length ? bucket.satisfaction.reduce((a, b) => a + b, 0) / bucket.satisfaction.length : null,
    avg_learning: bucket.learning.length ? bucket.learning.reduce((a, b) => a + b, 0) / bucket.learning.length : null,
    applied_intention: bucket.applied.length ? bucket.applied.reduce((a, b) => a + b, 0) / bucket.applied.length : null,
  }));
}

export async function submitSurvey(
  participantId: string,
  courseId: string | null,
  surveyType: 'entry' | 'exit' | 'followup_3m' | 'followup_6m',
  responses: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase
    .from('impact_surveys')
    .insert({
      participant_id: participantId,
      course_id: courseId,
      survey_type: surveyType,
      responses,
    });

  if (error) throw error;
}

export interface AdminImpactFilters {
  dateFrom?: string;
  dateTo?: string;
  courseId?: string;
  program?: string;
  department?: string;
}

export async function getAdminImpactData(filters: AdminImpactFilters = {}) {
  let enrollmentQuery = supabase
    .from('enrollments')
    .select('status, enrolled_at, completed_at, course:courses(id, title, category, program), participant:participants(id, first_name, last_name, department, gender, age_range)');

  if (filters.dateFrom) enrollmentQuery = enrollmentQuery.gte('enrolled_at', filters.dateFrom);
  if (filters.dateTo) enrollmentQuery = enrollmentQuery.lte('enrolled_at', filters.dateTo);
  if (filters.courseId) enrollmentQuery = enrollmentQuery.eq('course_id', filters.courseId);
  if (filters.department) enrollmentQuery = enrollmentQuery.eq('participant.department', filters.department);
  if (filters.program) enrollmentQuery = enrollmentQuery.eq('course.program', filters.program);

  const { data: enrollments, error: eErr } = await enrollmentQuery;
  if (eErr) throw eErr;

  const { data: certs, error: cErr } = await supabase
    .from('certificates')
    .select('status, issued_at, course:courses(id, title, category, program), participant:participants(id, first_name, last_name, department)')
    .eq('status', 'emitted')
    .order('issued_at', { ascending: false });

  if (cErr) throw cErr;

  return { enrollments: enrollments ?? [], certificates: certs ?? [] };
}
