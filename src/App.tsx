import { Routes, Route } from 'react-router-dom';

// Public pages
import LandingPage from './pages/public/LandingPage';
import CourseCatalog from './pages/public/CourseCatalog';
import CourseDetails from './pages/public/CourseDetails';
import CourseSession from './pages/public/CourseSession';
import CourseSessions from './pages/public/CourseSessions';
import RutasAprendizaje from './pages/public/RutasAprendizaje';
import RutaDetalle from './pages/public/RutaDetalle';
import MobileApi from './pages/public/MobileApi';
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
import ImpactoPage from './pages/public/ImpactoPage';
import ImpactoAdminPage from './pages/admin/ImpactoAdminPage';
import ScrollToTop from './components/scrolltotop';
import ScrollTopButton from './components/scrolltotopButton';

// Layout components
import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AccountRoute from './components/auth/AccountRoute';

// Mi Cuenta layout + pages
import AccountLayout from './components/layouts/AccountLayout';
import AccountDashboard from './pages/account/AccountDashboard';
import MyCourses from './pages/account/MyCourses';
import MyCertificates from './pages/account/MyCertificates';
import MyAttendance from './pages/account/MyAttendance';
import MyProfile from './pages/account/MyProfile';

// Account context provider
import { AccountProvider } from './contexts/AccountContext';

// Auth + Dashboard pages
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Dashboard from './pages/dashboard/Dashboard';
import CourseView from './pages/dashboard/CourseView';
import Profile from './pages/dashboard/Profile';
import Certificates from './pages/dashboard/Certificates';
import CommunityDashboard from './pages/dashboard/Community';

function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollTopButton />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          {/* Nested routes */}
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="course-sessions" element={<CourseSessions />} />
          <Route path="learning-paths" element={<RutasAprendizaje />} />
          <Route path="rutas" element={<RutasAprendizaje />} />
          <Route path="rutas/:slug" element={<RutaDetalle />} />
          <Route path="mobile-api" element={<MobileApi />} />
          <Route path="primeros-pasos-digitales" element={<PrimerosPasosDigitales />} />
          <Route path="digitaliza-tu-pyme" element={<DigitalizaTuPyme />} />
          <Route path="diagnostico-digital" element={<DiagnosticoDigital />} />
          <Route path="conecta-futuro" element={<ConectaFuturo />} />
          <Route path="verify-certificate" element={<VerifyCertificate />} />
          <Route path="tutoriales" element={<Tutoriales />} />
          <Route path="directorio-ia" element={<DirectorioIA />} />
          <Route path="banco-prompts" element={<BancoPrompts />} />
          <Route path="impacto" element={<ImpactoPage />} />
          <Route path="course/:slug" element={<CourseDetails />} />
          <Route path="course/:slug/session" element={<CourseSession />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="community" element={<Community />} />
          <Route path="community/:slug" element={<CommunityDetails />} />
        </Route>

        {/* Protected admin dashboard routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<CourseView />} />
          <Route path="profile" element={<Profile />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="community" element={<CommunityDashboard />} />
          <Route path="impacto" element={<ImpactoAdminPage />} />
        </Route>

        {/* Mi Cuenta — student self-service portal */}
        <Route path="/mi-cuenta" element={
          <AccountProvider>
            <AccountRoute>
              <AccountLayout />
            </AccountRoute>
          </AccountProvider>
        }>
          <Route index element={<AccountDashboard />} />
          <Route path="cursos" element={<MyCourses />} />
          <Route path="certificados" element={<MyCertificates />} />
          <Route path="asistencias" element={<MyAttendance />} />
          <Route path="perfil" element={<MyProfile />} />
        </Route>

        {/* 404 route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;