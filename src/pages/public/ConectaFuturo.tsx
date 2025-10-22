import React, { useState } from 'react';
import { Calendar, MapPin, Users, Target, Lightbulb, Globe, Search, Compass, Database, Shield, FileText, Network, CheckCircle, ExternalLink } from 'lucide-react';

const ConectaFuturo: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const objectives = [
    {
      icon: Lightbulb,
      title: 'Inspirar',
      description: 'Fomentar el liderazgo digital y la innovación pública.'
    },
    {
      icon: Globe,
      title: 'Conectar',
      description: 'Reunir a gobierno, sociedad civil y academia para compartir experiencias.'
    },
    {
      icon: Search,
      title: 'Aprender',
      description: 'Promover el intercambio de buenas prácticas sobre interoperabilidad y datos abiertos.'
    },
    {
      icon: Compass,
      title: 'Transformar',
      description: 'Impulsar un Estado transparente, colaborativo y eficiente.'
    }
  ];

  const keyTopics = [
    {
      icon: Network,
      title: 'Interoperabilidad y colaboración institucional'
    },
    {
      icon: Database,
      title: 'Datos abiertos y transparencia proactiva'
    },
    {
      icon: CheckCircle,
      title: 'Tecnología para la integridad pública'
    },
    {
      icon: FileText,
      title: 'Modernización de trámites digitales'
    },
    {
      icon: Shield,
      title: 'Ciberseguridad y confianza ciudadana'
    },
    {
      icon: Users,
      title: 'Innovación centrada en las personas'
    }
  ];

  const agendaDay1 = [
    { time: '08:00 – 08:05', activity: 'Bienvenida y apertura' },
    { time: '08:05 – 09:00', activity: 'Keynote: "El Futuro Digital de los Estados"' },
    { time: '09:00 – 09:50', activity: 'Bloque 1: Datos Abiertos' },
    { time: '09:50 – 10:40', activity: 'Bloque 2: Trámites y Servicios Digitales' },
    { time: '10:40 – 11:30', activity: 'Bloque 3: Tecnología para Combatir la Corrupción' },
    { time: '11:30 – 11:35', activity: 'Cierre Día 1' }
  ];

  const agendaDay2 = [
    { time: '08:00 – 08:05', activity: 'Bienvenida Día 2' },
    { time: '08:05 – 09:00', activity: 'La Agenda de Transformación Digital en Guatemala' },
    { time: '09:00 – 09:55', activity: 'Bloque 4: Interoperabilidad' },
    { time: '09:55 – 10:40', activity: 'Bloque 5: Ciberseguridad y Confianza Digital' },
    { time: '10:40 – 11:30', activity: 'Cierre y Llamado a la Acción' }
  ];

  const scrollToAgenda = () => {
    const agendaSection = document.getElementById('agenda');
    if (agendaSection) {
      agendaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="absolute inset-0 bg-[#0072CE] opacity-65"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading">
            Conecta Futuro 2025
          </h1>
          <p className="text-2xl md:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed">
            Construyamos juntos un Estado digital, transparente y eficiente.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg md:text-xl mb-10">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span>18 y 19 de noviembre de 2025</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              <span>Evento virtual vía Zoom</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://us06web.zoom.us/webinar/register/WN_kVE0zhuKQ-GNFzz6q9jCMw#/registration"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0072CE] rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              Registrarme al evento
              <ExternalLink className="ml-2 w-5 h-5" />
            </a>
            <button
              onClick={scrollToAgenda}
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-[#0072CE] transition-all"
            >
              Ver agenda
            </button>
          </div>
        </div>
      </div>

      {/* Sobre el evento */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 font-heading">
                  Un espacio para construir confianza digital
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Conecta Futuro 2025 es un encuentro virtual organizado por Red Ciudadana que busca inspirar la colaboración entre instituciones públicas, sociedad civil, academia y sector tecnológico.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Durante dos jornadas, exploraremos cómo los datos, la interoperabilidad y la ciberseguridad pueden fortalecer la confianza y la eficiencia del Estado guatemalteco.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                  alt="Colaboración digital"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Objetivos */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Objetivos del Evento
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cuatro pilares fundamentales para transformar el Estado guatemalteco
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-[#0072CE] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <objective.icon className="w-8 h-8 text-[#0072CE]" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-heading">
                  {objective.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {objective.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div id="agenda" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Agenda del Evento
            </h2>
            <p className="text-xl text-gray-600">
              Dos días de aprendizaje, intercambio y transformación digital
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
              <button
                onClick={() => setActiveDay(1)}
                className={`px-6 py-4 font-semibold text-lg transition-all ${
                  activeDay === 1
                    ? 'text-[#0072CE] border-b-4 border-[#0072CE] -mb-0.5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Día 1 - Martes 18 de noviembre
                <div className="text-sm font-normal mt-1">Gobierno Digital y Transparencia</div>
              </button>
              <button
                onClick={() => setActiveDay(2)}
                className={`px-6 py-4 font-semibold text-lg transition-all ${
                  activeDay === 2
                    ? 'text-[#0072CE] border-b-4 border-[#0072CE] -mb-0.5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Día 2 - Miércoles 19 de noviembre
                <div className="text-sm font-normal mt-1">Integridad, Interoperabilidad y Ciberseguridad</div>
              </button>
            </div>

            {/* Agenda Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {(activeDay === 1 ? agendaDay1 : agendaDay2).map((item, index) => (
                <div
                  key={index}
                  className={`p-6 flex gap-6 ${
                    index !== (activeDay === 1 ? agendaDay1 : agendaDay2).length - 1
                      ? 'border-b border-gray-200'
                      : ''
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex-shrink-0 w-32 text-[#0072CE] font-semibold">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-lg">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Temas Clave */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Temas Clave
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorando las dimensiones de la transformación digital del Estado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {keyTopics.map((topic, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex items-start gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#0072CE] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <topic.icon className="w-6 h-6 text-[#0072CE]" />
                </div>
                <p className="text-gray-900 font-medium text-lg leading-snug">
                  {topic.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Registration */}
      <div className="py-20 bg-[#0072CE] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              🎟️ Participa en Conecta Futuro 2025
            </h2>
            <p className="text-xl leading-relaxed mb-8">
              El evento es gratuito y abierto al público.
            </p>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  <span>18 y 19 de noviembre de 2025</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <span>🕗 08:00 a 11:30 am (hora de Guatemala)</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  <span>100% virtual vía Zoom</span>
                </div>
              </div>
            </div>
            <a
              href="https://us06web.zoom.us/webinar/register/WN_kVE0zhuKQ-GNFzz6q9jCMw#/registration"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#0072CE] rounded-lg font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl"
            >
              Regístrate aquí
              <ExternalLink className="ml-3 w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Organiza */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">
              Organiza
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex-shrink-0">
                <img
                  src="/logo/redciudadana.png"
                  alt="Red Ciudadana"
                  className="h-24 w-auto"
                />
              </div>
              <div className="text-left max-w-xl">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Red Ciudadana es una organización sin fines de lucro que promueve la transparencia, la participación y la innovación pública a través de la tecnología.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConectaFuturo;
