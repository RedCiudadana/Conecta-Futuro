import { ViteReactSSG } from 'vite-react-ssg';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/scrolltotop';
import ScrollTopButton from './components/scrolltotopButton';
import PublicLayout from './components/layouts/PublicLayout';
import { decapContentService } from './services/courseService';
import { comunidadContentService } from './services/comunidadService';

// Public pages
import LandingPage from './pages/public/LandingPage';
import CourseCatalog from './pages/public/CourseCatalog';
import CourseDetails from './pages/public/CourseDetails';
import CourseSession from './pages/public/CourseSession';
import CourseSessions from './pages/public/CourseSessions';
import LearningPaths from './pages/public/LearningPaths';
import AboutUs from './pages/public/AboutUs';
import Contact from './pages/public/Contact';
import Documentation from './pages/public/Documentation';
import NotFound from './pages/public/NotFound';
import Community from './pages/public/Community';
import CommunityDetails from './pages/public/CommunityDetails';
import PrimerosPasosDigitales from './pages/public/PrimerosPasosDigitales';
import DigitalizaTuPyme from './pages/public/DigitalizaTuPyme';
import DiagnosticoDigital from './pages/public/DiagnosticoDigital';
import ConectaFuturo from './pages/public/ConectaFuturo';
import VerifyCertificate from './pages/public/VerifyCertificate';
import Tutoriales from './pages/public/Tutoriales';
import DirectorioIA from './pages/public/DirectorioIA';
import BancoPrompts from './pages/public/BancoPrompts';

const RootLayout: React.FC = () => (
  <AuthProvider>
    <ScrollToTop />
    <ScrollTopButton />
    <PublicLayout />
  </AuthProvider>
);

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'courses', element: <CourseCatalog /> },
      { path: 'course-sessions', element: <CourseSessions /> },
      { path: 'learning-paths', element: <LearningPaths /> },
      { path: 'primeros-pasos-digitales', element: <PrimerosPasosDigitales /> },
      { path: 'digitaliza-tu-pyme', element: <DigitalizaTuPyme /> },
      { path: 'diagnostico-digital', element: <DiagnosticoDigital /> },
      { path: 'conecta-futuro', element: <ConectaFuturo /> },
      { path: 'verify-certificate', element: <VerifyCertificate /> },
      { path: 'tutoriales', element: <Tutoriales /> },
      { path: 'directorio-ia', element: <DirectorioIA /> },
      { path: 'banco-prompts', element: <BancoPrompts /> },
      {
        path: 'course/:slug',
        element: <CourseDetails />,
        getStaticPaths: async () => {
          const courses = await decapContentService.getCourses();
          return courses.map(c => `/course/${c.slug}`);
        },
        loader: async ({ params }: { params: { slug?: string } }) => {
          const slug = params.slug;
          if (!slug) return { course: null, related: [] };
          const data = await decapContentService.getCourseBySlug(slug);
          const all = await decapContentService.getCourses();
          const related = data
            ? all.filter(
                c =>
                  c.slug !== data.slug &&
                  (c.nivel === data.nivel || (c as any).category === (data as any).category),
              ).slice(0, 3)
            : [];
          return { course: data, related };
        },
      },
      {
        path: 'course/:slug/session',
        element: <CourseSession />,
        getStaticPaths: async () => {
          const courses = await decapContentService.getCourses();
          return courses.map(c => `/course/${c.slug}/session`);
        },
        loader: async ({ params }: { params: { slug?: string } }) => {
          const slug = params.slug;
          if (!slug) return { course: null };
          const data = await decapContentService.getCourseBySlug(slug);
          return { course: data };
        },
      },
      { path: 'about', element: <AboutUs /> },
      { path: 'contact', element: <Contact /> },
      { path: 'documentation', element: <Documentation /> },
      { path: 'community', element: <Community /> },
      {
        path: 'community/:slug',
        element: <CommunityDetails />,
        getStaticPaths: async () => {
          const comunidades = await comunidadContentService.getComunidades();
          return comunidades.map(c => `/community/${c.slug}`);
        },
        loader: async ({ params }: { params: { slug?: string } }) => {
          const slug = params.slug;
          if (!slug) return { noticia: null, otrasNoticias: [] };
          const todas = await comunidadContentService.getComunidades();
          const noticia = todas.find(n => n.slug === slug) ?? null;
          const otrasNoticias = todas.filter(n => n.slug !== slug);
          return { noticia, otrasNoticias };
        },
      },
    ],
  },
  { path: '/*', element: <NotFound /> },
];

export const includedRoutes = async (paths: string[], _routes: Readonly<any[]>) => {
  // Include all static and dynamic-resolved paths
  return paths.filter((p) => !p.includes('*'));
};

export const createRoot = ViteReactSSG(
  { routes },
  undefined,
  {
    useLegacyRender: false,
  }
);
