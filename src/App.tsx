import { Routes, Route } from 'react-router-dom';

// Public pages
import LandingPage from './pages/public/LandingPage';
import CourseCatalog from './pages/public/CourseCatalog';
import CourseDetails from './pages/public/CourseDetails';
import CourseSession from './pages/public/CourseSession';
import CourseSessions from './pages/public/CourseSessions';
import LearningPaths from './pages/public/LearningPaths';
import MobileApi from './pages/public/MobileApi';
import AboutUs from './pages/public/AboutUs';
import Contact from './pages/public/Contact';
import Documentation from './pages/public/Documentation';
import NotFound from './pages/public/NotFound';
import Community from './pages/public/Community';

// Layout components
import PublicLayout from './components/layouts/PublicLayout';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          {/* Nested routes */}
          <Route index element={<LandingPage />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="course-sessions" element={<CourseSessions />} />
          <Route path="learning-paths" element={<LearningPaths />} />
          <Route path="mobile-api" element={<MobileApi />} />
          <Route path="course/:slug" element={<CourseDetails />} />
          <Route path="course/:slug/session" element={<CourseSession />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="community" element={<Community />} />
        </Route>
        
        {/* 404 route */}
        <Route path="/*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}

export default App;