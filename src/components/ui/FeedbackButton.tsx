import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 bg-accent-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-accent-700 transition-colors group z-50"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full top-1/2 -translate-y-1/2 bg-accent-600 text-white py-2 px-4 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ayúdanos a mejorar
        </span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¡Tu opinión es importante!
              </h2>
              <p className="text-gray-600 mb-6">
                Ayúdanos a mejorar tu experiencia de aprendizaje. Comparte tus comentarios, sugerencias o reporta cualquier problema que hayas encontrado.
              </p>

              <form className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de feedback
                  </label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  >
                    <option value="suggestion">Sugerencia</option>
                    <option value="bug">Reporte de error</option>
                    <option value="content">Contenido del curso</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Tu mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="Describe tu sugerencia o problema..."
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    placeholder="Para recibir seguimiento a tu feedback"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent-600 text-white py-2 px-4 rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Enviar feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;