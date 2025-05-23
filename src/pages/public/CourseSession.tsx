import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  Users,
} from 'lucide-react';

import { decapContentService } from '../../services/courseService';
import type { SessionFM, CourseFM, WithSlug } from '../../types/course';

/* ---------- tipos ---------- */
type FullCourse = WithSlug<CourseFM> & { sesiones: WithSlug<SessionFM>[] };
type SectionId = 'bienvenida' | 'teoria' | 'zoom' | 'handout';

export default function CourseSession() {
  /* URL */
  const { slug } = useParams();
  const navigate = useNavigate();

  /* estado global */
  const [course, setCourse] = useState<FullCourse | null>(null);
  const [currentSession, setCurrentSession] = useState(0);
  const [currentSection, setCurrentSection] = useState<SectionId | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const STORAGE_KEY = 'access_course_';

  /* cargar curso + sesiones */
  useEffect(() => {
    if (!slug) return;

    decapContentService.getCourseBySlug(slug).then(c => {
      if (!c) return navigate('/courses');

      const fullCourse = c as unknown as FullCourse;
      setCourse(fullCourse);
      setCurrentSection(firstSection(fullCourse.sesiones[0]));

      // Validar si el curso ya fue autorizado antes
      const storedAccess = localStorage.getItem(STORAGE_KEY + fullCourse.slug);
      if (storedAccess === 'true') {
        setIsAuthorized(true);
      }
    }).finally(() => setLoading(false));
  }, [slug]);


  /* helpers ------------------------------------------------------- */
  const session = course?.sesiones[currentSession];

  /** devuelve la primera subsección disponible de una sesión */
  function firstSection(s: SessionFM): SectionId {
    if (s.bienvenida) return 'bienvenida';
    if (s.teoria) return 'teoria';
    if (s.video_zoom) return 'zoom';
    return 'handout';
  }

  /** subsecciones existentes y su metadata (label + icono) */
  function sectionsOf(s: SessionFM) {
    return [
      s.bienvenida && {
        id: 'bienvenida' as const,
        label: 'Bienvenida',
        icon: <Play className="w-5 h-5" />,
      },
      s.teoria && {
        id: 'teoria' as const,
        label: 'Teoría',
        icon: <FileText className="w-5 h-5" />,
      },
      s.video_zoom && {
        id: 'zoom' as const,
        label: 'Zoom / Grabación',
        icon: <Users className="w-5 h-5" />,
      },
      s.handout && {
        id: 'handout' as const,
        label: 'Handout',
        icon: <FileText className="w-5 h-5" />,
      },
    ].filter(Boolean) as { id: SectionId; label: string; icon: JSX.Element }[];
  }

  /** ids de subsecciones en orden */
  function sectionArray(s: SessionFM) {
    return sectionsOf(s).map(sc => sc.id); // ej. ['bienvenida','teoria',...]
  }

  /** avanzar → subsección … o siguiente sesión */
  function nextPosition() {
    const sec = session ? sectionArray(session) : [];
    const idx = sec.indexOf(currentSection!);

    // dentro de la sesión
    if (idx < sec.length - 1) {
      setCurrentSection(sec[idx + 1]);
      return;
    }
    // saltar a siguiente sesión
    if (currentSession < course!.sesiones.length - 1) {
      const newSes = currentSession + 1;
      setCurrentSession(newSes);
      setCurrentSection(firstSection(course!.sesiones[newSes]));
    }
  }

  /** retroceder ← subsección … o sesión previa */
  function prevPosition() {
    const sec = session ? sectionArray(session) : [];
    const idx = sec.indexOf(currentSection!);

    // dentro de la sesión
    if (idx > 0) {
      setCurrentSection(sec[idx - 1]);
      return;
    }
    // saltar a sesión previa
    if (currentSession > 0) {
      const newSes = currentSession - 1;
      setCurrentSession(newSes);
      const prevSec = sectionArray(course!.sesiones[newSes]);
      setCurrentSection(prevSec[prevSec.length - 1]); // última subsección
    }
  }

  /* ---------- render ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!course || !session || !currentSection) return null;

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* 🔒 Modal de contraseña bloqueante */}
      {!isAuthorized && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-center">Ingresa la contraseña del curso</h2>
            <input
              type="password"
              placeholder="Contraseña"
              value={inputPassword}
              onChange={e => setInputPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring focus:border-primary-300"
            />
            <button
              onClick={() => {
                if (inputPassword === course?.password) { // course?.password
                  setIsAuthorized(true);
                  localStorage.setItem(STORAGE_KEY + course.slug, 'true'); // persistir acceso
                } else {
                  alert('Contraseña incorrecta');
                }
              }}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 mb-2"
            >
              Ingresar
            </button>
            <button
              onClick={() => navigate(`/course/${slug}`)}
              className="w-full text-sm text-gray-600 hover:text-primary-600 text-center"
            >
              ← Volver al curso
            </button>
          </div>
        </div>
      )}

      {/* Contenido del curso (solo visible si está autorizado) */}
      {isAuthorized && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* -------- Sidebar -------- */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Contenido del curso</h2>

                <div className="space-y-4">
                  {course.sesiones.map((s, idx) => (
                    <div key={s.slug}>
                      <button
                        onClick={() => {
                          setCurrentSession(idx);
                          setCurrentSection(firstSection(s));
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                          idx === currentSession
                            ? 'bg-primary-50 text-primary-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {s.title}
                      </button>

                      {idx === currentSession && (
                        <div className="mt-2 ml-6 space-y-1">
                          {sectionsOf(s).map(sc => (
                            <button
                              key={sc.id}
                              onClick={() => setCurrentSection(sc.id)}
                              className={`w-full text-left px-4 py-2 rounded-lg flex items-center text-sm ${
                                sc.id === currentSection
                                  ? 'bg-primary-50 text-primary-600'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {sc.icon}
                              <span className="ml-2">{sc.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* -------- Contenido principal -------- */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  onClick={() => navigate(`/course/${slug}`)}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Volver al curso
                </button>
                <h1 className="text-2xl font-bold mb-6">{session.title}</h1>

                {currentSection === 'bienvenida' && session.bienvenida && (
                  <div className="aspect-video bg-gray-900 rounded-lg mb-6">
                    <iframe
                      src={session.bienvenida}
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                )}

                {currentSection === 'teoria' && session.teoria && (
                  <article
                    className="prose max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: session.teoria }}
                  />
                )}

                {currentSection === 'zoom' && session.video_zoom && (
                  <div className="aspect-video bg-gray-900 rounded-lg mb-6">
                    <iframe
                      src={session.video_zoom}
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                )}

                {currentSection === 'handout' && session.handout && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <a
                      href={session.handout}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Descargar PDF
                    </a>
                  </div>
                )}

                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <button
                    onClick={prevPosition}
                    disabled={
                      currentSession === 0 &&
                      currentSection === sectionArray(session)[0]
                    }
                    className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Anterior
                  </button>

                  <span className="text-sm text-gray-500">
                    Sesión {currentSession + 1} de {course.sesiones.length}
                  </span>

                  <button
                    onClick={nextPosition}
                    disabled={
                      currentSession === course.sesiones.length - 1 &&
                      currentSection ===
                        sectionArray(session)[sectionArray(session).length - 1]
                    }
                    className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 disabled:opacity-50"
                  >
                    Siguiente
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
