import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Award, Globe, BookOpen, TrendingUp, BarChart3, Info, Clock } from 'lucide-react';
import Seo from '../../components/Seo';
import { SEO } from '../../config/seo';
import { GUATEMALA_DEPARTMENTS } from '../../types/participants';
import {
  getImpactMetrics,
  getDepartmentBreakdown,
  getGenderBreakdown,
  getAgeBreakdown,
  getSurveyResults,
  type ImpactMetrics,
  type DepartmentBreakdown,
  type GenderBreakdown,
  type AgeBreakdown,
  type SurveyResult,
} from '../../services/impactService';

type LoadState = 'loading' | 'error' | 'success';

const GENDER_LABELS: Record<string, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  otro: 'Otro',
  prefiero_no_decir: 'Prefiero no decir',
};

export default function ImpactoPage() {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [departments, setDepartments] = useState<DepartmentBreakdown[]>([]);
  const [genders, setGenders] = useState<GenderBreakdown[]>([]);
  const [ages, setAges] = useState<AgeBreakdown[]>([]);
  const [surveys, setSurveys] = useState<SurveyResult[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    async function load() {
      try {
        const [m, d, g, a, s] = await Promise.all([
          getImpactMetrics(),
          getDepartmentBreakdown(),
          getGenderBreakdown(),
          getAgeBreakdown(),
          getSurveyResults(),
        ]);
        setMetrics(m);
        setDepartments(d);
        setGenders(g);
        setAges(a);
        setSurveys(s);
        setLoadState('success');
      } catch (err) {
        console.error('[ImpactoPage] Error loading data:', err);
        setLoadState('error');
      }
    }
    load();
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const indicators = metrics ? [
    { label: 'Personas registradas', value: metrics.total_registered, icon: <Users className="w-6 h-6" /> },
    { label: 'Personas formadas', value: metrics.total_trained, icon: <GraduationCap className="w-6 h-6" /> },
    { label: 'Certificados emitidos', value: metrics.certificates_issued, icon: <Award className="w-6 h-6" /> },
    { label: 'Cursos activos', value: metrics.active_courses, icon: <BookOpen className="w-6 h-6" /> },
  ] : [];

  return (
    <div>
      <Seo {...SEO['/impacto']} canonical="/impacto" />
      
      {/* Hero */}
      <div className="from-primary-900 to-primary-800 text-white" style={{ backgroundImage: 'linear-gradient(135deg, rgba(15,76,68,0.95), rgba(20,100,88,0.9))' }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Nuestro Impacto</h1>
            <p className="text-xl text-primary-100">
              Medimos resultados, no solo alcance. Estos son los datos verificables de nuestra plataforma.
            </p>
          </div>
        </div>
      </div>

      {loadState === 'loading' && (
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg" />
                <div className="h-8 w-20 bg-gray-200 rounded mx-auto mb-2" />
                <div className="h-4 w-28 bg-gray-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      )}

      {loadState === 'error' && (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 text-lg mb-2">No pudimos cargar los datos de impacto.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            Reintentar
          </button>
        </div>
      )}

      {loadState === 'success' && metrics && (
        <>
          {/* Indicators */}
          <div className="py-10 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {indicators.map((ind, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center">
                      {ind.icon}
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{ind.value.toLocaleString('es-GT')}</p>
                    <p className="text-sm text-gray-500">{ind.label}</p>
                  </div>
                ))}
              </div>

              {/* Tasa de finalización */}
              <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Tasa de finalización</h3>
                </div>
                <div className="flex items-end gap-4">
                  <p className="text-4xl font-bold text-primary-600">{metrics.completion_rate}%</p>
                  <p className="text-sm text-gray-500 pb-1">
                    {metrics.total_completed} completados de {metrics.total_enrollments} inscripciones
                  </p>
                </div>
                <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${metrics.completion_rate}%` }} />
                </div>
              </div>

              {/* Data updated + methodology link */}
              <div className="text-center mt-6 space-y-1">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Datos actualizados al {formatDate(metrics.last_updated)}
                </p>
                <Link to="/impacto#metodologia" className="text-sm text-primary-600 hover:text-primary-700 underline">
                  ¿Cómo medimos?
                </Link>
              </div>
            </div>
          </div>

          {/* Department breakdown */}
          <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Territorios alcanzados</h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Departamentos de Guatemala con personas formadas. Solo mostramos territorios con 10 o más personas para proteger la privacidad.
              </p>

              {departments.filter(d => d.trained >= 10).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                  {departments.filter(d => d.trained >= 10).map(d => (
                    <div key={d.department} className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                      <Globe className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                      <p className="font-semibold text-gray-900 text-sm">{d.department}</p>
                      <p className="text-2xl font-bold text-primary-600">{d.trained}</p>
                      <p className="text-xs text-gray-500">personas formadas</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Datos en construcción</p>
                  <p className="text-gray-400 text-sm mt-1">Aún no hay suficientes datos por territorio.</p>
                </div>
              )}
            </div>
          </div>

          {/* Gender & Age breakdown */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Gender */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Distribución por género</h3>
                  {genders.length > 0 ? (
                    <div className="space-y-3">
                      {genders.map(g => {
                        const total = genders.reduce((s, x) => s + x.count, 0);
                        const pct = total > 0 ? (g.count / total) * 100 : 0;
                        return (
                          <div key={g.gender}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{GENDER_LABELS[g.gender] ?? g.gender}</span>
                              <span className="text-gray-500">{g.count}</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">Datos en construcción</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Distribución por edad</h3>
                  {ages.length > 0 ? (
                    <div className="space-y-3">
                      {ages.map(a => {
                        const total = ages.reduce((s, x) => s + x.count, 0);
                        const pct = total > 0 ? (a.count / total) * 100 : 0;
                        return (
                          <div key={a.age_range}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{a.age_range}</span>
                              <span className="text-gray-500">{a.count}</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">Datos en construcción</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Survey results */}
          <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Resultados de encuestas</h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Lo que nos dicen las personas después de completar los cursos.
              </p>

              {surveys.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {surveys.map(s => (
                    <div key={s.survey_type} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-5 h-5 text-primary-600" />
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {s.survey_type === 'entry' ? 'Entrada' : s.survey_type === 'exit' ? 'Salida' : s.survey_type === 'followup_3m' ? 'Seguimiento 3 meses' : 'Seguimiento 6 meses'}
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Respuestas</span><span className="font-medium">{s.total}</span></div>
                        {s.avg_satisfaction !== null && (
                          <div className="flex justify-between"><span className="text-gray-500">Satisfacción promedio</span><span className="font-medium">{s.avg_satisfaction.toFixed(1)}/5</span></div>
                        )}
                        {s.avg_learning !== null && (
                          <div className="flex justify-between"><span className="text-gray-500">Aprendizaje promedio</span><span className="font-medium">{s.avg_learning.toFixed(1)}/5</span></div>
                        )}
                        {s.applied_intention !== null && (
                          <div className="flex justify-between"><span className="text-gray-500">Intención de aplicar</span><span className="font-medium">{s.applied_intention.toFixed(1)}/5</span></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Datos en construcción</p>
                  <p className="text-gray-400 text-sm mt-1">Los resultados de encuestas aparecerán aquí cuando tengamos suficientes respuestas.</p>
                </div>
              )}
            </div>
          </div>

          {/* Methodology */}
          <div id="metodologia" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Metodología</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Creemos en la transparencia. Estos son los criterios que usamos para cada métrica:
                </p>
                <div className="space-y-4">
                  {[
                    { term: 'Persona registrada', def: 'Creó una cuenta en la plataforma.' },
                    { term: 'Persona formada', def: 'Completó al menos un curso o módulo completo.' },
                    { term: 'Tasa de finalización', def: 'Personas que completan un curso dividido entre personas que lo inician.' },
                    { term: 'Certificado emitido', def: 'Certificado verificable generado automáticamente al completar un curso.' },
                    { term: 'Territorio alcanzado', def: 'Departamento de Guatemala con al menos 10 personas formadas.' },
                  ].map(item => (
                    <div key={item.term} className="flex gap-4">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2" />
                      <div>
                        <p className="font-semibold text-gray-900">{item.term}</p>
                        <p className="text-gray-600 text-sm">{item.def}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-800">
                    Para proteger la privacidad, ocultamos cualquier desagregación (género, edad, territorio) con menos de 10 personas. Nunca publicamos cifras inventadas: si no hay suficientes datos, mostramos "Datos en construcción".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
