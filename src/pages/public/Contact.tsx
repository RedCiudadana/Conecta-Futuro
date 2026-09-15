import React, { useState } from 'react';
import Redes1 from '../../assets/contacto/REDES-43.png';
import Redes2 from '../../assets/contacto/REDES-44.png';
import Redes3 from '../../assets/contacto/REDES-45.png';
import Redes4 from '../../assets/contacto/REDES-46.png';
import Slider from '../../assets/slider/contact.png';
import Seo from '../../components/Seo';
import { SEO } from '../../config/seo';
import { supabase } from '../../config/supabase';
import { Mail, User, Tag, MessageSquare, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Ocurrió un error al enviar tu mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <Seo {...SEO['/contact']} canonical="/contact" />
        <div className="from-primary-900 to-primary-800 text-white" style={{ backgroundImage: `url(${Slider})` }}>
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center py-16">
              <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Mensaje enviado!</h2>
          <p className="text-gray-500 mb-8">Gracias por escribirnos. Nuestro equipo se pondrá en contacto contigo pronto.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Seo {...SEO['/contact']} canonical="/contact" />
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
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="tu.correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Asunto
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    placeholder="Motivo de contacto"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mensaje
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Escribe tu mensaje aquí..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="h-5 w-5" /> Enviar mensaje</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
