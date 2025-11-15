// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserProfile extends User {
  bio?: string;
  organization?: string;
  position?: string;
  country?: string;
  completedCourses: string[];
  badges: Badge[];
}

// Auth types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Course types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  instructors: Instructor[];
  duration: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  categories: string[];
  modules: Module[];
  totalLessons: number;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
  enrollmentCount: number;
  completionRate: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  type: 'video' | 'document' | 'quiz';
  completed?: boolean;
  content: VideoContent | DocumentContent | QuizContent;
}

export interface VideoContent {
  videoUrl: string;
  thumbnailUrl?: string;
  transcript?: string;
}

export interface DocumentContent {
  documentUrl: string;
  documentType: 'pdf' | 'doc' | 'other';
}

export interface QuizContent {
  questions: Question[];
  passingScore: number;
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
  photoURL: string;
  bio: string;
  title: string;
}

// Progress types
export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastAccessedLessonId: string;
  startDate: Date;
  completionDate?: Date;
  quizResults: QuizResult[];
  progress: number; // Percentage (0-100)
}

export interface QuizResult {
  quizId: string;
  score: number;
  passed: boolean;
  completedAt: Date;
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number;
  correct: boolean;
}

// Certificate types
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  issueDate: Date;
  pdfUrl: string;
  verificationCode: string;
}

export interface CertificateRecord {
  certificateCode: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  completionDate: string;
  issueDate: string;
  instructorName: string;
  expirationDate?: string;
}

// Badge types
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: string;
  earnedAt?: Date;
}

// Comment/Community types
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  courseId: string;
  lessonId?: string;
  parentCommentId?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  replies?: Comment[];
}