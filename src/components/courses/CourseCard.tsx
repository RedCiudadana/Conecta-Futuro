import React from 'react';
import { Clock, BookOpen, Award } from 'lucide-react';
import { Course } from '../../types/course';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
      <img 
        src={course.thumbnail} 
        alt={course.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
            {course.level}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
            {course.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {course.modules.length} módulos
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={course.instructor.photoUrl}
            alt={course.instructor.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{course.instructor.name}</p>
            <p className="text-xs text-gray-500">{course.instructor.title}</p>
          </div>
        </div>
        
        <button className="w-full text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200">
          Ver Curso
        </button>
      </div>
    </div>
  );
};

export default CourseCard;