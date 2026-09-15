import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone, Store, Landmark, ArrowRight, Clock, BarChart3,
  Target, Users, BookOpen, Award, ChevronRight, Loader2,
} from 'lucide-react';
import Seo from '../../components/Seo';
import { getLearningPaths } from '../../services/learningPathService';
import type { LearningPath } from '../../types/learningPath';

import learningPathsHero from '../../assets/slider/learningpaths.png';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Smartphone,
  Store,
  Landmark,
};

const GRADIENT_MAP: Record<string, { card: string; icon: string; badge: string; cta: string }> = {
  'primeros-pasos-digitales': {
    card: 'from-teal-50 to-cyan-50 border-teal-200 hover:border-teal-300',
    icon: 'bg-teal-100 text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
    cta: 'bg-teal-600 hover:bg-teal-700',
  },
  'digitaliza-tu-pyme': {
    card: 'from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300',
    icon: 'bg-amber-100 text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    cta: 'bg-amber-600 hover:bg-amber-700',
  },
  'conecta-gobierno': {
    card: 'from-sky-50 to-blue-50 border-sky-200 hover:border-sky-300',
    icon: 'bg-sky-100 text-sky-600',
    badge: 'bg-sky-100 text-sky-700',
    cta: 'bg-sky-600 hover:bg-sky-700',
  },
};

const DEFAULT_STYLE = {
  card: 'from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300',
  icon: 'bg-gray-100 text-gray-600',
  badge: 'bg-gray-100 text-gray-700',
  cta: 'bg-gray-700 hover:bg-gray-800',
};

const RutasAprendizaje: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningPaths()
      .then(setPaths)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo
        title="Rutas de Aprendizaje - Escuela Red Ciudadana"
        description="Recorridos formativos orientados a resultados. Elige tu ruta y transforma tus habilidades digitales paso a paso."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white">
        <div className="absolute inset-0">
          <img src={learningPathsHero} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-sky-300 mb-6">
              <BookOpen className="h-4 w-4" />
              Rutas de Aprendizaje
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              No solo cursos.<br />
              <span className="text-sky-400">Recorridos con propósito.</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Cada ruta te guía desde un diagnóstico hasta la certificación, con objetivos claros, práctica real y resultados que puedes aplicar desde el primer día.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-sky-400" />
                Objetivos claros
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-sky-400" />
                Progreso medible
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-sky-400" />
                Certificación al completar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
            Cada ruta sigue un recorrido estructurado
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-2">
            {[
              'Diagnóstico', 'Objetivo', 'Aprendizaje', 'Práctica',
              'Implementación', 'Evaluación', 'Certificación', 'Siguiente nivel',
            ].map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 && <ChevronRight className="h-4 w-4 text-gray-300 hidden lg:block flex-shrink-0" />}
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                  {step}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Paths Grid */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Elige tu ruta</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Tres recorridos diseñados para diferentes perfiles y necesidades. Cada uno te lleva de donde estás a donde quieres llegar.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {paths.map(path => {
                const style = GRADIENT_MAP[path.slug] || DEFAULT_STYLE;
                const IconComp = ICON_MAP[path.icon || ''] || BookOpen;
                const href = path.cta_url || `/rutas/${path.slug}`;

                return (
                  <div
                    key={path.id}
                    className={`relative bg-gradient-to-br ${style.card} border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg group flex flex-col`}
                  >
                    <div className="p-7 flex-1 flex flex-col">
                      {/* Icon + Level */}
                      <div className="flex items-start justify-between mb-5">
                        <div className={`h-14 w-14 rounded-2xl ${style.icon} flex items-center justify-center`}>
                          <IconComp className="h-7 w-7" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {path.initial_level && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style.badge}`}>
                              {path.initial_level}
                            </span>
                          )}
                          {path.estimated_duration && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {path.estimated_duration}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{path.name}</h3>

                      {/* Audience */}
                      <div className="flex items-start gap-2 mb-4">
                        <Users className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-500">{path.target_audience}</p>
                      </div>

                      {/* Result */}
                      <div className="bg-white/60 rounded-xl p-4 mb-6 flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Resultado
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {path.result_description}
                        </p>
                      </div>

                      {/* Competencies preview */}
                      {path.competencies && path.competencies.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Competencias
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {path.competencies.slice(0, 4).map(c => (
                              <span key={c} className="text-xs px-2 py-1 rounded-md bg-white/80 text-gray-600 border border-gray-200/60">
                                {c}
                              </span>
                            ))}
                            {path.competencies.length > 4 && (
                              <span className="text-xs px-2 py-1 rounded-md bg-white/80 text-gray-400">
                                +{path.competencies.length - 4} más
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <Link
                        to={href}
                        className={`w-full inline-flex items-center justify-center px-6 py-3.5 ${style.cta} text-white rounded-xl font-medium text-sm shadow-sm transition-all duration-200 group-hover:shadow-md`}
                      >
                        {path.cta_text || 'Ver ruta'}
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Explora nuestro catálogo completo de cursos o contáctanos para recibir orientación personalizada.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium text-sm transition-colors shadow-sm"
            >
              Ver todos los cursos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default RutasAprendizaje;
