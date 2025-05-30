import React, { useState } from 'react';
import Redes1 from '../../assets/contacto/REDES-43.png';
import Redes2 from '../../assets/contacto/REDES-44.png';
import Redes3 from '../../assets/contacto/REDES-45.png';
import Redes4 from '../../assets/contacto/REDES-46.png';
import Slider from '../../assets/slider/contact.png';

interface FormData {
  name: string;
  email: string;
  affair: string;
  message: string;
}

const initialState: FormData = { name: '', email: '', affair: '', message: '' };

const Contact: React.FC = () => {
  /* ----------------------------- Estados ----------------------------- */
  const [formData, setFormData] = useState<FormData>(initialState);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* ------------------------- Manejadores UI -------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('name',     formData.name.trim());
      params.append('email',    formData.email.trim());
      params.append('affair',   formData.affair.trim());
      params.append('message',  formData.message.trim());
      params.append(
        'timestamp',
        new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala' })
      );

      await fetch(
        'https://script.google.com/macros/s/AKfycbwNCboqdGD2Nux023KtHXvuSKr4_-y5ZfDtE-xwPAukcoXdbNgWxiW0KIxJQBtIP4d0/exec?' +
          params.toString(),
        { method: 'GET', mode: 'no-cors' }
      );

      setSubmitted(true);
      setFormData(initialState);
    } catch {
      setError('Hubo un error al enviar tu mensaje. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- Vista post-envío exitosa -------------------- */
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-semibold text-green-600">
          ✅ Tu mensaje ha sido enviado
        </h2>
      </div>
    );
  }

  /* ------------------------------ JSX ------------------------------- */
  return (
    <div>
      {/* Hero */}
      <div
        className="from-primary-900 to-primary-800 text-white"
        style={{ backgroundImage: `url(${Slider})` }}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Columna izquierda */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
              Para más información de eventos, dudas o de nuestro trabajo
            </h2>
            <p className="mb-6 text-gray-700">
              Llena el siguiente formulario y nuestro equipo te estará
              contactando.
            </p>
            <div className="flex gap-4 items-center flex-wrap">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/Redciudadanagt"
              >
                <img width="40" src={Redes1} alt="Facebook" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://twitter.com/redxguate"
              >
                <img width="40" src={Redes2} alt="Twitter" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/redxguate/"
              >
                <img width="40" src={Redes3} alt="Instagram" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/c/RedciudadanaOrgGt"
              >
                <img width="40" src={Redes4} alt="YouTube" />
              </a>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div>
            {error && (
              <p className="mb-4 text-red-600 text-sm font-medium">{error}</p>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                placeholder="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full p-4 border border-black shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />

              <input
                placeholder="Correo electrónico"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full p-4 border border-black shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />

              <input
                placeholder="Asunto / Motivo de contacto"
                name="affair"
                value={formData.affair}
                onChange={handleChange}
                className="block w-full p-4 border border-black shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />

              <textarea
                placeholder="Escribe tu mensaje aquí..."
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="block w-full p-4 border border-black shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-primary-600 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? 'Enviando…' : 'Envíanos un mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
