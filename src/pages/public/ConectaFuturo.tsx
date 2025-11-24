import React, { useState } from 'react';
import { Calendar, MapPin, Users, Target, Lightbulb, Globe, Search, Compass, Database, Shield, FileText, Network, CheckCircle, ExternalLink, Video, ChevronDown, ChevronUp } from 'lucide-react';
import ReactPlayer from 'react-player';

const ConectaFuturo: React.FC = () => {
  const [expandedVideos, setExpandedVideos] = useState<Set<number>>(new Set());

  const toggleVideo = (index: number) => {
    const newExpanded = new Set(expandedVideos);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedVideos(newExpanded);
  };

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

  const sessionsVideos = [
    {
      session: 'Sesión 1',
      title: 'Ciberseguridad y Confianza Digital',
      description: 'Explorar prioridades, capacidades y próximos pasos en ciberseguridad para el sector público',
      speaker: 'Germán López (Colombia)',
      videoUrl: 'https://youtu.be/XfHtGnbJHUk'
    },
    {
      session: 'Sesión 2',
      title: 'Datos Abiertos',
      description: 'Introducción a los datos abiertos y su relevancia para la transparencia y el valor público',
      speaker: 'Daniel Carranza – DATA Uruguay',
      videoUrl: 'https://youtu.be/1ysPulajGgE'
    },
    {
      session: 'Sesión 3',
      title: 'Datos Abiertos',
      description: 'Datos abiertos y medio ambiente: oportunidades, desafíos y ejemplos de impacto',
      speaker: 'Mercedes De los Santos – Open Data Charter',
      videoUrl: 'https://youtu.be/4dJQE9Ufkts'
    },
    {
      session: 'Sesión 4',
      title: 'Datos Abiertos',
      description: 'Marcos regulatorios y tendencias en políticas de datos abiertos en América Latina',
      speaker: 'Mike Mora – Organización de los Estados Americanos (OEA)',
      videoUrl: 'https://youtu.be/VCjVvP-nRGs'
    },
    {
      session: 'Sesión 5',
      title: 'Datos Abiertos',
      description: 'El liderazgo del Reino Unido en la agenda global de datos abiertos',
      speaker: 'Marta Acosta – Embajada del Reino Unido',
      videoUrl: 'https://youtu.be/sWLKmLconpY'
    },
    {
      session: 'Sesión 6',
      title: 'Interoperabilidad e Innovación Pública',
      description: 'Presentación de avances internacionales y modelos exitosos en interoperabilidad',
      speaker: 'Germán López (Colombia)',
      videoUrl: 'https://youtu.be/Jx_0mUmW-w4'
    },
    {
      session: 'Sesión 7',
      title: 'Interoperabilidad e Innovación Pública – SIB - IVE',
      description: 'Presentación de avances internacionales y modelos exitosos en interoperabilidad',
      speaker: 'Superintendencia de Bancos – Ing. Manuel Lepe',
      videoUrl: 'https://youtu.be/T5mQrcA4nGc'
    }
  ];

  const agenda = [
    {
      time: '09:00 – 09:30',
      activity: 'Bienvenida y Apertura',
      description: 'Apertura institucional y presentación de la visión estratégica del evento',
      speaker: 'Julio Herrera Toledo – Director Ejecutivo, Red Ciudadana'
    },
    {
      time: '09:30 – 10:00',
      activity: 'Sesión 1 – Ciberseguridad y Confianza Digital',
      description: 'Explorar prioridades, capacidades y próximos pasos en ciberseguridad para el sector público',
      speaker: 'Germán López (Colombia)'
    },
    {
      time: '10:00 – 10:05',
      activity: 'Intervención – Embajada del Reino Unido',
      description: 'Mensaje inaugural del bloque de Datos Abiertos desde la perspectiva de la cooperación internacional',
      speaker: 'Paul Huggins – Deputy Head of Mission, UK Embassy'
    },
    {
      time: '10:05 – 10:25',
      activity: 'Sesión 2 – Datos Abiertos',
      description: 'Introducción a los datos abiertos y su relevancia para la transparencia y el valor público',
      speaker: 'Daniel Carranza – DATA Uruguay'
    },
    {
      time: '10:25 – 10:45',
      activity: 'Sesión 3 – Datos Abiertos',
      description: 'Datos abiertos y medio ambiente: oportunidades, desafíos y ejemplos de impacto',
      speaker: 'Mercedes De los Santos – Open Data Charter'
    },
    {
      time: '10:45 – 11:05',
      activity: 'Sesión 4 – Datos Abiertos',
      description: 'Marcos regulatorios y tendencias en políticas de datos abiertos en América Latina',
      speaker: 'Mike Mora – Organización de los Estados Americanos (OEA)'
    },
    {
      time: '11:05 – 11:25',
      activity: 'Sesión 5 – Datos Abiertos',
      description: 'El liderazgo del Reino Unido en la agenda global de datos abiertos',
      speaker: 'Marta Acosta – Embajada del Reino Unido'
    },
    {
      time: '11:25 – 11:45',
      activity: 'Sesión 6 – Interoperabilidad e Innovación Pública',
      description: 'Presentación de avances internacionales y modelos exitosos en interoperabilidad',
      speaker: 'Germán López (Colombia)'
    },
    {
      time: '12:05 – 12:10',
      activity: 'Cierre Institucional',
      description: 'Agradecimientos, conclusiones y próximos pasos',
      speaker: 'Julio Herrera Toledo – Director Ejecutivo, Red Ciudadana'
    }
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
            Construimos juntos el Estado digital del futuro
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg md:text-xl mb-10">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span>19 de noviembre de 2025</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              <span>Evento virtual vía Zoom</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const videosSection = document.getElementById('videos');
                if (videosSection) {
                  videosSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0072CE] rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              <Video className="mr-2 w-5 h-5" />
              Ver grabaciones
            </button>
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
                  Conecta Futuro 2025 fue un encuentro virtual organizado por Red Ciudadana que reunió a instituciones públicas, sociedad civil, academia y sector tecnológico.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Durante esta jornada, exploramos cómo los datos, la interoperabilidad y la ciberseguridad pueden fortalecer la confianza y la eficiencia del Estado guatemalteco.
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

      {/* Videos de las Sesiones */}
      <div id="videos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Grabaciones del Evento
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revive las sesiones de Conecta Futuro 2025 con expertos internacionales
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            {sessionsVideos.map((session, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <button
                  onClick={() => toggleVideo(index)}
                  className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-[#0072CE] to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 transition-all"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold opacity-90">{session.session}</p>
                      <h3 className="text-lg font-bold">{session.title}</h3>
                    </div>
                  </div>
                  {expandedVideos.has(index) ? (
                    <ChevronUp className="w-6 h-6 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 flex-shrink-0" />
                  )}
                </button>

                {expandedVideos.has(index) && (
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-700 mb-2 leading-relaxed">{session.description}</p>
                      <p className="text-sm text-gray-600 font-medium">
                        <span className="text-[#0072CE]">Expositor:</span> {session.speaker}
                      </p>
                    </div>
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <ReactPlayer
                        url={session.videoUrl}
                        width="100%"
                        height="100%"
                        controls={true}
                        config={{
                          youtube: {
                            playerVars: { showinfo: 1 }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
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
              Un día de aprendizaje, intercambio y transformación digital
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Agenda Header */}
            <div className="mb-8 text-center">
              <div className="inline-block px-6 py-4 bg-[#0072CE] text-white rounded-lg font-semibold text-lg">
                Miércoles 19 de noviembre de 2025
              </div>
              <div className="text-gray-600 mt-2">Integridad, Interoperabilidad y Ciberseguridad</div>
            </div>

            {/* Agenda Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {agenda.map((item, index) => (
                <div
                  key={index}
                  className={`p-6 ${
                    index !== agenda.length - 1
                      ? 'border-b border-gray-200'
                      : ''
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="flex-shrink-0 md:w-32 text-[#0072CE] font-semibold">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 text-lg font-semibold mb-2">{item.activity}</h3>
                      <p className="text-gray-700 text-sm mb-2 leading-relaxed">{item.description}</p>
                      <p className="text-gray-600 text-sm italic">{item.speaker}</p>
                    </div>
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

      {/* CTA Videos */}
      <div className="py-20 bg-[#0072CE] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              Gracias por ser parte de Conecta Futuro 2025
            </h2>
            <p className="text-xl leading-relaxed mb-8">
              El evento se realizó exitosamente el 19 de noviembre de 2025. Revive las sesiones y descubre cómo estamos construyendo el Estado digital del futuro.
            </p>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Video className="w-6 h-6" />
                  <span>7 sesiones grabadas</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  <span>Expertos internacionales</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Acceso gratuito</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const videosSection = document.getElementById('videos');
                if (videosSection) {
                  videosSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#0072CE] rounded-lg font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl"
            >
              <Video className="mr-3 w-6 h-6" />
              Ver grabaciones
            </button>
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
