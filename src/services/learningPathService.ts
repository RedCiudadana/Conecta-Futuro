import { supabase } from '../config/supabase';
import type { LearningPath, LearningPathCourse, LearningPathWithCourses } from '../types/learningPath';

export async function getLearningPaths(): Promise<LearningPath[]> {
  const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('status', 'active')
    .eq('is_visible', true)
    .order('sort_order');

  if (error) throw error;
  return data ?? [];
}

export async function getLearningPathBySlug(slug: string): Promise<LearningPathWithCourses | null> {
  const { data: path, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!path) return null;

  const { data: courses, error: coursesError } = await supabase
    .from('learning_path_courses')
    .select('*')
    .eq('learning_path_id', path.id)
    .order('sort_order');

  if (coursesError) throw coursesError;

  return { ...path, courses: courses ?? [] };
}
