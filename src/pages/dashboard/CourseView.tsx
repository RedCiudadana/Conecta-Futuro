import React from 'react';
import { useParams } from 'react-router-dom';
import { dataProtectionCourse } from '../../data/courses/data-protection';
import { powerBiCourse } from '../../data/courses/power-bi';
import { Calendar, Clock, Video, FileText, Users, Award } from 'lucide-react';

const courses = {
  'data-protection-2024': dataProtectionCourse,
  'power-bi-2024': powerBiCourse
};

const CourseView = () => {
  const { courseId } = useParams();
  const course = courseId ? courses[courseId as keyof typeof courses] : null;

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Curso no encontrado</h1>
      </div>
    );
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-primary-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-primary-600" />;
      case 'zoom':
        return <Users className="w-5 h-5 text-primary-600" />;
      case 'quiz':
        return <Award className="w-5 h-5 text-primary-600" />;
      default:
        return <FileText className="w-5 h-5 text-primary-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date(date));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{course.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Award className="w-5 h-5 mr-2" />
            <span>{course.level}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center">
            <img
              src={course.instructor.photoUrl}
              alt={course.instructor.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{course.instructor.name}</h3>
              <p className="text-gray-600">{course.instructor.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="space-y-6">
        {course.modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{module.title}</h2>
            <p className="text-gray-600 mb-4">{module.description}</p>
            
            <div className="space-y-4">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="mr-4">
                      {getLessonIcon(lesson.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2">{lesson.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="mr-4">{lesson.duration}</span>
                        
                        {lesson.type === 'zoom' && lesson.content.dateTime && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(lesson.content.dateTime)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseView;