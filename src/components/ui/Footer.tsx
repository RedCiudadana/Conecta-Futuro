import React from 'react';
import { Link } from 'react-router-dom';
import LogoRedNegro from '../../assets/logorednegro.png';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Youtube, Video } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <img src={LogoRedNegro} style={{ filter: 'invert(1) hue-rotate(180deg) contrast(1.2) brightness(1.1)' }} />
            </div>
            <p className="text-gray-400 mb-4">
              La plataforma educativa de Red Ciudadana para la innovación pública y transformación digital en América Latina.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/Redciudadanagt/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/redxguate/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/2532725" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin size={20} />
              </a>
              <a href="https://www.youtube.com/c/RedciudadanaOrgGt" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Todos los Cursos
                </Link>
              </li>
              <li>
                <Link to="/tutoriales" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Tutoriales
                </Link>
              </li>
              <li>
                <Link to="/digitaliza-tu-pyme" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Digitaliza tu PYME
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Comunidad
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-gray-400 hover:text-white transition-colors duration-200">
                  Innovación Pública
                </p>
              </li>
              <li>
                <p className="text-gray-400 hover:text-white transition-colors duration-200">
                  Transformación Digital
                </p>
              </li>
              <li>
                <p className="text-gray-400 hover:text-white transition-colors duration-200">
                  Inteligencia Artificial
                </p>
              </li>
              <li>
                <p className="text-gray-400 hover:text-white transition-colors duration-200">
                  Datos Abiertos
                </p>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail size={18} className="mr-2" />
                <a href="mailto:info@redciudadana.org" className="hover:text-white transition-colors duration-200">
                  info@redciudadana.org.gt
                </a>
              </li>
              {/* <li className="flex items-center text-gray-400">
                <Phone size={18} className="mr-2" />
                <a href="tel:+50222245252" className="hover:text-white transition-colors duration-200">
                  +502 4011-2926
                </a>
              </li> */}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Red Ciudadana. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-sm transition-colors duration-200">
              Política de Privacidad
            </Link>
            <Link to="/terms-of-service" className="text-gray-500 hover:text-white text-sm transition-colors duration-200">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;