import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Smartphone, Store, Landmark, ArrowRight, ArrowLeft, Clock,
  Target, Users, BookOpen, Award, CheckCircle, Wrench,
  ChevronRight, Loader2, Zap, GraduationCap, BarChart3,
} from 'lucide-react';
import Seo from '../../components/Seo';
import { getLearningPathBySlug } from '../../services/learningPathService';
import { decapContentService } from '../../services/courseService';
import type { LearningPathWithCourses } from '../../types/learningPath';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Smartphone, Store, Landmark,
};

const COLOR_MAP: Record<string, { accent: string; accentBg: string; hero: string; badge: string; step: string; stepActive: string }> = {
  'primeros-pasos-digitales': {
    accent: 'text-teal-600',
    accentBg: 'bg-teal-600',
    hero: 'from-teal-900 via-teal-800 to-cyan-900',
    badge: 'bg-teal-100 text-teal-700',
    step: 'border-teal-200 bg-teal-50',
    stepActive: 'bg-teal-600',
  },
  'digitaliza-tu-pyme': {
    accent: 'text-amber-600',
    accentBg: 'bg-amber-600',
    hero: 'from-amber-900 via-amber-800 to-orange-900',
    badge: 'bg-amber-100 text-amber-700',
    step: 'border-amber-200 bg-amber-50',
    stepActive: 'bg-amber-600',
  },
  'conecta-gobierno': {
    accent: 'text-sky-600',
    accentBg: 'bg-sky-600',
    hero: 'from-sky-900 via-sky-800 to-blue-900',
    badge: 'bg-sky-100 text-sky-700',
    step: 'border-sky-200 bg-sky-50',
    stepActive: 'bg-sky-600',
  },
};

const DEFAULT_COLOR = {
  accent: 'text-gray-600',
  accentBg: 'bg-gray-700',
  hero: 'from-gray-900 via-gray-800 to-slate-900',
  badge: 'bg-gray-100 text-gray-700',
  step: 'border-gray-200 bg-gray-50',
  stepActive: 'bg-gray-600',
};

interface CourseInfo {
  slug: string;
  title: string;
  nivel?: string;
  duracion?: string;
  estado?: string;
  categoria?: string;
  image?: string;
}

const JOURNEY_STEPS = [
  { label: 'Diagnóstico', icon: BarChart3, desc: 'Evalúa tu punto de partida' },
  { label: 'Objetivo', icon: Target, desc: 'Define a dónde quieres llegar' },
  { label: 'Aprendizaje', icon: BookOpen, desc: 'Adquiere conocimientos clave' },
  { label: 'Práctica', icon: Zap, desc: 'Aplica lo que aprendes' },
  { label: 'Implementación', icon: Wrench, desc: 'Llévalo a la realidad' },
  { label: 'Evaluación', icon: CheckCircle, desc: 'Demuestra tu avance' },
  { label: 'Certificación', icon: Award, desc: 'Obtén tu reconocimiento' },
  { label: 'Siguiente nivel', icon: GraduationCap, desc: 'Sigue creciendo' },
];

