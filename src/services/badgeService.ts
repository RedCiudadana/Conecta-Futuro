import { supabase } from '../config/supabase';
import type { SkillLevel } from '../types/participants';

export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  badge_type: 'path_completion' | 'skill_combo' | 'milestone' | 'manual';
  criteria: Record<string, any>;
  image_url: string | null;
  status: 'active' | 'archived';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ParticipantBadge {
  id: string;
  participant_id: string;
  badge_id: string;
  awarded_at: string;
  awarded_by: string;
  source_type: string;
  source_id: string | null;
  metadata: Record<string, any>;
  status: 'active' | 'revoked';
  badge?: Badge;
}

export interface PathProgress {
  id: string;
  participant_id: string;
  learning_path_id: string;
  started_at: string;
  completed_at: string | null;
  completion_percentage: number;
  courses_completed: number;
  courses_total: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  updated_at: string;
}

export interface CoursePrerequisite {
  id: string;
  course_id: string;
  prerequisite_course_id: string;
  is_strict: boolean;
  created_at: string;
  prerequisite_course?: { id: string; title: string; slug: string };
}

// --- Badges CRUD ---

export async function getBadges(): Promise<Badge[]> {
  const { data, error } = await supabase.from('badges').select('*').eq('status', 'active').order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function getBadgeBySlug(slug: string): Promise<Badge | null> {
  const { data, error } = await supabase.from('badges').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createBadge(badge: Partial<Badge> & Pick<Badge, 'name' | 'slug' | 'badge_type'>): Promise<Badge> {
  const { data, error } = await supabase.from('badges').insert(badge).select().single();
  if (error) throw error;
  return data;
}

export async function updateBadge(id: string, updates: Partial<Badge>): Promise<Badge> {
  const { data, error } = await supabase.from('badges').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteBadge(id: string): Promise<void> {
  const { error } = await supabase.from('badges').delete().eq('id', id);
  if (error) throw error;
}

// --- Participant Badges ---

export async function getParticipantBadges(participantId: string): Promise<ParticipantBadge[]> {
  const { data, error } = await supabase
    .from('participant_badges')
    .select('*, badge:badges(*)')
    .eq('participant_id', participantId)
    .eq('status', 'active')
    .order('awarded_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function awardBadge(
  participantId: string,
  badgeId: string,
  sourceType: 'path' | 'skill_combo' | 'milestone' | 'manual',
  sourceId?: string,
  awardedBy = 'auto'
): Promise<ParticipantBadge | null> {
  const { data, error } = await supabase
    .from('participant_badges')
    .upsert(
      { participant_id: participantId, badge_id: badgeId, source_type: sourceType, source_id: sourceId ?? null, awarded_by: awardedBy },
      { onConflict: 'participant_id,badge_id' }
    )
    .select('*, badge:badges(*)')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function revokeBadge(participantBadgeId: string): Promise<void> {
  const { error } = await supabase.from('participant_badges').update({ status: 'revoked' }).eq('id', participantBadgeId);
  if (error) throw error;
}

// --- Path Progress ---

export async function getParticipantPathProgress(participantId: string): Promise<PathProgress[]> {
  const { data, error } = await supabase
    .from('path_progress')
    .select('*')
    .eq('participant_id', participantId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updatePathProgress(
  participantId: string,
  learningPathId: string,
  completedCourseSlugs: string[]
): Promise<PathProgress> {
  const { data: pathCourses } = await supabase
    .from('learning_path_courses')
    .select('course_slug, is_required')
    .eq('learning_path_id', learningPathId);

  const required = (pathCourses ?? []).filter(pc => pc.is_required);
  const total = required.length || (pathCourses ?? []).length;
  const completed = (pathCourses ?? []).filter(pc =>
    completedCourseSlugs.includes(pc.course_slug) && (required.length === 0 || pc.is_required)
  ).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = pct >= 100;

  const { data, error } = await supabase
    .from('path_progress')
    .upsert(
      {
        participant_id: participantId,
        learning_path_id: learningPathId,
        courses_completed: completed,
        courses_total: total,
        completion_percentage: Math.min(pct, 100),
        status: isComplete ? 'completed' : 'in_progress',
        completed_at: isComplete ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'participant_id,learning_path_id' }
    )
    .select()
    .single();
  if (error) throw error;

  if (isComplete) {
    await tryAwardPathBadge(participantId, learningPathId);
  }

  return data;
}

async function tryAwardPathBadge(participantId: string, learningPathId: string): Promise<void> {
  const { data: path } = await supabase
    .from('learning_paths')
    .select('badge_id')
    .eq('id', learningPathId)
    .maybeSingle();

  if (path?.badge_id) {
    await awardBadge(participantId, path.badge_id, 'path', learningPathId);
  }

  const { data: badges } = await supabase
    .from('badges')
    .select('id, criteria')
    .eq('badge_type', 'path_completion')
    .eq('status', 'active');

  for (const badge of badges ?? []) {
    if (badge.criteria?.path_id === learningPathId) {
      await awardBadge(participantId, badge.id, 'path', learningPathId);
    }
  }
}

export async function checkAndAwardSkillBadges(participantId: string): Promise<ParticipantBadge[]> {
  const { data: badges } = await supabase
    .from('badges')
    .select('id, criteria')
    .eq('badge_type', 'skill_combo')
    .eq('status', 'active');

  const { data: participantSkills } = await supabase
    .from('participant_skills')
    .select('skill_id, level')
    .eq('participant_id', participantId)
    .eq('status', 'active');

  const levelOrder: Record<string, number> = { basico: 1, intermedio: 2, avanzado: 3, especializado: 4 };
  const awarded: ParticipantBadge[] = [];

  for (const badge of badges ?? []) {
    const criteria = badge.criteria;
    if (!criteria?.skills || !Array.isArray(criteria.skills)) continue;
    const minLevel = levelOrder[criteria.min_level as string] || 1;

    const hasAll = criteria.skills.every((reqSkillId: string) =>
      (participantSkills ?? []).some(
        ps => ps.skill_id === reqSkillId && (levelOrder[ps.level] || 0) >= minLevel
      )
    );

    if (hasAll) {
      const result = await awardBadge(participantId, badge.id, 'skill_combo');
      if (result) awarded.push(result);
    }
  }

  return awarded;
}

// --- Milestones ---

export async function checkMilestoneBadges(participantId: string): Promise<void> {
  const { data: badges } = await supabase
    .from('badges')
    .select('id, criteria')
    .eq('badge_type', 'milestone')
    .eq('status', 'active');

  const { count: certCount } = await supabase
    .from('certificates')
    .select('id', { count: 'exact', head: true })
    .eq('participant_id', participantId)
    .neq('status', 'revoked');

  const { count: courseCount } = await supabase
    .from('enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('participant_id', participantId)
    .eq('status', 'completed');

  for (const badge of badges ?? []) {
    const c = badge.criteria;
    if (!c?.milestone_type) continue;

    let earned = false;
    if (c.milestone_type === 'certificates_count' && (certCount ?? 0) >= (c.threshold ?? 0)) earned = true;
    if (c.milestone_type === 'courses_completed' && (courseCount ?? 0) >= (c.threshold ?? 0)) earned = true;

    if (earned) {
      await awardBadge(participantId, badge.id, 'milestone');
    }
  }
}

// --- Course Prerequisites ---

export async function getCoursePrerequisites(courseId: string): Promise<CoursePrerequisite[]> {
  const { data, error } = await supabase
    .from('course_prerequisites')
    .select('*, prerequisite_course:courses!course_prerequisites_prerequisite_course_id_fkey(id, title, slug)')
    .eq('course_id', courseId);
  if (error) throw error;
  return (data ?? []).map(d => ({
    ...d,
    prerequisite_course: (d as any).prerequisite_course ?? undefined,
  }));
}

export async function addCoursePrerequisite(courseId: string, prerequisiteCourseId: string, isStrict = false): Promise<void> {
  const { error } = await supabase
    .from('course_prerequisites')
    .upsert({ course_id: courseId, prerequisite_course_id: prerequisiteCourseId, is_strict: isStrict }, { onConflict: 'course_id,prerequisite_course_id' });
  if (error) throw error;
}

export async function removeCoursePrerequisite(courseId: string, prerequisiteCourseId: string): Promise<void> {
  const { error } = await supabase
    .from('course_prerequisites')
    .delete()
    .eq('course_id', courseId)
    .eq('prerequisite_course_id', prerequisiteCourseId);
  if (error) throw error;
}

export async function checkPrerequisitesMet(participantId: string, courseId: string): Promise<{ met: boolean; missing: { title: string; slug: string; is_strict: boolean }[] }> {
  const prereqs = await getCoursePrerequisites(courseId);
  if (prereqs.length === 0) return { met: true, missing: [] };

  const { data: completedEnrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('participant_id', participantId)
    .eq('status', 'completed');

  const completedIds = new Set((completedEnrollments ?? []).map(e => e.course_id));
  const missing = prereqs
    .filter(p => !completedIds.has(p.prerequisite_course_id))
    .map(p => ({
      title: p.prerequisite_course?.title || 'Curso',
      slug: p.prerequisite_course?.slug || '',
      is_strict: p.is_strict,
    }));

  return { met: missing.filter(m => m.is_strict).length === 0, missing };
}

// --- Recommendation Engine ---

export interface CourseRecommendation {
  course: { id: string; title: string; slug: string; category: string | null; level: string | null; thumbnail_url: string | null };
  score: number;
  reasons: string[];
}

export async function getRecommendations(participantId: string, limit = 5): Promise<CourseRecommendation[]> {
  const [enrollRes, skillsRes, allCoursesRes, pathProgressRes] = await Promise.all([
    supabase.from('enrollments').select('course_id, status, course:courses(id, slug, category, level)').eq('participant_id', participantId),
    supabase.from('participant_skills').select('skill_id, level').eq('participant_id', participantId).eq('status', 'active'),
    supabase.from('courses').select('id, title, slug, category, level, thumbnail_url, status').in('status', ['open', 'in_progress']),
    supabase.from('path_progress').select('learning_path_id, status').eq('participant_id', participantId),
  ]);

  const enrollments = enrollRes.data ?? [];
  const enrolledCourseIds = new Set(enrollments.map(e => e.course_id));
  const completedCourseIds = new Set(enrollments.filter(e => e.status === 'completed').map(e => e.course_id));
  const participantSkillIds = new Set((skillsRes.data ?? []).map(s => s.skill_id));
  const completedCategories = new Set(
    enrollments.filter(e => e.status === 'completed').map(e => (e.course as any)?.category).filter(Boolean)
  );
  const completedLevels = enrollments.filter(e => e.status === 'completed').map(e => (e.course as any)?.level).filter(Boolean);
  const inProgressPaths = new Set(
    (pathProgressRes.data ?? []).filter(p => p.status === 'in_progress').map(p => p.learning_path_id)
  );

  const availableCourses = (allCoursesRes.data ?? []).filter(c => !enrolledCourseIds.has(c.id));

  const { data: courseSkillsData } = await supabase.from('course_skills').select('course_id, skill_id');
  const courseSkillMap = new Map<string, string[]>();
  for (const cs of courseSkillsData ?? []) {
    (courseSkillMap.get(cs.course_id) ?? (courseSkillMap.set(cs.course_id, []), courseSkillMap.get(cs.course_id)!)).push(cs.skill_id);
  }

  const { data: pathCourses } = await supabase.from('learning_path_courses').select('learning_path_id, course_slug');
  const pathCourseMap = new Map<string, string[]>();
  for (const pc of pathCourses ?? []) {
    (pathCourseMap.get(pc.learning_path_id) ?? (pathCourseMap.set(pc.learning_path_id, []), pathCourseMap.get(pc.learning_path_id)!)).push(pc.course_slug);
  }

  const levelProgression: Record<string, string> = { Basico: 'Intermedio', Intermedio: 'Avanzado' };
  const maxLevel = completedLevels.includes('Avanzado') ? 'Avanzado' : completedLevels.includes('Intermedio') ? 'Avanzado' : 'Intermedio';

  const scored: CourseRecommendation[] = availableCourses.map(course => {
    let score = 0;
    const reasons: string[] = [];

    if (course.category && completedCategories.has(course.category)) {
      score += 3;
      reasons.push(`Continúa tu aprendizaje en ${course.category}`);
    }

    const courseSkills = courseSkillMap.get(course.id) ?? [];
    const newSkills = courseSkills.filter(sid => !participantSkillIds.has(sid));
    if (newSkills.length > 0) {
      score += newSkills.length * 2;
      reasons.push(`Desarrolla ${newSkills.length} nueva${newSkills.length > 1 ? 's' : ''} habilidad${newSkills.length > 1 ? 'es' : ''}`);
    }

    for (const [pathId, slugs] of pathCourseMap) {
      if (inProgressPaths.has(pathId) && slugs.includes(course.slug)) {
        score += 5;
        reasons.push('Avanza en tu ruta de aprendizaje');
        break;
      }
    }

    if (course.level && course.level === maxLevel) {
      score += 1;
      reasons.push('Nivel adecuado para tu avance');
    }

    if (course.level === 'Basico' && completedCourseIds.size === 0) {
      score += 4;
      reasons.push('Ideal para comenzar');
    }

    return { course, score, reasons };
  });

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// --- Badge Display Helpers ---

export const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  sky: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
};

export const BADGE_TYPE_LABELS: Record<string, string> = {
  path_completion: 'Ruta Completada',
  skill_combo: 'Combinación de Habilidades',
  milestone: 'Logro',
  manual: 'Manual',
};
