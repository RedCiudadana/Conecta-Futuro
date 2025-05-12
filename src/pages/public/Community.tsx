import React from 'react';
import { Calendar, Users, Newspaper, ExternalLink, MapPin, Clock, ArrowRight } from 'lucide-react';

const Community = () => {
  const events = [
    {
      id: 1,
      title: "Hackathon: Innovación Pública 2024",
      date: "2024-04-15T09:00:00",
      location: "Ciudad de Guatemala",
      type: "presencial",
      description: "Únete a nuestro hackathon anual donde desarrolladores, diseñadores y servidores públicos colaboran para crear soluciones innovadoras.",
      image: "https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg"
    },
    {
      id: 2,
      title: "Workshop: Datos Abiertos en Acción",
      date: "2024-04-20T15:00:00",
      location: "Online",
      type: "virtual",
      description: "Taller práctico sobre el uso efectivo de datos abiertos para la toma de decisiones en el sector público.",
      image: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg"
    },
    {
      id: 3,
      title: "Panel: Futuro del Gobierno Digital",
      date: "2024-04-25T16:00:00",
      location: "Online",
      type: "virtual",
      description: "Expertos internacionales discuten las tendencias y desafíos en la transformación digital del sector público.",
      image: "https://images.pexels.com/photos/7092614/pexels-photo-7092614.jpeg"
    }
  ];

  const news = [
    {
      id: 1,
      title: "Red Ciudadana lanza nueva certificación en IA para el sector público",
      date: "2024-03-15",
      category: "Educación",
      description: "Nueva certificación diseñada para fortalecer las capacidades en IA de funcionarios públicos.",
      image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg"
    },
    {
      id: 2,
      title: "Más de 1000 funcionarios capacitados en transformación digital",
      date: "2024-03-10",
      category: "Logros",
      description: "Alcanzamos un hito importante en nuestra misión de fortalecer las capacidades digitales del sector público.",
      image: "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg"
    },
    {
      id: 3,
      title: "Nuevas alianzas para impulsar la innovación gubernamental",
      date: "2024-03-05",
      category: "Alianzas",
      description: "Establecemos colaboraciones estratégicas para ampliar el impacto de nuestros programas educativos.",
      image: "https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg"
    }
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Comunidad Red Ciudadana</h1>
            <p className="text-xl text-primary-100">
              Únete a una comunidad vibrante de innovadores públicos comprometidos con la transformación digital
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Próximos Eventos</h2>
            <Calendar className="w-8 h-8 text-primary-600" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'virtual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {event.type === 'virtual' ? 'Virtual' : 'Presencial'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                    Registrarse
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Últimas Noticias</h2>
            <Newspaper className="w-8 h-8 text-primary-600" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500 ml-4">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <a
                    href="#"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-primary-100">Miembros activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Eventos realizados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-primary-100">Países representados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;