const RutaDetalle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [path, setPath] = useState<LearningPathWithCourses | null>(null);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      try {
        const p = await getLearningPathBySlug(slug!);
        if (!p) { setNotFound(true); return; }
        setPath(p);

        const cmsCourses = await decapContentService.getCourses();
        const mapped: CourseInfo[] = p.courses.map(pc => {
          const cms = cmsCourses.find(c => c.slug === pc.course_slug);
          return {
            slug: pc.course_slug,
            title: cms?.title || pc.course_slug.replace(/-/g, ' '),
            nivel: cms?.nivel,
            duracion: cms?.duracion,
            estado: cms?.estado,
            categoria: cms?.categoria,
            image: cms?.thumbnail,
          };
        });
        setCourses(mapped);
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (notFound || !path) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ruta no encontrada</h1>
          <p className="text-gray-500 mb-6">Esta ruta de aprendizaje no existe o no está disponible.</p>
          <Link to="/rutas" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium">
            <ArrowLeft className="h-4 w-4" /> Ver todas las rutas
          </Link>
        </div>
      </div>
    );
  }

  const colors = COLOR_MAP[path.slug] || DEFAULT_COLOR;
  const IconComp = ICON_MAP[path.icon || ''] || BookOpen;

  return (
    <>
      <Seo
        title={`${path.name} - Rutas de Aprendizaje`}
        description={path.short_description || path.objective || ''}
      />

      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${colors.hero} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Link
            to="/rutas"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las rutas
          </Link>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <IconComp className="h-6 w-6" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {path.initial_level && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                      {path.initial_level} → {path.final_level}
                    </span>
                  )}
                  {path.estimated_duration && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {path.estimated_duration}
                    </span>
                  )}
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{path.name}</h1>
              <p className="text-lg text-white/80 leading-relaxed mb-6">{path.short_description}</p>

              {path.cta_url && (
                <Link
                  to={path.cta_url}
                  className={`inline-flex items-center px-6 py-3.5 bg-white text-gray-900 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all`}
                >
                  {path.cta_text || 'Comenzar'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>

            {/* Quick stats */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-5">
                <div>
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">Objetivo</p>
                  <p className="text-sm text-white/90">{path.objective}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">Dirigido a</p>
                  <p className="text-sm text-white/90">{path.target_audience}</p>
                </div>
                {path.certificate_type && (
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <Award className="h-4 w-4 text-white/60" />
                    <p className="text-sm text-white/80">{path.certificate_type}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <BookOpen className="h-4 w-4 text-white/60" />
                  <p className="text-sm text-white/80">{courses.length} curso{courses.length !== 1 && 's'} incluido{courses.length !== 1 && 's'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Map */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-10">Tu recorrido</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step.label} className="text-center group">
                <div className={`h-12 w-12 rounded-xl mx-auto mb-2 flex items-center justify-center ${colors.step} border transition-colors`}>
                  <step.icon className={`h-5 w-5 ${colors.accent}`} />
                </div>
                <p className="text-xs font-semibold text-gray-900">{step.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Long description */}
      {path.long_description && (
        <section className="bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Acerca de esta ruta</h2>
            <p className="text-gray-600 leading-relaxed">{path.long_description}</p>
          </div>
        </section>
      )}

      {/* Competencies + Tools */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Competencies */}
            {path.competencies.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className={`h-5 w-5 ${colors.accent}`} />
                  Competencias
                </h3>
                <ul className="space-y-2.5">
                  {path.competencies.map(c => (
                    <li key={c} className="flex items-start gap-2.5">
                      <CheckCircle className={`h-4 w-4 ${colors.accent} mt-0.5 flex-shrink-0`} />
                      <span className="text-sm text-gray-600">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical activities */}
            {path.practical_activities.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className={`h-5 w-5 ${colors.accent}`} />
                  Actividades prácticas
                </h3>
                <ul className="space-y-2.5">
                  {path.practical_activities.map(a => (
                    <li key={a} className="flex items-start gap-2.5">
                      <ChevronRight className={`h-4 w-4 ${colors.accent} mt-0.5 flex-shrink-0`} />
                      <span className="text-sm text-gray-600">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tools */}
            {path.associated_tools.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className={`h-5 w-5 ${colors.accent}`} />
                  Herramientas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {path.associated_tools.map(t => (
                    <span key={t} className={`text-xs font-medium px-3 py-1.5 rounded-lg ${colors.badge}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Courses in this path */}
      {courses.length > 0 && (
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Cursos de esta ruta
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Completa los cursos en orden para obtener el mayor beneficio de tu recorrido.
            </p>

            <div className="space-y-3">
              {courses.map((course, i) => {
                const statusColor =
                  course.estado === 'En proceso' ? 'bg-emerald-100 text-emerald-700' :
                  course.estado === 'Por iniciar' ? 'bg-sky-100 text-sky-700' :
                  course.estado === 'Finalizado' ? 'bg-gray-100 text-gray-600' :
                  'bg-gray-100 text-gray-500';

                return (
                  <Link
                    key={course.slug}
                    to={`/course/${course.slug}`}
                    className="block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all p-5 group"
                  >
                    <div className="flex items-center gap-5">
                      {/* Number */}
                      <div className={`h-10 w-10 rounded-xl ${colors.step} border flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-sm font-bold ${colors.accent}`}>{i + 1}</span>
                      </div>

                      {/* Thumbnail */}
                      {course.image && (
                        <img
                          src={course.image}
                          alt=""
                          className="h-14 w-20 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                        />
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-sky-700 transition-colors truncate">
                          {course.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          {course.nivel && (
                            <span className="text-xs text-gray-400">{course.nivel}</span>
                          )}
                          {course.duracion && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {course.duracion}
                            </span>
                          )}
                          {course.estado && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
                              {course.estado}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-sky-600 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Result + CTA */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Award className={`h-12 w-12 ${colors.accent} mx-auto mb-4`} />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Al completar esta ruta</h2>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto">
            {path.result_description}
          </p>
          {path.cta_url ? (
            <Link
              to={path.cta_url}
              className={`inline-flex items-center px-8 py-4 ${colors.accentBg} text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all`}
            >
              {path.cta_text || 'Comenzar'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          ) : (
            <Link
              to="/rutas"
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Ver todas las rutas
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default RutaDetalle;
