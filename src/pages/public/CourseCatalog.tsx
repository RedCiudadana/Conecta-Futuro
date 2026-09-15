import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, RotateCcw, AlertCircle, BookOpen, Clock, Award, Gift, Monitor, Wifi, Users } from 'lucide-react';

import CourseCard from '../../components/courses/CourseCard';
import { decapContentService } from '../../services/courseService';
import { getCourses as getDBCourses } from '../../services/participantService';
import type { Course as DBCourse } from '../../types/participants';
import type { CourseFM, Nivel, WithSlug } from '../../types/course';
import Seo from '../../components/Seo';
import { SEO } from '../../config/seo';
import Fondo from '../../assets/slider/fondo.png';

const levels: Nivel[] = ['Básico', 'Intermedio', 'Avanzado'];
const CACHE_KEY = 'course_catalog_cache';
const CACHE_TTL = 5 * 60 * 1000;

type LoadState = 'loading' | 'error' | 'success';

interface CachedCourses {
  data: WithSlug<CourseFM>[];
  timestamp: number;
}

function mapDBStatus(status: string): string {
  switch (status) {
    case 'open': return 'Por iniciar';
    case 'in_progress': return 'En proceso';
    case 'completed': return 'Finalizado';
    case 'cancelled': return 'Cancelado';
    default: return '';
  }
}

function readCache(): WithSlug<CourseFM>[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CachedCourses = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data: WithSlug<CourseFM>[]) {
  try {
    const payload: CachedCourses = { data, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage might be full or unavailable; ignore
  }
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="flex gap-4 pt-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-full bg-gray-200 rounded-md mt-3" />
      </div>
    </div>
  );
}

export default function CourseCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<WithSlug<CourseFM>[]>(() => readCache() ?? []);
  const [loadState, setLoadState] = useState<LoadState>(() => (readCache() ? 'success' : 'loading'));
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '');
  const [selectedLevel, setSelectedLevel] = useState<Nivel | ''>((searchParams.get('nivel') as Nivel) ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') ?? '');
  const [selectedEstado, setSelectedEstado] = useState(searchParams.get('estado') ?? '');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const loadedRef = useRef(false);

  const loadCourses = useCallback(async () => {
    setLoadState('loading');
    try {
      const cmsCourses = await decapContentService.getCourses();
      let dbCourses: DBCourse[] = [];
      try {
        dbCourses = await getDBCourses();
      } catch (dbErr) {
        console.error('[CourseCatalog] Error loading DB courses:', dbErr);
      }

      const dbBySlug = new Map(dbCourses.map(d => [d.slug, d]));

      const merged: WithSlug<CourseFM>[] = cmsCourses.map(cms => {
        const db = dbBySlug.get(cms.slug);
        if (!db) return cms;

        return {
          ...cms,
          nivel: (db.level || cms.nivel) as any,
          categoria: db.category || (cms as any).categoria || '',
          estado: mapDBStatus(db.status) || (cms as any).estado || '',
          duracion: db.duration || cms.duracion || '',
          instructor: db.instructor_name || cms.instructor || '',
          thumbnail: db.thumbnail_url || cms.thumbnail,
          descripcion: db.description || cms.descripcion || '',
          modality: db.modality || (cms as any).modality || '',
          is_free: (db as any).is_free ?? (cms as any).is_free ?? true,
          is_sponsored: (db as any).is_sponsored ?? (cms as any).is_sponsored ?? false,
          has_certificate: (db as any).has_certificate ?? (cms as any).has_certificate ?? true,
        } as any;
      });

      const cmsSlugs = new Set(cmsCourses.map(c => c.slug));
      const dbOnly = dbCourses
        .filter(d => !cmsSlugs.has(d.slug) && d.status !== 'draft' && d.status !== 'cancelled')
        .map(d => ({
          slug: d.slug,
          title: d.title,
          descripcion: d.description || '',
          nivel: (d.level || '') as any,
          duracion: d.duration || '',
          instructor: d.instructor_name || '',
          thumbnail: d.thumbnail_url || undefined,
          categoria: d.category || '',
          estado: mapDBStatus(d.status),
          enlace_contenido: '',
          modality: d.modality || '',
          is_free: true,
          is_sponsored: false,
          has_certificate: true,
        } as any));

      const all = [...merged, ...dbOnly];
      setCourses(all);
      writeCache(all);
      setLoadState('success');
    } catch (err) {
      console.error('[CourseCatalog] Error loading courses:', err);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    if (courses.length === 0) {
      loadCourses();
    }
  }, [courses.length, loadCourses]);

  // Sync filters to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.q = searchTerm;
    if (selectedLevel) params.nivel = selectedLevel;
    if (selectedCategory) params.categoria = selectedCategory;
    if (selectedEstado) params.estado = selectedEstado;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedLevel, selectedCategory, selectedEstado, setSearchParams]);

  const categories = useMemo(() => {
    const raw = courses
      .map(c => (c as any).categoria as string | undefined)
      .filter(Boolean);
    return Array.from(new Set(raw)).sort();
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

  const estadoOrden: Record<string, number> = {
    'en proceso': 1,
    'por iniciar': 2,
    finalizado: 3,
    cancelado: 4,
  };

  const ordenarCursos = (a: WithSlug<CourseFM>, b: WithSlug<CourseFM>) => {
    const estadoA = ((a as any).estado ?? '').trim().toLowerCase();
    const estadoB = ((b as any).estado ?? '').trim().toLowerCase();
    return (estadoOrden[estadoA] ?? 99) - (estadoOrden[estadoB] ?? 99);
  };

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

  const hasActiveFilters = !!(searchTerm || selectedLevel || selectedCategory || selectedEstado);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevel('');
    setSelectedCategory('');
    setSelectedEstado('');
    setCurrentPage(1);
  };

  return (
    <div>
      <Seo {...SEO['/courses']} canonical="/courses" />
      {/* Hero */}
      <div className="from-primary-900 to-primary-800 text-white" style={{ backgroundImage: `url(${Fondo})` }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Explora Nuestros Cursos</h1>
            <p className="text-xl text-primary-100 mb-8">
              Descubre cursos en habilidades digitales, inteligencia artificial, emprendimiento digital, datos abiertos, transformación digital e innovación pública.
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
          <select
            className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value as Nivel | '')}
          >
            <option value="">Todos los niveles</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>

          <select
            className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedEstado}
            onChange={e => setSelectedEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="w-full md:w-[10%] flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
            title="Restablecer filtros"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Estados de carga */}
        {loadState === 'loading' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {loadState === 'error' && (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No pudimos cargar los cursos. Intenta de nuevo.</p>
            <button
              onClick={loadCourses}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        )}

        {loadState === 'success' && (
          <>
            {/* Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCourses.map(course => (
                  <Link key={course.slug} to={`/course/${course.slug}`}>
                    <CourseCard course={course} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">
                  {hasActiveFilters
                    ? 'No hay cursos con estos filtros.'
                    : 'Aún no hay cursos publicados.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
