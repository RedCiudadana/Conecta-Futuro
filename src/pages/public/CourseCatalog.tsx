import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/courses/CourseCard';
import { dataProtectionCourse } from '../../data/courses/data-protection';
import { powerBiCourse } from '../../data/courses/power-bi';
import { excelCourse } from '../../data/courses/excel';
import { dataExchangeCourse } from '../../data/courses/data-exchange';

const courses = [dataProtectionCourse, powerBiCourse, excelCourse, dataExchangeCourse];

const CourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Explora Nuestros Cursos</h1>
            <p className="text-xl text-primary-100 mb-8">
              Descubre una amplia gama de cursos diseñados para fortalecer tus habilidades en gobierno digital, 
              innovación pública y transformación digital
            </p>
            <div className="bg-white/10 p-1 rounded-lg backdrop-blur-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-200" />
                <input
                  type="text"
                  placeholder="¿Qué te gustaría aprender hoy?"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-primary-700 rounded-lg text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">Todos los niveles</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Link key={course.id} to={`/course/${course.id}`}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron cursos que coincidan con los criterios de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;