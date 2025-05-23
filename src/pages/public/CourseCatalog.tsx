import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, RotateCcw  } from 'lucide-react';

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
  const [selectedEstado, setSelectedEstado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

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

  const estados = useMemo(() => {
    const raw = courses
      .map(c => (c as any).estado as string | undefined)
      .filter(Boolean);
    return Array.from(new Set(raw));
  }, [courses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedCategory, selectedEstado]);

  const estadoOrden = {
    finalizado: 1,
    'en proceso': 2,
    'por iniciar': 3,
  };

  const ordenarCursos = (a: WithSlug<CourseFM>, b: WithSlug<CourseFM>) => {
    const estadoA = ((a as any).estado ?? '').trim().toLowerCase();
    const estadoB = ((b as any).estado ?? '').trim().toLowerCase();

    return ((estadoOrden as Record<string, number>)[estadoA] ?? 99) -
          ((estadoOrden as Record<string, number>)[estadoB] ?? 99);
  };
  
  /* ---------- Filtrado ---------- */
  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return courses
    .filter(course => {
      const title = (course.title ?? '').toLowerCase();
      const rawDesc = (course as any).descripcion ?? (course as any).description ?? '';
      const desc = rawDesc.toLowerCase();
      const matchesSearch = title.includes(term) || desc.includes(term);
      const matchesLevel = !selectedLevel || course.nivel === selectedLevel;
      const courseCategory = (course as any).categoria ?? '';
      const matchesCategory = !selectedCategory || courseCategory === selectedCategory;
      const courseEstado = (course as any).estado ?? '';
      const matchesEstado = !selectedEstado || courseEstado === selectedEstado;
      
      return matchesSearch && matchesLevel && matchesCategory && matchesEstado;
    })
    .sort(ordenarCursos);
  }, [courses, searchTerm, selectedLevel, selectedCategory, selectedEstado]);
  
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  }, [filteredCourses, currentPage]);
    
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
        <div className="mb-8 flex flex-wrap md:flex-nowrap gap-y-2 gap-x-4">
          {/* Nivel */}
          <select
            className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

          {/* Estado */}
          <select
            className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedEstado}
            onChange={e => setSelectedEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>

          {/* Botón Reset */}
          <button
            onClick={() => {
              setSelectedLevel('');
              setSelectedCategory('');
              setSelectedEstado('');
              setSearchTerm('');
              setCurrentPage(1);
            }}
            className="w-full md:w-[10%] flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
            title="Restablecer filtros"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map(course => (
            <Link key={course.slug} to={`/course/${course.slug}`}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center items-center space-x-2">
          {/* Flecha izquierda */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 border rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-primary-600 border-primary-300 hover:bg-primary-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded ${
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-primary-600 border-primary-300 hover:bg-primary-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Flecha derecha */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 border rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-primary-600 border-primary-300 hover:bg-primary-50'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
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
