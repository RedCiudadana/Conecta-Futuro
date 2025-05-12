import { Course, Module, Lesson } from '../types/course';

class CourseService {
  private readonly STORAGE_KEY = 'courses_data';

  constructor() {
    // Initialize storage with default courses if empty
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.initializeStorage();
    }
  }

  private initializeStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
  }

  getAllCourses(): Course[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getCourseById(id: string): Course | null {
    const courses = this.getAllCourses();
    return courses.find(course => course.id === id) || null;
  }

  createCourse(course: Course): void {
    const courses = this.getAllCourses();
    courses.push({
      ...course,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
  }

  updateCourse(id: string, updatedCourse: Partial<Course>): void {
    const courses = this.getAllCourses();
    const index = courses.findIndex(course => course.id === id);
    
    if (index !== -1) {
      courses[index] = {
        ...courses[index],
        ...updatedCourse,
        updatedAt: new Date()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
    }
  }

  deleteCourse(id: string): void {
    const courses = this.getAllCourses();
    const filteredCourses = courses.filter(course => course.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCourses));
  }

  // Module operations
  addModule(courseId: string, module: Module): void {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex !== -1) {
      courses[courseIndex].modules.push(module);
      courses[courseIndex].updatedAt = new Date();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
    }
  }

  updateModule(courseId: string, moduleId: string, updatedModule: Partial<Module>): void {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex !== -1) {
      const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        courses[courseIndex].modules[moduleIndex] = {
          ...courses[courseIndex].modules[moduleIndex],
          ...updatedModule
        };
        courses[courseIndex].updatedAt = new Date();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
      }
    }
  }

  // Lesson operations
  addLesson(courseId: string, moduleId: string, lesson: Lesson): void {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex !== -1) {
      const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        courses[courseIndex].modules[moduleIndex].lessons.push(lesson);
        courses[courseIndex].updatedAt = new Date();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
      }
    }
  }

  updateLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
    updatedLesson: Partial<Lesson>
  ): void {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex !== -1) {
      const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        const lessonIndex = courses[courseIndex].modules[moduleIndex].lessons.findIndex(
          l => l.id === lessonId
        );
        if (lessonIndex !== -1) {
          courses[courseIndex].modules[moduleIndex].lessons[lessonIndex] = {
            ...courses[courseIndex].modules[moduleIndex].lessons[lessonIndex],
            ...updatedLesson
          };
          courses[courseIndex].updatedAt = new Date();
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
        }
      }
    }
  }

  // Helper methods
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export const courseService = new CourseService();