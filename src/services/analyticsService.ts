import { supabase } from '../config/supabase';

export interface MonthlyDataPoint {
  month: string;
  count: number;
}

export interface EnrollmentAnalytics {
  totalEnrollments: number;
  completionRate: number;
  enrollmentsByMonth: MonthlyDataPoint[];
  enrollmentsByProgram: { program: string; count: number }[];
  enrollmentsByCourse: { course: string; enrolled: number; completed: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export interface DemographicsAnalytics {
  departmentDistribution: { department: string; count: number }[];
  genderBreakdown: { gender: string; count: number }[];
  skillLevelDistribution: { level: string; count: number }[];
  topInstitutions: { institution: string; count: number }[];
  totalParticipants: number;
}

export interface CertificateAnalyticsData {
  totalCertificates: number;
  certificatesByMonth: MonthlyDataPoint[];
  topCertifiedCourses: { course: string; count: number }[];
  certificateTypeBreakdown: { type: string; count: number }[];
}

export interface SkillsBadgeAnalyticsData {
  topSkills: { name: string; category: string; count: number }[];
  badgesByType: { type: string; count: number }[];
  totalSkillsAwarded: number;
  totalBadgesAwarded: number;
}

export interface PathAnalyticsData {
  pathCompletionRates: { path: string; avgProgress: number; totalEnrolled: number; completed: number }[];
}

function groupByMonth(dates: string[]): MonthlyDataPoint[] {
  const counts: Record<string, number> = {};
  for (const d of dates) {
    const month = d.slice(0, 7);
    counts[month] = (counts[month] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('es-GT', { month: 'short', year: '2-digit' }),
      count,
    }));
}

export async function getEnrollmentAnalytics(): Promise<EnrollmentAnalytics> {
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, status, enrolled_at, course:courses(title, program)');

  const items = enrollments ?? [];
  const total = items.length;
  const completed = items.filter(e => e.status === 'completed').length;

  const programCounts: Record<string, number> = {};
  const courseCounts: Record<string, { enrolled: number; completed: number }> = {};
  const statusCounts: Record<string, number> = {};

  for (const e of items) {
    const program = (e.course as any)?.program || 'otro';
    programCounts[program] = (programCounts[program] ?? 0) + 1;

    const courseName = (e.course as any)?.title || 'Desconocido';
    if (!courseCounts[courseName]) courseCounts[courseName] = { enrolled: 0, completed: 0 };
    courseCounts[courseName].enrolled++;
    if (e.status === 'completed') courseCounts[courseName].completed++;

    statusCounts[e.status] = (statusCounts[e.status] ?? 0) + 1;
  }

  return {
    totalEnrollments: total,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    enrollmentsByMonth: groupByMonth(items.map(e => e.enrolled_at)),
    enrollmentsByProgram: Object.entries(programCounts).map(([program, count]) => ({ program, count })).sort((a, b) => b.count - a.count),
    enrollmentsByCourse: Object.entries(courseCounts).map(([course, v]) => ({ course, ...v })).sort((a, b) => b.enrolled - a.enrolled).slice(0, 15),
    statusBreakdown: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
  };
}

export async function getDemographicsAnalytics(): Promise<DemographicsAnalytics> {
  const { data: participants } = await supabase
    .from('participants')
    .select('department, gender, digital_skill_level, institution');

  const items = participants ?? [];
  const deptCounts: Record<string, number> = {};
  const genderCounts: Record<string, number> = {};
  const levelCounts: Record<string, number> = {};
  const instCounts: Record<string, number> = {};

  for (const p of items) {
    if (p.department) deptCounts[p.department] = (deptCounts[p.department] ?? 0) + 1;
    genderCounts[p.gender || 'No especificado'] = (genderCounts[p.gender || 'No especificado'] ?? 0) + 1;
    levelCounts[p.digital_skill_level || 'No evaluado'] = (levelCounts[p.digital_skill_level || 'No evaluado'] ?? 0) + 1;
    if (p.institution) instCounts[p.institution] = (instCounts[p.institution] ?? 0) + 1;
  }

  return {
    totalParticipants: items.length,
    departmentDistribution: Object.entries(deptCounts).map(([department, count]) => ({ department, count })).sort((a, b) => b.count - a.count),
    genderBreakdown: Object.entries(genderCounts).map(([gender, count]) => ({ gender, count })),
    skillLevelDistribution: Object.entries(levelCounts).map(([level, count]) => ({ level, count })),
    topInstitutions: Object.entries(instCounts).map(([institution, count]) => ({ institution, count })).sort((a, b) => b.count - a.count).slice(0, 15),
  };
}

export async function getCertificateAnalytics(): Promise<CertificateAnalyticsData> {
  const { data: certificates } = await supabase
    .from('certificates')
    .select('id, issued_at, certificate_type, status, course:courses(title)')
    .neq('status', 'revoked');

  const items = certificates ?? [];

  const courseCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  for (const c of items) {
    const courseName = (c.course as any)?.title || 'Desconocido';
    courseCounts[courseName] = (courseCounts[courseName] ?? 0) + 1;
    typeCounts[c.certificate_type] = (typeCounts[c.certificate_type] ?? 0) + 1;
  }

  return {
    totalCertificates: items.length,
    certificatesByMonth: groupByMonth(items.map(c => c.issued_at)),
    topCertifiedCourses: Object.entries(courseCounts).map(([course, count]) => ({ course, count })).sort((a, b) => b.count - a.count).slice(0, 10),
    certificateTypeBreakdown: Object.entries(typeCounts).map(([type, count]) => ({ type, count })),
  };
}

export async function getSkillsBadgeAnalytics(): Promise<SkillsBadgeAnalyticsData> {
  const [{ data: pSkills }, { data: pBadges }] = await Promise.all([
    supabase.from('participant_skills').select('skill:skills(name, category)').eq('status', 'active'),
    supabase.from('participant_badges').select('badge:badges(badge_type)').eq('status', 'active'),
  ]);

  const skillCounts: Record<string, { category: string; count: number }> = {};
  for (const ps of pSkills ?? []) {
    const name = (ps.skill as any)?.name ?? 'Desconocido';
    const category = (ps.skill as any)?.category ?? '';
    if (!skillCounts[name]) skillCounts[name] = { category, count: 0 };
    skillCounts[name].count++;
  }

  const badgeTypeCounts: Record<string, number> = {};
  for (const pb of pBadges ?? []) {
    const type = (pb.badge as any)?.badge_type ?? 'manual';
    badgeTypeCounts[type] = (badgeTypeCounts[type] ?? 0) + 1;
  }

  return {
    topSkills: Object.entries(skillCounts).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.count - a.count).slice(0, 15),
    badgesByType: Object.entries(badgeTypeCounts).map(([type, count]) => ({ type, count })),
    totalSkillsAwarded: (pSkills ?? []).length,
    totalBadgesAwarded: (pBadges ?? []).length,
  };
}

export async function getPathAnalytics(): Promise<PathAnalyticsData> {
  const { data: progress } = await supabase
    .from('path_progress')
    .select('completion_percentage, status, learning_path:learning_paths(name)');

  const pathData: Record<string, { totalProgress: number; count: number; completed: number }> = {};
  for (const p of progress ?? []) {
    const name = (p.learning_path as any)?.name ?? 'Desconocida';
    if (!pathData[name]) pathData[name] = { totalProgress: 0, count: 0, completed: 0 };
    pathData[name].totalProgress += p.completion_percentage;
    pathData[name].count++;
    if (p.status === 'completed') pathData[name].completed++;
  }

  return {
    pathCompletionRates: Object.entries(pathData)
      .map(([path, v]) => ({
        path,
        avgProgress: Math.round(v.totalProgress / v.count),
        totalEnrolled: v.count,
        completed: v.completed,
      }))
      .sort((a, b) => b.totalEnrolled - a.totalEnrolled),
  };
}
