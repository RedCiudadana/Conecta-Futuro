import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import {
  Play,
  Volume2,
  Search,
  Filter,
  BookOpen,
  Video,
  Headphones,
  Tag,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Fondo from '../../assets/slider/fondo.png';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl?: string;
  audioUrl?: string;
  duration: string;
  tags: string[];
  thumbnail?: string;
}

const tutorials: Tutorial[] = [
  {
    id: 'excel-formulas-basicas',
    title: 'Fórmulas Básicas en Excel',
    description: 'Aprende a usar las fórmulas más comunes en Excel como SUMA, PROMEDIO, MAX y MIN para análisis de datos.',
    category: 'Excel',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    audioUrl: 'https://example.com/audio/excel-formulas.mp3',
    duration: '8 min',
    tags: ['Excel', 'Fórmulas', 'Básico']
  },
  {
    id: 'whatsapp-business-catalogo',
    title: 'Crear Catálogo en WhatsApp Business',
    description: 'Tutorial paso a paso para crear y gestionar un catálogo de productos en WhatsApp Business.',
    category: 'WhatsApp Business',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    duration: '5 min',
    tags: ['WhatsApp', 'Catálogo', 'Negocios']
  },
  {
    id: 'powerbi-visualizaciones',
    title: 'Crear Visualizaciones en Power BI',
    description: 'Aprende a crear gráficos y visualizaciones impactantes para tus reportes en Power BI.',
    category: 'Power BI',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    audioUrl: 'https://example.com/audio/powerbi-viz.mp3',
    duration: '12 min',
    tags: ['Power BI', 'Visualización', 'Reportes']
  },
  {
    id: 'facebook-publicaciones',
    title: 'Optimizar Publicaciones en Facebook',
    description: 'Consejos prácticos para crear publicaciones efectivas que aumenten el alcance de tu página.',
    category: 'Redes Sociales',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    duration: '6 min',
    tags: ['Facebook', 'Marketing', 'Redes Sociales']
  },
  {
    id: 'ia-chatgpt-prompts',
    title: 'Escribir Prompts Efectivos con ChatGPT',
    description: 'Técnicas para obtener mejores resultados al interactuar con herramientas de IA como ChatGPT.',
    category: 'Inteligencia Artificial',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    audioUrl: 'https://example.com/audio/chatgpt-prompts.mp3',
    duration: '10 min',
    tags: ['IA', 'ChatGPT', 'Productividad']
  },
  {
    id: 'canva-diseño-flyers',
    title: 'Diseñar Flyers Profesionales en Canva',
    description: 'Crea diseños atractivos para promocionar tu negocio usando las herramientas de Canva.',
    category: 'Diseño Gráfico',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    duration: '9 min',
    tags: ['Canva', 'Diseño', 'Marketing']
  },
  {
    id: 'datos-abiertos-busqueda',
    title: 'Buscar y Usar Datos Abiertos',
    description: 'Guía práctica para encontrar y utilizar datos abiertos gubernamentales en tus proyectos.',
    category: 'Datos Abiertos',
    videoUrl: 'https://www.youtube.com/watch?v=example7',
    audioUrl: 'https://example.com/audio/datos-abiertos.mp3',
    duration: '15 min',
    tags: ['Datos Abiertos', 'Gobierno', 'Análisis']
  },
  {
    id: 'seguridad-contraseñas',
    title: 'Crear Contraseñas Seguras',
    description: 'Mejores prácticas para crear y gestionar contraseñas que protejan tu información digital.',
    category: 'Ciberseguridad',
    videoUrl: 'https://www.youtube.com/watch?v=example8',
    duration: '7 min',
    tags: ['Seguridad', 'Contraseñas', 'Digital']
  }
];

const categories = ['Todas', ...Array.from(new Set(tutorials.map(t => t.category)))];

const Tutoriales: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'Todas' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleTutorial = (id: string) => {
    setExpandedTutorial(expandedTutorial === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative bg-cover bg-center text-white py-20"
        style={{ backgroundImage: `url(${Fondo})` }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-4 mb-6">
              <Video className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              Tutoriales
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Mini tutoriales en video y audio para aprender habilidades específicas de forma rápida y práctica
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tutoriales por nombre, descripción o etiqueta..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 transition-all duration-200 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 'es' : ''} disponible{filteredTutorials.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {filteredTutorials.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron tutoriales</h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o selecciona otra categoría
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map(tutorial => (
                <div
                  key={tutorial.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                    {tutorial.videoUrl ? (
                      <Play className="w-16 h-16 text-white/80" />
                    ) : (
                      <Headphones className="w-16 h-16 text-white/80" />
                    )}
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {tutorial.duration}
                    </div>
                    <div className="absolute top-3 left-3 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                      {tutorial.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">
                      {tutorial.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tutorial.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {tutorial.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleTutorial(tutorial.id)}
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {expandedTutorial === tutorial.id ? (
                        <>
                          <ChevronUp className="w-5 h-5" />
                          Cerrar Tutorial
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Ver Tutorial
                        </>
                      )}
                    </button>

                    {expandedTutorial === tutorial.id && (
                      <div className="mt-6 space-y-4 border-t pt-4">
                        {tutorial.videoUrl && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Video className="w-5 h-5 text-primary-600" />
                              <h4 className="font-semibold text-gray-900">Video Tutorial</h4>
                            </div>
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <ReactPlayer
                                url={tutorial.videoUrl}
                                width="100%"
                                height="100%"
                                controls
                                light
                              />
                            </div>
                          </div>
                        )}

                        {tutorial.audioUrl && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Volume2 className="w-5 h-5 text-primary-600" />
                              <h4 className="font-semibold text-gray-900">Audio Tutorial</h4>
                            </div>
                            <audio
                              controls
                              className="w-full"
                              src={tutorial.audioUrl}
                            >
                              Tu navegador no soporta el elemento de audio.
                            </audio>
                          </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Descripción Completa</h4>
                          <p className="text-gray-700 text-sm">
                            {tutorial.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4 font-heading">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Estamos agregando nuevos tutoriales constantemente. Sugiere temas que te gustaría aprender.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              Sugerir un Tutorial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutoriales;
