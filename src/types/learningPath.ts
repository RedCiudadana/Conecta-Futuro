export interface LearningPath {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  target_audience: string | null;
  objective: string | null;
  image_url: string | null;
  icon: string | null;
  initial_level: string | null;
  final_level: string | null;
  estimated_duration: string | null;
  competencies: string[];
  practical_activities: string[];
  associated_tools: string[];
  diagnostic_slug: string | null;
  final_evaluation_url: string | null;
  certificate_type: string | null;
  status: 'draft' | 'active' | 'archived';
  is_visible: boolean;
  sort_order: number;
  cta_text: string | null;
  cta_url: string | null;
  result_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface LearningPathCourse {
  id: string;
  learning_path_id: string;
  course_slug: string;
  sort_order: number;
  is_required: boolean;
  stage: 'diagnostico' | 'aprendizaje' | 'practica' | 'implementacion' | 'evaluacion' | null;
  created_at: string;
}

export interface LearningPathWithCourses extends LearningPath {
  courses: LearningPathCourse[];
}
