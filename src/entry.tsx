import { ViteReactSSG } from 'vite-react-ssg';
import React from 'react';
import { Outlet } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/scrolltotop';
import ScrollTopButton from './components/scrolltotopButton';
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import { decapContentService } from './services/courseService';
import { comunidadContentService } from './services/comunidadService';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ParticipantListPage from './pages/admin/ParticipantListPage';
import ParticipantFormPage from './pages/admin/ParticipantFormPage';
import ParticipantProfilePage from './pages/admin/ParticipantProfilePage';
import EnrollmentPage from './pages/admin/EnrollmentPage';
import AttendancePage from './pages/admin/AttendancePage';
import CourseManagementPage from './pages/admin/CourseManagementPage';
import DatabaseManagementPage from './pages/admin/DatabaseManagementPage';
import SkillsManagementPage from './pages/admin/SkillsManagementPage';
import BadgesManagementPage from './pages/admin/BadgesManagementPage';

// Public pages
import LandingPage from './pages/public/LandingPage';
import CourseCatalog from './pages/public/CourseCatalog';
import CourseDetails from './pages/public/CourseDetails';
import CourseSession from './pages/public/CourseSession';
import CourseSessions from './pages/public/CourseSessions';
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
import RutasAprendizaje from './pages/public/RutasAprendizaje';
import RutaDetalle from './pages/public/RutaDetalle';
import CourseRegistration from './pages/public/CourseRegistration';
import AttendanceForm from './pages/public/AttendanceForm';
import DigitalPassport from './pages/public/DigitalPassport';

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
      { path: 'asistencia/:token', element: <AttendanceForm /> },
      { path: 'learning-paths', element: <RutasAprendizaje /> },
      { path: 'rutas', element: <RutasAprendizaje /> },
      { path: 'rutas/:slug', element: <RutaDetalle /> },
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
        path: 'course/:slug/registro',
        element: <CourseRegistration />,
        getStaticPaths: async () => {
          const courses = await decapContentService.getCourses();
          return courses.map(c => `/course/${c.slug}/registro`);
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
      { path: 'mi-pasaporte', element: <DigitalPassport /> },
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
  {
    path: '/dashboard',
    element: (
      <AuthProvider>
        <AdminLayout />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'participantes', element: <ParticipantListPage /> },
      { path: 'participantes/nuevo', element: <ParticipantFormPage /> },
      { path: 'participantes/:id', element: <ParticipantProfilePage /> },
      { path: 'participantes/:id/editar', element: <ParticipantFormPage /> },
      { path: 'inscripciones', element: <EnrollmentPage /> },
      { path: 'asistencia', element: <AttendancePage /> },
      { path: 'cursos', element: <CourseManagementPage /> },
      { path: 'habilidades', element: <SkillsManagementPage /> },
      { path: 'insignias', element: <BadgesManagementPage /> },
      { path: 'base-de-datos', element: <DatabaseManagementPage /> },
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
