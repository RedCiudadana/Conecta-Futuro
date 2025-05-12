import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Linkedin, Youtube, Video } from 'lucide-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Header */}
      <div className="bg-primary-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm">
            Sitio oficial de la Asociación Civil Red Ciudadana
          </p>
          <div className="hidden sm:flex items-center space-x-4">
            <a 
              href="https://facebook.com/RedCiudadanaGT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-primary-200 transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a 
              href="https://linkedin.com/company/red-ciudadana" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-primary-200 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://youtube.com/@RedCiudadanaGT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-primary-200 transition-colors"
            >
              <Youtube size={20} />
            </a>
            <a 
              href="https://tiktok.com/@redciudadanagt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-primary-200 transition-colors"
            >
              <Video size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 w-full z-30 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Logo className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold text-primary-700">Conecta Futuro</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Inicio
              </Link>
              <Link to="/courses" className="text-gray-700 hover:text-primary-600 font-medium">
                Cursos
              </Link>
              <Link to="/learning-paths" className="text-gray-700 hover:text-primary-600 font-medium">
                Rutas de Aprendizaje
              </Link>
              <Link to="/course-sessions" className="text-gray-700 hover:text-primary-600 font-medium">
                Contenido
              </Link>
              <Link to="/community" className="text-gray-700 hover:text-primary-600 font-medium">
                Comunidad
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-md shadow-lg mt-2">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Inicio
              </Link>
              <Link to="/courses" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Cursos
              </Link>
              <Link to="/learning-paths" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Rutas de Aprendizaje
              </Link>
              <Link to="/course-sessions" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Contenido
              </Link>
              <Link to="/community" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Comunidad
              </Link>
              
              {/* Mobile Social Links */}
              <div className="flex items-center space-x-4 px-3 py-2 border-t mt-2">
                <a 
                  href="https://facebook.com/RedCiudadanaGT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://linkedin.com/company/red-ciudadana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://youtube.com/@RedCiudadanaGT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Youtube size={20} />
                </a>
                <a 
                  href="https://tiktok.com/@redciudadanagt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Video size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;