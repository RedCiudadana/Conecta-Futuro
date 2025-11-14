import React, { useState, useEffect } from 'react';
import { X, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConectaFuturoPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('conectaFuturoPopupSeen');

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('conectaFuturoPopupSeen', 'true');
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

          <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white p-5">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 pr-6">
                <div className="inline-block px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold mb-1">
                  Evento Virtual 2025
                </div>
                <h3 className="text-xl font-bold font-heading">
                  Conecta Futuro 2026
                </h3>
              </div>
            </div>
            <p className="text-sm text-blue-50 leading-snug">
              Construyamos juntos el Estado digital del próximo año
            </p>
          </div>

          <div className="p-5">
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">19 de noviembre</p>
                  <p className="text-xs text-gray-600">9:00 am - 12:10 pm</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">100% Virtual</p>
                  <p className="text-xs text-gray-600">Evento gratuito</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                to="/conecta-futuro"
                onClick={handleClose}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#0072CE] text-white text-sm rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ver más información
              </Link>
              <a
                href="https://us06web.zoom.us/webinar/register/WN_kVE0zhuKQ-GNFzz6q9jCMw#/registration"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Registrarme ahora
                <ExternalLink className="ml-2 w-3.5 h-3.5" />
              </a>
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
