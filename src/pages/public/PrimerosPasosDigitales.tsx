import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  MessageCircle,
  Share2,
  Camera,
  ShoppingBag,
  CreditCard,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
  Award,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Fondo from '../../assets/slider/fondo.png';
import Icono11 from '../../assets/iconos/EC-33.png';

interface Module {
  number: number;
  icon: React.ReactNode;
  title: string;
  duration: string;
  topics: string[];
  exercise: string;
  videoUrl?: string;
}

const PrimerosPasosDigitales: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const modules: Module[] = [
    {
      number: 1,
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Introducción al mundo digital',
      duration: '2 horas',
      topics: [
        '¿Qué es el internet y cómo funciona en el teléfono?',
        'Uso básico de smartphone: botones, configuración, WiFi, datos móviles',
        'Conceptos básicos: cuenta de Google, correo electrónico'
      ],
      exercise: 'Enviar un correo y un mensaje por WhatsApp'
    },
    {
      number: 2,
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Comunicación digital con clientes',
      duration: '2 horas',
      topics: [
        'WhatsApp como herramienta de ventas',
        'Crear un perfil de WhatsApp Business',
        'Uso de estados, respuestas automáticas y etiquetas para clientes'
      ],
      exercise: 'Crear catálogo en WhatsApp Business'
    },
    {
      number: 3,
      icon: <Share2 className="w-8 h-8" />,
      title: 'Redes sociales para mi negocio',
      duration: '2 horas',
      topics: [
        '¿Por qué estar en redes sociales?',
        'Crear una página de Facebook para negocios',
        'Diferencia entre perfil personal y página'
      ],
      exercise: 'Publicar una foto de producto con precio y descripción'
    },
    {
      number: 4,
      icon: <Camera className="w-8 h-8" />,
      title: 'Contenido que vende',
      duration: '2 horas',
      topics: [
        'Cómo tomar fotos atractivas con el celular',
        'Uso de aplicaciones sencillas (Canva, CapCut) para editar imágenes y videos',
        'Tips para escribir descripciones simples y llamativas'
      ],
      exercise: 'Diseñar un flyer digital para un producto'
    },
    {
      number: 5,
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Estrategias de ventas en línea',
      duration: '2 horas',
      topics: [
        'Cómo responder a clientes de forma clara y rápida',
        'Métodos de confianza: mostrar producto, precio, forma de entrega',
        'Promociones simples: descuentos, combos, rifas'
      ],
      exercise: 'Simular una venta en WhatsApp'
    },
    {
      number: 6,
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Manejo básico de dinero digital',
      duration: '2 horas',
      topics: [
        'Introducción a pagos digitales: transferencias, billeteras electrónicas',
        'Cómo enviar y recibir pagos desde el celular',
        'Seguridad digital: cómo evitar estafas'
      ],
      exercise: 'Simular una venta con pago digital'
    },
    {
      number: 7,
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Construyendo mi identidad digital',
      duration: '2 horas',
      topics: [
        'Cómo dar confianza: nombre, logo, colores, mensajes coherentes',
        'Usar testimonios y fotos de clientes satisfechos',
        'Diferencia entre vender un producto y vender una marca'
      ],
      exercise: 'Crear una mini identidad de marca con Canva'
    },
    {
      number: 8,
      icon: <FileText className="w-8 h-8" />,
      title: 'Mi plan de negocio digital',
      duration: '2 horas',
      topics: [
        'Paso a paso: definir producto, precio, promoción y entrega',
        'Cómo organizar contactos de clientes en Excel/hoja de papel',
        'Revisión de casos exitosos locales'
      ],
      exercise: 'Cada emprendedora diseña su plan básico de ventas digitales'
    }
  ];

  const toggleModule = (moduleNumber: number) => {
    setExpandedModule(expandedModule === moduleNumber ? null : moduleNumber);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${Fondo})` }}
      >
        <div className="relative z-10 container mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <img
                src="/logo/redciudadana.png"
                alt="Conecta Futuro"
                className="h-16 mx-auto mb-4"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-6">
              Mis Primeros Pasos Digitales
            </h1>
            <p className="text-xl sm:text-2xl text-primary-100 max-w-2xl mx-auto mb-8">
              Aprende lo básico para emprender en línea con herramientas digitales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <span className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold text-lg">
                🎉 Curso Gratuito
              </span>
              <span className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold text-lg">
                📱 100% Práctico
              </span>
              <span className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold text-lg">
                ⏱️ 16 horas totales
              </span>
            </div>
            <div className="flex justify-center">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeibvYzAAGt7-60uDTi2BY9uhSkY1Kq7iaSYEdcH3PomNIakQ/viewform?usp=sharing&ouid=102614004827171520067"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg border-2 border-white"
              >
                Registro
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción del Curso */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-heading">
              ¿Para quién es este curso?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Este curso está diseñado especialmente para emprendedoras con pocos conocimientos digitales
              que quieren aprender a usar herramientas básicas para vender sus productos en línea.
              No necesitas experiencia previa, solo ganas de aprender y un teléfono celular.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sin experiencia necesaria</h3>
                <p className="text-gray-600 text-sm">Empezamos desde cero, paso a paso</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Certificado incluido</h3>
                <p className="text-gray-600 text-sm">Comparte tu logro al terminar</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ejercicios prácticos</h3>
                <p className="text-gray-600 text-sm">Aprende haciendo, no solo viendo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos del Curso */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Contenido del Curso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              8 módulos prácticos para transformar tu negocio
            </p>
            <img src={Icono11} className="w-100 h-auto mx-auto mt-4" alt="linea" />
          </div>

          <div className="max-w-5xl mx-auto space-y-4">
            {modules.map((module) => (
              <div
                key={module.number}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.number)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {module.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-500 mb-1">
                        Módulo {module.number}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {module.title}
                      </h3>
                      <div className="text-sm text-gray-600">
                        {module.duration}
                      </div>
                    </div>
                  </div>
                  {expandedModule === module.number ? (
                    <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {/* Module Content */}
                {expandedModule === module.number && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        📚 Contenidos:
                      </h4>
                      <ul className="space-y-2 mb-6">
                        {module.topics.map((topic, index) => (
                          <li key={index} className="flex items-start text-gray-600">
                            <span className="text-primary-600 mr-2">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>

                      {module.videoUrl && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            🎥 Video explicativo:
                          </h4>
                          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Video del módulo {module.number}</span>
                          </div>
                        </div>
                      )}

                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          ✏️ Ejercicio Práctico:
                        </h4>
                        <p className="text-green-800">{module.exercise}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de Logro */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-heading">
              ¡Felicitaciones!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Al completar este curso habrás dado tus primeros pasos digitales y estarás lista
              para emprender en línea con confianza y las herramientas adecuadas.
            </p>
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                🎓 Recibirás tu diploma digital
              </h3>
              <p className="text-gray-600 mb-4">
                Un certificado que valida tu aprendizaje y que puedes compartir con orgullo
                en tus redes sociales y con tus clientes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div
        className="text-white py-20"
        style={{ backgroundImage: `url(${Fondo})` }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-heading">
            ¿Lista para comenzar tu transformación digital?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Este es solo el comienzo. Tenemos más cursos gratuitos esperándote para seguir creciendo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-black text-white font-semibold transition-colors text-lg"
            >
              Ver todos los cursos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-gray-900 font-semibold transition-colors text-lg"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimerosPasosDigitales;
