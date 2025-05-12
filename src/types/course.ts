export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  modules: Module[];
  instructor: Instructor;
  requirements: string[];
  objectives: string[];
  category: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'zoom';
  content: VideoContent | DocumentContent | QuizContent | ZoomContent;
  duration: string;
  order: number;
}

export interface VideoContent {
  videoUrl: string;
  transcript?: string;
}

export interface DocumentContent {
  documentUrl: string;
  type: 'pdf' | 'presentation';
}

export interface QuizContent {
  questions: Question[];
  passingScore: number;
}

export interface ZoomContent {
  meetingUrl: string;
  dateTime: Date;
  host: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
}