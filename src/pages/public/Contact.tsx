import React, { useState } from 'react';
import Redes1 from '../../assets/contacto/REDES-43.png';
import Redes2 from '../../assets/contacto/REDES-44.png';
import Redes3 from '../../assets/contacto/REDES-45.png';
import Redes4 from '../../assets/contacto/REDES-46.png';
import Slider from '../../assets/slider/contact.png';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    affair: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLSe2DNIWZVQugZ_G-rQCzO9EKpWr66ZXe8rbBBHtKYduKIeXyQ/formResponse';

    const formBody = new URLSearchParams();
    formBody.append('entry.1064235632', formData.name);
    formBody.append('entry.1330832081', formData.email);
    formBody.append('entry.1233483376', formData.affair);
    formBody.append('entry.608682247', formData.message);

    try {
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-semibold text-green-600">✅ Su mensaje ha sido enviado</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="from-primary-900 to-primary-800 text-white" style={{ backgroundImage: `url(${Slider})` }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Columna izquierda */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
              Para más información de eventos, dudas o de nuestro trabajo
            </h2>
            <p className="mb-6 text-gray-700">
              Llena el siguiente formulario y nuestro equipo te estará contactando.
            </p>
            <div className="flex gap-4 items-center flex-wrap">
              <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/Redciudadanagt">
                <img width="40" src={Redes1} alt="Facebook" />
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/redxguate">
                <img width="40" src={Redes2} alt="Twitter" />
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/redxguate/">
                <img width="40" src={Redes3} alt="Instagram" />
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/c/RedciudadanaOrgGt">
                <img width="40" src={Redes4} alt="YouTube" />
              </a>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  placeholder='Nombre completo'
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm p-4"
                  style={{ border: '1px solid #000' }}
                />
              </div>

              <div>
                <input
                  placeholder='Correo electrónico'
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm p-4"
                  style={{ border: '1px solid #000' }}
                />
              </div>

              <div>
                <input
                  placeholder='Asunto / Motivo de Contacto'
                  type="text"
                  name="affair"
                  id="affair"
                  value={formData.affair}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm p-4"
                  style={{ border: '1px solid #000' }}
                />
              </div>

              <div>
                <textarea
                  placeholder='Escribe tu mensaje aquí...'
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm p-4"
                  style={{ border: '1px solid #000' }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Envíanos un mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
