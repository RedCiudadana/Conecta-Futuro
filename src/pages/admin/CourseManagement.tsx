import React, { useState } from 'react';
import { useCourses } from '../../hooks/useCourses';
import { Plus, Edit, Trash2, Search, Video, FileText, Users } from 'lucide-react';
import { Course, Lesson, Module } from '../../types/course';

const CourseManagement = () => {
  const { courses, loading, error, updateCourse, deleteCourse } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    documentUrl: '',
    meetingUrl: '',
    meetingDateTime: ''
  });

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (course: Course, module?: Module, lesson?: Lesson) => {
    setSelectedCourse(course);
    setSelectedModule(module || null);
    setSelectedLesson(lesson || null);
    
    if (lesson) {
      setEditFormData({
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.type === 'video' ? (lesson.content as any).videoUrl : '',
        documentUrl: lesson.type === 'document' ? (lesson.content as any).documentUrl : '',
        meetingUrl: lesson.type === 'zoom' ? (lesson.content as any).meetingUrl : '',
        meetingDateTime: lesson.type === 'zoom' ? (lesson.content as any).dateTime : ''
      });
    }
    
    setShowEditModal(true);
  };

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedCourse || !selectedModule || !selectedLesson) return;

    const updatedCourse = { ...selectedCourse };
    const moduleIndex = updatedCourse.modules.findIndex(m => m.id === selectedModule.id);
    const lessonIndex = updatedCourse.modules[moduleIndex].lessons.findIndex(l => l.id === selectedLesson.id);

    const updatedLesson = {
      ...selectedLesson,
      title: editFormData.title,
      description: editFormData.description
    };

    // Update content based on lesson type
    if (selectedLesson.type === 'video' && editFormData.videoUrl) {
      updatedLesson.content = {
        ...updatedLesson.content,
        videoUrl: editFormData.videoUrl
      };
    } else if (selectedLesson.type === 'document' && editFormData.documentUrl) {
      updatedLesson.content = {
        ...updatedLesson.content,
        documentUrl: editFormData.documentUrl
      };
    } else if (selectedLesson.type === 'zoom' && editFormData.meetingUrl) {
      updatedLesson.content = {
        ...updatedLesson.content,
        meetingUrl: editFormData.meetingUrl,
        dateTime: new Date(editFormData.meetingDateTime)
      };
    }

    updatedCourse.modules[moduleIndex].lessons[lessonIndex] = updatedLesson;
    updateCourse(selectedCourse.id, updatedCourse);
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      deleteCourse(selectedCourse.id);
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-primary-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-primary-600" />;
      case 'zoom':
        return <Users className="w-5 h-5 text-primary-600" />;
      default:
        return <FileText className="w-5 h-5 text-primary-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Cursos</h1>
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Curso
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
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
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">{course.title}</h2>
                  <p className="text-sm text-gray-500">{course.instructor.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDelete(course)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modules and Lessons */}
            <div className="space-y-4 mt-6">
              {course.modules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{module.title}</h3>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {getLessonIcon(lesson.type)}
                          <span className="ml-2">{lesson.title}</span>
                        </div>
                        <button
                          onClick={() => handleEdit(course, module, lesson)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedLesson && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Editar Lección
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              {selectedLesson.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del Video
                  </label>
                  <input
                    type="text"
                    value={editFormData.videoUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              {selectedLesson.type === 'document' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del Documento
                  </label>
                  <input
                    type="text"
                    value={editFormData.documentUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, documentUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              {selectedLesson.type === 'zoom' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la Reunión
                    </label>
                    <input
                      type="text"
                      value={editFormData.meetingUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, meetingUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha y Hora
                    </label>
                    <input
                      type="datetime-local"
                      value={editFormData.meetingDateTime}
                      onChange={(e) => setEditFormData({ ...editFormData, meetingDateTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-500 mb-6">
              ¿Estás seguro de que deseas eliminar el curso "{selectedCourse?.title}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;