import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataProtectionCourse } from '../../data/courses/data-protection';
import { powerBiCourse } from '../../data/courses/power-bi';
import { ChevronLeft, ChevronRight, Play, FileText, Users, Award } from 'lucide-react';

const courses = {
  'data-protection-2024': dataProtectionCourse,
  'power-bi-2024': powerBiCourse
};

const CourseSession = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courseId ? courses[courseId as keyof typeof courses] : null;
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Curso no encontrado</h1>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule.lessons[currentLessonIndex];
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const currentLessonNumber = course.modules
    .slice(0, currentModuleIndex)
    .reduce((acc, module) => acc + module.lessons.length, 0) + currentLessonIndex + 1;

  const handleNext = () => {
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(course.modules[currentModuleIndex - 1].lessons.length - 1);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'zoom':
        return <Users className="w-5 h-5" />;
      case 'quiz':
        return <Award className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const renderContent = () => {
    switch (currentLesson.type) {
      case 'video':
        return (
          <div className="aspect-video bg-gray-900 rounded-lg mb-6">
            <iframe
              src={currentLesson.content.videoUrl}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );
      case 'document':
        return (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <a
              href={currentLesson.content.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <FileText className="w-5 h-5 mr-2" />
              Ver documento
            </a>
          </div>
        );
      case 'zoom':
        return (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Sesión en vivo</h3>
            <p className="mb-4">
              Fecha: {new Date(currentLesson.content.dateTime).toLocaleString()}
            </p>
            <a
              href={currentLesson.content.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Users className="w-5 h-5 mr-2" />
              Unirse a la sesión
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Contenido del curso</h2>
              <div className="space-y-4">
                {course.modules.map((module, moduleIdx) => (
                  <div key={module.id}>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setCurrentModuleIndex(moduleIdx);
                            setCurrentLessonIndex(lessonIdx);
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                            moduleIdx === currentModuleIndex &&
                            lessonIdx === currentLessonIndex
                              ? 'bg-primary-50 text-primary-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {getLessonIcon(lesson.type)}
                          <span className="ml-2">{lesson.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                <p className="text-gray-600">{currentLesson.description}</p>
              </div>

              {renderContent()}

              {currentLesson.type === 'video' && currentLesson.content.transcript && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Transcripción</h3>
                  <p className="text-gray-600">{currentLesson.content.transcript}</p>
                </div>
              )}

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                  className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Anterior
                </button>
                <span className="text-sm text-gray-500">
                  Lección {currentLessonNumber} de {totalLessons}
                </span>
                <button
                  onClick={handleNext}
                  disabled={
                    currentModuleIndex === course.modules.length - 1 &&
                    currentLessonIndex === currentModule.lessons.length - 1
                  }
                  className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 disabled:opacity-50"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSession;