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

// All four public breakdowns come from one aggregate-only server call. The
// browser can no longer read participant or survey rows: it receives counts,
// and small groups are suppressed so nobody can be identified.
let breakdownsCache: Promise<any> | null = null;

async function loadPublicBreakdowns(): Promise<any> {
  if (!breakdownsCache) {
    breakdownsCache = supabase
      .rpc('get_public_impact_breakdowns')
      .then(({ data }) => data ?? {});
  }
  return breakdownsCache;
}

export async function getDepartmentBreakdown(): Promise<DepartmentBreakdown[]> {
  const payload = await loadPublicBreakdowns();
  return (payload.departments ?? []).map((d: any) => ({
    department: d.department,
    trained: Number(d.trained ?? 0),
    registered: Number(d.registered ?? 0),
  }));
}

export async function getGenderBreakdown(): Promise<GenderBreakdown[]> {
  const payload = await loadPublicBreakdowns();
  return (payload.genders ?? []).map((g: any) => ({
    gender: g.gender,
    count: Number(g.count ?? 0),
  }));
}

export async function getAgeBreakdown(): Promise<AgeBreakdown[]> {
  const payload = await loadPublicBreakdowns();
  return (payload.ages ?? []).map((a: any) => ({
    age_range: a.age_range,
    count: Number(a.count ?? 0),
  }));
}

export async function getSurveyResults(_courseId?: string): Promise<SurveyResult[]> {
  const payload = await loadPublicBreakdowns();
  return (payload.surveys ?? []).map((s2: any) => ({
    survey_type: s2.survey_type,
    total: Number(s2.total ?? 0),
    avg_satisfaction: s2.avg_satisfaction === null || s2.avg_satisfaction === undefined ? null : Number(s2.avg_satisfaction),
    avg_learning: s2.avg_learning === null || s2.avg_learning === undefined ? null : Number(s2.avg_learning),
    applied_intention: s2.applied_intention === null || s2.applied_intention === undefined ? null : Number(s2.applied_intention),
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
