import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataProtectionCourse } from '../../data/courses/data-protection';
import { powerBiCourse } from '../../data/courses/power-bi';
import { excelCourse } from '../../data/courses/excel';
import { dataExchangeCourse } from '../../data/courses/data-exchange';
import { Clock, BookOpen, Video, FileText, Users, Award, ChevronDown, ChevronUp, Search, Filter, CheckCircle, Rocket } from 'lucide-react';

const courses = [dataProtectionCourse, powerBiCourse, excelCourse, dataExchangeCourse];

const CourseSessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  // Mock progress data - In a real app, this would come from your backend
  const mockProgress = {
    'data-protection-2024': {
      completedLessons: ['les-1-1', 'les-1-2', 'les-2-1'],
      totalProgress: 35
    },
    'power-bi-2024': {
      completedLessons: ['les-1-1'],
      totalProgress: 15
    }
  };

  const toggleModule = (courseId: string, moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [`${courseId}-${moduleId}`]: !prev[`${courseId}-${moduleId}`]
    }));
  };

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

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

  const isLessonCompleted = (courseId: string, lessonId: string) => {
    return mockProgress[courseId as keyof typeof mockProgress]?.completedLessons.includes(lessonId);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const levels = ['Básico', 'Intermedio', 'Avanzado'];
  const categories = [...new Set(courses.map(course => course.category))];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-800 via-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Contenido de los Cursos</h1>
            <p className="text-xl text-primary-100 mb-6">
              Accede a lecciones detalladas, recursos descargables y sesiones en vivo para maximizar tu aprendizaje
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                <Video className="w-5 h-5 text-primary-200 mr-2" />
                <span>Videos HD</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                <FileText className="w-5 h-5 text-primary-200 mr-2" />
                <span>Recursos</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                <Users className="w-5 h-5 text-primary-200 mr-2" />
                <span>Sesiones en vivo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Todos los niveles</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm">
              {/* Course Header */}
              <button
                onClick={() => toggleCourse(course.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.modules.length} módulos
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Progress Circle */}
                  <div className="relative">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        className="text-gray-200"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="20"
                        cx="24"
                        cy="24"
                      />
                      <circle
                        className="text-primary-600"
                        strokeWidth="4"
                        strokeDasharray={`${mockProgress[course.id as keyof typeof mockProgress]?.totalProgress * 1.256}, 126`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="20"
                        cx="24"
                        cy="24"
                      />
                    </svg>
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium">
                      {mockProgress[course.id as keyof typeof mockProgress]?.totalProgress}%
                    </span>
                  </div>
                  {expandedCourses[course.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Course Content */}
              {expandedCourses[course.id] && (
                <div className="border-t">
                  {course.modules.map((module) => (
                    <div key={module.id} className="border-b last:border-b-0">
                      <button
                        onClick={() => toggleModule(course.id, module.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                        {expandedModules[`${course.id}-${module.id}`] ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      {expandedModules[`${course.id}-${module.id}`] && (
                        <div className="bg-gray-50 p-4">
                          <div className="space-y-2">
                            {module.lessons.map((lesson) => (
                              <Link
                                key={lesson.id}
                                to={`/course/${course.id}/session`}
                                className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                              >
                                <div className="flex-shrink-0 mr-3">
                                  {isLessonCompleted(course.id, lesson.id) ? (
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                      {getLessonIcon(lesson.type)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <h4 className="text-gray-900 font-medium">{lesson.title}</h4>
                                  <p className="text-sm text-gray-500">{lesson.duration}</p>
                                </div>
                                {isLessonCompleted(course.id, lesson.id) && (
                                  <span className="text-sm text-green-600 font-medium ml-2">Completado</span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">
                No se encontraron cursos que coincidan con los criterios de búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSessions;