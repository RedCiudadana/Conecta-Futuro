import type {
  InstructorFM,
  CourseFM,
  SessionFM,
  WithSlug,
} from '../types/course';

function slugFromPath(path: string): string {
  const file = path.split('/').pop() || '';
  return file.replace(/\.(md|json|ya?ml)$/, '');
}

class DecapContentService {
  /* --- globs: ahora tipamos "attributes" --- */
  private instructorsFiles = import.meta.glob<
    { attributes: InstructorFM }
  >('/src/content/instructores/*.md', { eager: true });

  private coursesFiles = import.meta.glob<
    { attributes: CourseFM }
  >('/src/content/cursos/*.md', { eager: true });

  private sessionsFiles = import.meta.glob<
    { attributes: SessionFM }
  >('/src/content/sesiones/*.md', { eager: true });

  /* --- caché --- */
  private _instructors?: WithSlug<InstructorFM>[];
  private _courses?: WithSlug<CourseFM>[];
  private _sessions?: WithSlug<SessionFM>[];

  /* --- lectores --- */
  async getInstructors() {
    if (!this._instructors) {
      this._instructors = Object.entries(this.instructorsFiles).map(
        ([path, mod]) => ({
          ...((mod as any).attributes ?? (mod as any).metadata),
          slug: slugFromPath(path),
        }),
      );
    }
    return this._instructors;
  }

  async getCourses() {
    if (!this._courses) {
      this._courses = Object.entries(this.coursesFiles).map(([path, mod]) => ({
        ...((mod as any).attributes ?? (mod as any).metadata),
        slug: slugFromPath(path),
      }));
    }
    return this._courses;
  }

  async getSessions() {
    if (!this._sessions) {
      this._sessions = Object.entries(this.sessionsFiles).map(
        ([path, mod]) => ({
          ...((mod as any).attributes ?? (mod as any).metadata),
          slug: slugFromPath(path),
        }),
      );
    }
    return this._sessions;
  }

  /* --- curso + instructor + sesiones --- */
  async getCourseBySlug(slug: string) {
    const [courses, instructors, sessions] = await Promise.all([
      this.getCourses(),
      this.getInstructors(),
      this.getSessions(),
    ]);

    const course = courses.find(c => c.slug === slug);
    if (!course) return null;

    return {
      ...course,
      instructor: instructors.find(i => i.title === course.instructor) ?? null,
      sesiones: sessions.filter(s => s.curso === course.title),
    };
  }
}

export const decapContentService = new DecapContentService();
