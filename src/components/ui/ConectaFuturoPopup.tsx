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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative animate-slideUp overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 pb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold mb-1">
                  Evento Virtual 2025
                </div>
                <h2 className="text-3xl font-bold font-heading">
                  Conecta Futuro 2025
                </h2>
              </div>
            </div>
            <p className="text-xl text-blue-50 leading-relaxed">
              Construyamos juntos un Estado digital, transparente y eficiente
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <Calendar className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">18 y 19 de noviembre de 2025</p>
                  <p className="text-sm text-gray-600">8:00 - 11:30 am (hora de Guatemala)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <ExternalLink className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">100% Virtual vía Zoom</p>
                  <p className="text-sm text-gray-600">Evento gratuito y abierto al público</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Únete a este encuentro que busca inspirar la colaboración entre instituciones públicas,
              sociedad civil, academia y sector tecnológico para explorar cómo los datos, la interoperabilidad
              y la ciberseguridad pueden fortalecer la confianza y la eficiencia del Estado guatemalteco.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/conecta-futuro"
                onClick={handleClose}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-[#0072CE] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ver más información
              </Link>
              <a
                href="https://us06web.zoom.us/webinar/register/WN_kVE0zhuKQ-GNFzz6q9jCMw#/registration"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Registrarme ahora
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default ConectaFuturoPopup;
