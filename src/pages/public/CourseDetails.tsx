import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataProtectionCourse } from '../../data/courses/data-protection';
import { powerBiCourse } from '../../data/courses/power-bi';
import { excelCourse } from '../../data/courses/excel';
import { dataExchangeCourse } from '../../data/courses/data-exchange';
import { Calendar, Clock, Video, FileText, Users, Award, BookOpen, ChevronRight, Medal, Share2, UserPlus } from 'lucide-react';
import CourseCard from '../../components/courses/CourseCard';

const courses = {
  'data-protection-2024': dataProtectionCourse,
  'power-bi-2024': powerBiCourse,
  'excel-gestion-publica-2024': excelCourse,
  'data-exchange-2024': dataExchangeCourse
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const course = courseId ? courses[courseId as keyof typeof courses] : null;

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Curso no encontrado</h1>
        <p className="mt-4 text-gray-600">El curso que buscas no existe o ha sido movido.</p>
        <Link 
          to="/courses" 
          className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ChevronRight className="w-5 h-5 mr-1" />
          Ver todos los cursos
        </Link>
      </div>
    );
  }

  const relatedCourses = Object.values(courses).filter(c => 
    c.id !== course.id && (c.category === course.category || c.level === course.level)
  );

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>{course.modules.length} módulos</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="w-5 h-5 mr-2" />
                <span>{course.level}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to={`/course/${course.id}/session`}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Comenzar curso
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Registrarse
              </Link>
            </div>
          </div>

          <div>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Instructor */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Instructor</h2>
        <div className="flex items-start space-x-4">
          <img
            src={course.instructor.photoUrl}
            alt={course.instructor.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
            <p className="text-gray-600 mb-2">{course.instructor.title}</p>
            <p className="text-gray-600">{course.instructor.bio}</p>
          </div>
        </div>
      </div>

      {/* Digital Certificate Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Medal className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3">¡Comparte tus logros con un certificado!</h2>
            <p className="text-gray-600 mb-4">
              Cuando termines el curso tendrás acceso al certificado digital para compartirlo con tu familia, amigos, empleadores y la comunidad.
            </p>
            <div className="flex items-center space-x-2 text-primary-600">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Comparte tu éxito en redes sociales</span>
            </div>
          </div>
          <div className="flex-shrink-0 hidden md:block">
            <img
              src="https://images.pexels.com/photos/5905555/pexels-photo-5905555.jpeg"
              alt="Certificado Digital"
              className="w-48 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Contenido del Curso</h2>
        <div className="space-y-6">
          {course.modules.map((module) => (
            <div key={module.id} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              
              <div className="space-y-4">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="mr-4">
                        {getLessonIcon(lesson.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium mb-2">{lesson.title}</h4>
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

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">Cursos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCourses.map((relatedCourse) => (
              <Link key={relatedCourse.id} to={`/course/${relatedCourse.id}`}>
                <CourseCard course={relatedCourse} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;