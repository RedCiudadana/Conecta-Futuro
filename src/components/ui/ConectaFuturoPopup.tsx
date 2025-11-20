import React, { useState, useEffect } from 'react';
import { X, BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConectaFuturoPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('primerosPassosPopupSeen');

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('primerosPassosPopupSeen', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slideIn">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative bg-gradient-to-br from-green-500 to-green-700 text-white p-5">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 pr-6">
                <div className="inline-block px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold mb-1">
                  🎉 Curso Gratuito
                </div>
                <h3 className="text-xl font-bold font-heading">
                  Mis Primeros Pasos Digitales
                </h3>
              </div>
            </div>
            <p className="text-sm text-green-50 leading-snug">
              Aprende a usar herramientas digitales desde cero
            </p>
          </div>

          <div className="p-5">
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">8 módulos prácticos</p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Sin experiencia previa</p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Certificado digital incluido</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                to="/primeros-pasos-digitales"
                onClick={handleClose}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Ver módulos del curso
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default ConectaFuturoPopup;
