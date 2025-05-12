import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { powerBiCourse } from '../../data/courses/power-bi';

const CourseInvitePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenCoursePopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenCoursePopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <img
            src={powerBiCourse.thumbnail}
            alt={powerBiCourse.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¡Nuevo Curso Disponible!
          </h3>
          
          <p className="text-gray-600 mb-4">
            {powerBiCourse.description}
          </p>

          <div className="flex items-center space-x-4 mb-4">
            <img
              src={powerBiCourse.instructor.photoUrl}
              alt={powerBiCourse.instructor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">{powerBiCourse.instructor.name}</p>
              <p className="text-sm text-gray-500">{powerBiCourse.instructor.title}</p>
            </div>
          </div>

          <Link
            to="/register"
            onClick={handleClose}
            className="block w-full text-center bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Regístrate Ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseInvitePopup;