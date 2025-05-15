import type { CourseFM, InstructorFM, SessionFM } from '../types/course';

class DecapContentService {
  private instructors = import.meta.glob<
    { metadata: InstructorFM }
  >('/src/content/instructores/*.md', { eager: true });

  private courses = import.meta.glob<
    { metadata: CourseFM; default: string }
  >('/src/content/cursos/*.md', { eager: true });

  private sessions = import.meta.glob<
    { metadata: SessionFM }
  >('/src/content/sesiones/*.md', { eager: true });

  // 🚀 Se cachean los resultados la primera vez
  private _instructorList?: InstructorFM[];
  private _courseList?: CourseFM[];
  private _sessionList?: SessionFM[];

  /* ----------- LECTURA DE DATOS ----------- */
  async getInstructors(): Promise<InstructorFM[]> {
    if (!this._instructorList) {
      this._instructorList = Object.values(this.instructors).map(
        m => m.metadata
      );
    }
    return this._instructorList;
  }

  async getCourses(): Promise<CourseFM[]> {
    if (!this._courseList) {
      this._courseList = Object.values(this.courses).map(m => m.metadata);
    }
    return this._courseList;
  }

  async getSessions(): Promise<SessionFM[]> {
    if (!this._sessionList) {
      this._sessionList = Object.values(this.sessions).map(m => m.metadata);
    }
    return this._sessionList;
  }

  /* ----------- HELPERS ----------- */
  /** Devuelve un curso con sus sesiones e instructor */
  async getCourseBySlug(slug: string) {
    const [courses, sessions, instructors] = await Promise.all([
      this.getCourses(),
      this.getSessions(),
      this.getInstructors()
    ]);

    const course = courses.find(c => c.slug === slug);
    if (!course) return null;

    return {
      ...course,
      instructor: instructors.find(i => i.slug === course.instructor) || null,
      sesiones: sessions.filter(s => s.curso === slug)
    };
  }
}

export const decapContentService = new DecapContentService();
