import { supabase } from '../config/supabase';
import type { Skill, CourseSkill, ParticipantSkill, SkillLevel } from '../types/participants';

// --- Skills CRUD ---

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('status', 'active')
    .order('category')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const skills = await getSkills();
  return skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
}

export async function createSkill(
  skill: Pick<Skill, 'name' | 'slug' | 'category'> & Partial<Pick<Skill, 'description' | 'level'>>
): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

// --- Course-Skills ---

export async function getCourseSkills(courseId: string): Promise<CourseSkill[]> {
  const { data, error } = await supabase
    .from('course_skills')
    .select('*, skill:skills(*)')
    .eq('course_id', courseId);
  if (error) throw error;
  return data ?? [];
}

export async function addSkillToCourse(
  courseId: string,
  skillId: string,
  level: SkillLevel = 'basico',
  weight = 1
): Promise<void> {
  const { error } = await supabase
    .from('course_skills')
    .upsert({ course_id: courseId, skill_id: skillId, level, weight }, { onConflict: 'course_id,skill_id' });
  if (error) throw error;
}

export async function removeSkillFromCourse(courseId: string, skillId: string): Promise<void> {
  const { error } = await supabase
    .from('course_skills')
    .delete()
    .eq('course_id', courseId)
    .eq('skill_id', skillId);
  if (error) throw error;
}

// --- Participant Skills ---

export async function getParticipantSkills(participantId: string): Promise<ParticipantSkill[]> {
  const { data, error } = await supabase
    .from('participant_skills')
    .select('*, skill:skills(*)')
    .eq('participant_id', participantId)
    .eq('status', 'active');
  if (error) throw error;
  return data ?? [];
}

export async function getParticipantEffectiveSkills(
  participantId: string
): Promise<{ skill: Skill; level: SkillLevel; sources: { source_type: string; source_id: string | null; date_acquired: string }[] }[]> {
  const all = await getParticipantSkills(participantId);
  const levelOrder: Record<SkillLevel, number> = { basico: 1, intermedio: 2, avanzado: 3, especializado: 4 };

  const grouped = new Map<string, { skill: Skill; level: SkillLevel; sources: { source_type: string; source_id: string | null; date_acquired: string }[] }>();

  for (const ps of all) {
    if (!ps.skill) continue;
    const existing = grouped.get(ps.skill_id);
    const source = { source_type: ps.source_type, source_id: ps.source_id, date_acquired: ps.date_acquired };

    if (existing) {
      existing.sources.push(source);
      if (levelOrder[ps.level as SkillLevel] > levelOrder[existing.level]) {
        existing.level = ps.level as SkillLevel;
      }
    } else {
      grouped.set(ps.skill_id, {
        skill: ps.skill,
        level: ps.level as SkillLevel,
        sources: [source],
      });
    }
  }

  return Array.from(grouped.values());
}

export async function awardSkillToParticipant(
  participantId: string,
  skillId: string,
  level: SkillLevel,
  sourceType: 'course' | 'manual' | 'import',
  sourceId?: string
): Promise<void> {
  const { error } = await supabase
    .from('participant_skills')
    .upsert(
      { participant_id: participantId, skill_id: skillId, level, source_type: sourceType, source_id: sourceId ?? null },
      { onConflict: 'participant_id,skill_id,source_type,source_id' }
    );
  if (error) throw error;
}

export async function awardCourseSkillsToParticipant(
  participantId: string,
  courseId: string
): Promise<number> {
  const courseSkills = await getCourseSkills(courseId);
  let awarded = 0;
  for (const cs of courseSkills) {
    await awardSkillToParticipant(participantId, cs.skill_id, cs.level as SkillLevel, 'course', courseId);
    awarded++;
  }
  return awarded;
}

export async function revokeParticipantSkill(id: string): Promise<void> {
  const { error } = await supabase
    .from('participant_skills')
    .update({ status: 'revoked' })
    .eq('id', id);
  if (error) throw error;
}

// --- Skill Categories ---

export const SKILL_CATEGORIES = [
  'Habilidades Digitales',
  'Inteligencia Artificial',
  'Datos',
  'Gobierno Digital',
  'Seguridad Digital',
  'Productividad',
  'Emprendimiento',
  'Marketing Digital',
  'Innovación Pública',
] as const;

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  especializado: 'Especializado',
};

export const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  basico: 'bg-sky-100 text-sky-700',
  intermedio: 'bg-teal-100 text-teal-700',
  avanzado: 'bg-amber-100 text-amber-700',
  especializado: 'bg-rose-100 text-rose-700',
};
