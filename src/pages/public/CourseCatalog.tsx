import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

import CourseCard from '../../components/courses/CourseCard';
import { decapContentService } from '../../services/courseService';
import type { CourseFM, Nivel, WithSlug } from '../../types/course';

const levels: Nivel[] = ['Básico', 'Intermedio', 'Avanzado'];

export default function CourseCatalog() {
  /* ---------- Estado ---------- */
  const [courses, setCourses] = useState<WithSlug<CourseFM>[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Nivel | ''>('');
  const [selectedCategory, setSelectedCategory] = useState('');

  /* ---------- Cargar cursos ---------- */
  useEffect(() => {
    decapContentService.getCourses().then(setCourses);
  }, []);

  /* ---------- Categorías dinámicas ---------- */
  const categories = useMemo(() => {
    const raw = courses
      .map(c => (c as any).categoria as string | undefined)
      .filter(Boolean);
    return Array.from(new Set(raw));
  }, [courses]);

  /* ---------- Filtrado ---------- */
  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return courses.filter(course => {
      /* Título y descripción seguros */
      const title = (course.title ?? '').toLowerCase();

      // admite 'descripcion' o 'description'
      const rawDesc =
        (course as any).descripcion ?? (course as any).description ?? '';
      const desc = rawDesc.toLowerCase();

      const matchesSearch = title.includes(term) || desc.includes(term);
      const matchesLevel = !selectedLevel || course.nivel === selectedLevel;

      const courseCategory = (course as any).categoria ?? '';
      const matchesCategory =
        !selectedCategory || courseCategory === selectedCategory;

      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [courses, searchTerm, selectedLevel, selectedCategory]);

  /* ---------- UI ---------- */
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Explora Nuestros Cursos</h1>
            <p className="text-xl text-primary-100 mb-8">
              Descubre una amplia gama de cursos diseñados para fortalecer tus
              habilidades en gobierno digital, innovación pública y
              transformación digital
            </p>

            <div className="bg-white/10 p-1 rounded-lg backdrop-blur-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-200" />
                <input
                  type="text"
                  placeholder="¿Qué te gustaría aprender hoy?"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-primary-700 rounded-lg text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtros */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nivel */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value as Nivel | '')}
          >
            <option value="">Todos los niveles</option>
            {levels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          {/* Categoría */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Link key={course.slug} to={`/course/${course.slug}`}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron cursos que coincidan con los criterios de
              búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
