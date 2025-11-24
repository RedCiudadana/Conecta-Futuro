import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Smartphone,
  MessageCircle,
  Share2,
  Camera,
  ShoppingBag,
  CreditCard,
  Sparkles,
  FileText,
  Award,
  ArrowRight,
  Volume2,
  CheckCircle,
  Circle,
  BookOpen,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Fondo from '../../assets/slider/fondo.png';
import Icono11 from '../../assets/iconos/EC-33.png';
import { Module1Exercise } from '../../components/exercises/Module1Exercise';
import { Module2Exercise } from '../../components/exercises/Module2Exercise';
import { Module3Exercise } from '../../components/exercises/Module3Exercise';
import { Module4Exercise } from '../../components/exercises/Module4Exercise';
import { Module5Exercise } from '../../components/exercises/Module5Exercise';
import { Module6Exercise } from '../../components/exercises/Module6Exercise';
import { Module7Exercise } from '../../components/exercises/Module7Exercise';
import { Module8Exercise } from '../../components/exercises/Module8Exercise';

interface AudioResource {
  title: string;
  url: string;
}

interface Module {
  number: number;
  id: string;
  icon: React.ReactNode;
  title: string;
  topics: string[];
  exercise: string;
  videoUrl?: string;
  audioUrl?: string;
  audios?: AudioResource[];
  questions?: Question[];
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const PrimerosPasosDigitales: React.FC = () => {
  const location = useLocation();
  const [playingAudio, setPlayingAudio] = useState<number | string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [currentExam, setCurrentExam] = useState<number | null>(null);
  const [examAnswers, setExamAnswers] = useState<{[key: number]: number}>({});
  const [examResults, setExamResults] = useState<{[key: number]: boolean}>({});
  const [copiedModule, setCopiedModule] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [expandedExercises, setExpandedExercises] = useState<Set<number>>(new Set());
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('completedExercises');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [exerciseData, setExerciseData] = useState<Record<number, Record<string, string>>>(() => {
    const saved = localStorage.getItem('exerciseData');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleModule = (moduleNumber: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleNumber)) {
      newExpanded.delete(moduleNumber);
    } else {
      newExpanded.add(moduleNumber);
    }
    setExpandedModules(newExpanded);
  };

  const toggleExercise = (moduleNumber: number) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(moduleNumber)) {
      newExpanded.delete(moduleNumber);
    } else {
      newExpanded.add(moduleNumber);
    }
    setExpandedExercises(newExpanded);
  };

  const handleExerciseComplete = (moduleNumber: number, data: Record<string, string>) => {
    const newCompleted = new Set(completedExercises);
    newCompleted.add(moduleNumber);
    setCompletedExercises(newCompleted);
    localStorage.setItem('completedExercises', JSON.stringify([...newCompleted]));

    const newExerciseData = { ...exerciseData, [moduleNumber]: data };
    setExerciseData(newExerciseData);
    localStorage.setItem('exerciseData', JSON.stringify(newExerciseData));
  };

  const renderExercise = (moduleNumber: number) => {
    const isCompleted = completedExercises.has(moduleNumber);
    const savedData = exerciseData[moduleNumber];
    const onComplete = (data: Record<string, string>) => handleExerciseComplete(moduleNumber, data);

    switch (moduleNumber) {
      case 1:
        return <Module1Exercise onComplete={onComplete} isCompleted={isCompleted} savedData={savedData} />;
      case 2:
        return <Module2Exercise onComplete={onComplete} isCompleted={isCompleted} savedData={savedData} />;
      case 3:
        return <Module3Exercise onComplete={onComplete} isCompleted={isCompleted} savedData={savedData} />;
      case 4:
        return <Module4Exercise onComplete={onComplete} isCompleted={isCompleted} savedData={savedData} />;
      case 5:
        return <Module5Exercise onComplete={onComplete} isCompleted={isCompleted} savedData={savedData} />;
      case 6:
        return <Module6Exercise onComplete={onComplete} isCompleted={isCompleted} savedData={savedData} />;
      case 7:
        return <Module7Exercise onComplete={onComplete} isCompleted={isCompleted} savedData={savedData} />;
      case 8:
        return <Module8Exercise onComplete={onComplete} isCompleted={isCompleted} savedData={savedData} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  const shareOnSocialMedia = (moduleId: string, moduleTitle: string, platform: string) => {
    const url = `https://escuela.redciudadana.org/primeros-pasos-digitales#${moduleId}`;
    const text = `Te invito a ver el módulo "${moduleTitle}" del curso Mis Primeros Pasos Digitales`;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyModuleLink = (moduleId: string, moduleTitle: string) => {
    const url = `https://escuela.redciudadana.org/primeros-pasos-digitales#${moduleId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedModule(moduleId);
      setTimeout(() => setCopiedModule(null), 2000);
    });
  };

  const modules: Module[] = [
    {
      number: 1,
      id: 'modulo-1-introduccion',
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Introducción al mundo digital',
      topics: [
        '¿Qué es el internet y cómo funciona en el teléfono?',
        'Uso básico de smartphone: botones, configuración, WiFi, datos móviles',
        'Conceptos básicos: cuenta de Google, correo electrónico'
      ],
      exercise: 'Enviar un correo y un mensaje por WhatsApp',
      videoUrl: 'https://youtu.be/gU6sa65YEeM?si=QG407L68K-QtFXSv',
      audios: [
        {
          title: '¿Qué es lo digital?',
          url: 'https://redciudadana.github.io/RecursosMisPrimerosPasosDigitales/Audios/Modulo1/Mis-Primeros-Pasos%20Digitales-Modulo1-Audio1.mp3'
        },
        {
          title: '¿Qué es internet?',
          url: 'https://redciudadana.github.io/RecursosMisPrimerosPasosDigitales/Audios/Modulo1/Mis-Primeros-Pasos%20Digitales-Modulo1-Audio2.mp3'
        }
      ],
      questions: [
        {
          question: '¿Qué es el internet?',
          options: ['Una red de computadoras conectadas', 'Un programa', 'Un teléfono', 'Una aplicación'],
          correctAnswer: 0
        },
        {
          question: '¿Para qué sirve el WiFi?',
          options: ['Para hacer llamadas', 'Para conectarse a internet sin cables', 'Para tomar fotos', 'Para enviar mensajes'],
          correctAnswer: 1
        },
        {
          question: '¿Qué es una cuenta de Google?',
          options: ['Un juego', 'Una tienda', 'Una cuenta para acceder a servicios de Google', 'Un navegador'],
          correctAnswer: 2
        }
      ]
    },
    {
      number: 2,
      id: 'modulo-2-comunicacion',
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Comunicación digital con clientes',
      topics: [
        'WhatsApp como herramienta de ventas',
        'Crear un perfil de WhatsApp Business',
        'Uso de estados, respuestas automáticas y etiquetas para clientes'
      ],
      exercise: 'Crear catálogo en WhatsApp Business',
      videoUrl: 'https://youtu.be/gU6sa65YEeM?si=QG407L68K-QtFXSv',
      audioUrl: 'https://example.com/audio/modulo2.mp3',
      questions: [
        {
          question: '¿Qué es WhatsApp Business?',
          options: ['Una red social', 'Una herramienta para negocios', 'Un juego', 'Un navegador'],
          correctAnswer: 1
        },
        {
          question: '¿Para qué sirven las etiquetas en WhatsApp Business?',
          options: ['Para decorar', 'Para organizar clientes', 'Para jugar', 'Para navegar'],
          correctAnswer: 1
        },
        {
          question: '¿Qué ventaja tiene WhatsApp Business sobre WhatsApp normal?',
          options: ['Es más rápido', 'Permite crear catálogos de productos', 'Es gratuito', 'Tiene más juegos'],
          correctAnswer: 1
        }
      ]
    },
    {
      number: 3,
      id: 'modulo-3-redes-sociales',
      icon: <Share2 className="w-8 h-8" />,
      title: 'Redes sociales para mi negocio',
      topics: [
        '¿Por qué estar en redes sociales?',
        'Crear una página de Facebook para negocios',
        'Diferencia entre perfil personal y página'
      ],
      exercise: 'Publicar una foto de producto con precio y descripción',
      videoUrl: 'https://youtu.be/gU6sa65YEeM?si=QG407L68K-QtFXSv',
      audioUrl: 'https://example.com/audio/modulo3.mp3',
      questions: [
        {
          question: '¿Cuál es la diferencia entre un perfil personal y una página de Facebook?',
          options: ['No hay diferencia', 'La página es para negocios', 'El perfil es de pago', 'La página no permite publicaciones'],
          correctAnswer: 1
        },
        {
          question: '¿Por qué es importante estar en redes sociales para un negocio?',
          options: ['Para jugar', 'Para llegar a más clientes', 'No es importante', 'Para ver fotos'],
          correctAnswer: 1
        }
      ]
    },
    {
      number: 4,
      id: 'modulo-4-contenido',
      icon: <Camera className="w-8 h-8" />,
      title: 'Contenido que vende',
      topics: [
        'Cómo tomar fotos atractivas con el celular',
        'Uso de aplicaciones sencillas (Canva, CapCut) para editar imágenes y videos',
        'Tips para escribir descripciones simples y llamativas'
      ],
      exercise: 'Diseñar un flyer digital para un producto',
      videoUrl: 'https://youtu.be/gU6sa65YEeM?si=QG407L68K-QtFXSv',
      audioUrl: 'https://example.com/audio/modulo4.mp3',
      questions: [
        {
          question: '¿Qué elemento es más importante en una foto de producto?',
          options: ['Que sea oscura', 'Buena iluminación y claridad', 'Que tenga filtros', 'Que sea en blanco y negro'],
          correctAnswer: 1
        },
        {
          question: '¿Para qué sirve Canva?',
          options: ['Para navegar', 'Para diseñar imágenes y contenido', 'Para hacer videollamadas', 'Para enviar correos'],
          correctAnswer: 1
        }
      ]
    },
    {
      number: 5,
      id: 'modulo-5-estrategias',
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Estrategias de ventas en línea',
      topics: [
        'Cómo responder a clientes de forma clara y rápida',
        'Métodos de confianza: mostrar producto, precio, forma de entrega',
        'Promociones simples: descuentos, combos, rifas'
      ],
      exercise: 'Simular una venta en WhatsApp',
      videoUrl: 'https://youtu.be/gU6sa65YEeM?si=QG407L68K-QtFXSv',
      audioUrl: 'https://example.com/audio/modulo5.mp3',
      questions: [
        {
          question: '¿Qué información es importante dar al cliente en una venta?',
          options: ['Solo el precio', 'Producto, precio y forma de entrega', 'Solo el nombre', 'Nada'],
          correctAnswer: 1
        },
        {
          question: '¿Qué es una promoción?',
          options: ['Un descuento o beneficio especial', 'Un reclamo', 'Una devolución', 'Un error'],
          correctAnswer: 0
        }
      ]
    },
    {
      number: 6,
      id: 'modulo-6-dinero-digital',
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Manejo básico de dinero digital',
      topics: [
        'Introducción a pagos digitales: transferencias, billeteras electrónicas',
        'Cómo enviar y recibir pagos desde el celular',
        'Seguridad digital: cómo evitar estafas'
      ],
      exercise: 'Simular una venta con pago digital',
      videoUrl: 'https://youtu.be/gU6sa65YEeM?si=QG407L68K-QtFXSv',
      audioUrl: 'https://example.com/audio/modulo6.mp3',
      questions: [
        {
          question: '¿Qué es una billetera electrónica?',
          options: ['Una cartera física', 'Una app para manejar dinero digital', 'Un juego', 'Una red social'],
          correctAnswer: 1
        },
        {
          question: '¿Cómo puedes evitar estafas digitales?',
          options: ['Compartiendo contraseñas', 'Verificando fuentes y siendo cauteloso', 'Dando datos a cualquiera', 'No usando internet'],
          correctAnswer: 1
        }
      ]
    },
    {
      number: 7,
      id: 'modulo-7-identidad',
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Construyendo mi identidad digital',
      topics: [
        'Cómo dar confianza: nombre, logo, colores, mensajes coherentes',
        'Usar testimonios y fotos de clientes satisfechos',
        'Diferencia entre vender un producto y vender una marca'
      ],
      exercise: 'Crear una mini identidad de marca con Canva',
      videoUrl: 'https://youtu.be/gU6sa65YEeM?si=QG407L68K-QtFXSv',
      audioUrl: 'https://example.com/audio/modulo7.mp3',
      questions: [
        {
          question: '¿Qué es una identidad de marca?',
          options: ['Un documento', 'El conjunto de elementos visuales y mensajes que representan tu negocio', 'Un número', 'Una dirección'],
          correctAnswer: 1
        },
        {
          question: '¿Por qué son importantes los testimonios de clientes?',
          options: ['No son importantes', 'Generan confianza y credibilidad', 'Solo ocupan espacio', 'Son obligatorios por ley'],
          correctAnswer: 1
        }
      ]
    },
    {
      number: 8,
      id: 'modulo-8-plan-negocio',
      icon: <FileText className="w-8 h-8" />,
      title: 'Mi plan de negocio digital',
      topics: [
        'Paso a paso: definir producto, precio, promoción y entrega',
        'Cómo organizar contactos de clientes en Excel/hoja de papel',
        'Revisión de casos exitosos locales'
      ],
      exercise: 'Cada emprendedora diseña su plan básico de ventas digitales',
      videoUrl: 'https://youtu.be/gU6sa65YEeM?si=QG407L68K-QtFXSv',
      audioUrl: 'https://example.com/audio/modulo8.mp3',
      questions: [
        {
          question: '¿Qué elementos debe incluir un plan de ventas digitales?',
          options: ['Solo el producto', 'Producto, precio, promoción y forma de entrega', 'Solo el nombre del negocio', 'Nada en especial'],
          correctAnswer: 1
        },
        {
          question: '¿Por qué es importante organizar contactos de clientes?',
          options: ['No es importante', 'Para dar seguimiento y mantener relación con ellos', 'Es obligatorio', 'Para eliminarlos'],
          correctAnswer: 1
        },
        {
          question: '¿Qué has aprendido que aplicarás en tu negocio?',
          options: ['Nada', 'Herramientas digitales para vender mejor', 'A jugar', 'A navegar sin propósito'],
          correctAnswer: 1
        }
      ]
    }
  ];


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
                📚 8 Módulos
              </span>
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
            {modules.map((module) => {
              const isExpanded = expandedModules.has(module.number);
              return (
              <div
                key={module.number}
                id={module.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden scroll-mt-24"
              >
                {/* Module Header */}
                <div className="p-6 bg-gray-50">
                  <div
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleModule(module.number)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        {module.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-gray-500 mb-1">
                          Módulo {module.number}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {module.title}
                        </h3>
                      </div>
                    </div>
                    <button
                      className="ml-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      aria-label={isExpanded ? 'Contraer módulo' : 'Expandir módulo'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Social Share Buttons */}
                  {isExpanded && (
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600 mr-2">Compartir módulo:</span>
                    <button
                      onClick={() => shareOnSocialMedia(module.id, module.title, 'facebook')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      title="Compartir en Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                      <span className="hidden sm:inline">Facebook</span>
                    </button>
                    <button
                      onClick={() => shareOnSocialMedia(module.id, module.title, 'twitter')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm"
                      title="Compartir en Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                      <span className="hidden sm:inline">Twitter</span>
                    </button>
                    <button
                      onClick={() => shareOnSocialMedia(module.id, module.title, 'linkedin')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                      title="Compartir en LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </button>
                    <button
                      onClick={() => shareOnSocialMedia(module.id, module.title, 'whatsapp')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      title="Compartir en WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                    <button
                      onClick={() => copyModuleLink(module.id, module.title)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                        copiedModule === module.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title="Copiar enlace"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{copiedModule === module.id ? 'Copiado!' : 'Copiar enlace'}</span>
                    </button>
                  </div>
                  )}
                </div>

                {/* Module Content */}
                {isExpanded && (
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
                          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                            <ReactPlayer
                              url={module.videoUrl}
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

                      {module.audios && module.audios.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-primary-600" />
                            🎧 Audios del módulo:
                          </h4>
                          <div className="space-y-4">
                            {module.audios.map((audio, audioIndex) => (
                              <div key={audioIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                  {audio.title}
                                </p>
                                <ReactPlayer
                                  url={audio.url}
                                  width="100%"
                                  height="50px"
                                  controls={true}
                                  playing={playingAudio === `${module.number}-${audioIndex}`}
                                  onPlay={() => setPlayingAudio(`${module.number}-${audioIndex}`)}
                                  onPause={() => setPlayingAudio(null)}
                                  onEnded={() => setPlayingAudio(null)}
                                  config={{
                                    file: {
                                      attributes: {
                                        controlsList: 'nodownload'
                                      }
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {module.audioUrl && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-primary-600" />
                            🎧 Audio del módulo:
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <ReactPlayer
                              url={module.audioUrl}
                              width="100%"
                              height="50px"
                              controls={true}
                              playing={playingAudio === module.number}
                              onPlay={() => setPlayingAudio(module.number)}
                              onPause={() => setPlayingAudio(null)}
                              onEnded={() => setPlayingAudio(null)}
                              config={{
                                file: {
                                  attributes: {
                                    controlsList: 'nodownload'
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        <button
                          onClick={() => toggleExercise(module.number)}
                          className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 border-2 border-green-500 rounded-lg px-6 py-4 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-green-600" />
                            <div className="text-left">
                              <h4 className="font-semibold text-green-900 text-lg">
                                ✏️ Ejercicio Práctico
                              </h4>
                              <p className="text-sm text-green-700">
                                {completedExercises.has(module.number) ? '✅ Completado' : 'Haz clic para practicar'}
                              </p>
                            </div>
                          </div>
                          {expandedExercises.has(module.number) ? (
                            <ChevronUp className="w-6 h-6 text-green-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-green-600" />
                          )}
                        </button>

                        {expandedExercises.has(module.number) && (
                          <div className="mt-4">
                            {renderExercise(module.number)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>
      </div>

      {/* Sección de Evaluación y Práctica */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-heading">
                Aprende haciendo, no solo viendo
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Completa las evaluaciones de cada módulo para validar tu aprendizaje y obtener tu diploma
              </p>
              <img src={Icono11} className="w-100 h-auto mx-auto mt-4" alt="linea" />
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                  Progreso del Curso
                </h3>
                <span className="text-2xl font-bold text-primary-600">
                  {completedModules.size} / {modules.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-primary-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(completedModules.size / modules.length) * 100}%` }}
                />
              </div>
              <p className="text-gray-600 text-center">
                Completa todas las evaluaciones para generar tu diploma
              </p>
            </div>

            {/* Module Exams */}
            <div className="space-y-4">
              {modules.map((module) => {
                const isCompleted = completedModules.has(module.number);
                const isCurrentExam = currentExam === module.number;
                const hasResult = examResults[module.number] !== undefined;
                const isPreviousModuleCompleted = module.number === 1 || completedModules.has(module.number - 1);
                const isLocked = !isPreviousModuleCompleted;

                return (
                  <div
                    key={`exam-${module.number}`}
                    className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
                      isLocked ? 'border-gray-200 opacity-60' : 'border-gray-100'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isCompleted ? 'bg-green-500' : isLocked ? 'bg-gray-400' : 'bg-gray-300'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Circle className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Evaluación Módulo {module.number}
                            </h3>
                            <p className="text-gray-600">{module.title}</p>
                          </div>
                        </div>
                        {!isCompleted && !isCurrentExam && !isLocked && (
                          <button
                            onClick={() => setCurrentExam(module.number)}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Iniciar Evaluación
                          </button>
                        )}
                        {!isCompleted && !isCurrentExam && isLocked && (
                          <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-semibold flex items-center gap-2">
                            🔒 Bloqueado
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                            ✓ Completado
                          </span>
                        )}
                      </div>

                      {/* Locked Message */}
                      {isLocked && (
                        <div className="border-t border-gray-100 pt-6 mt-6">
                          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                            <p className="text-yellow-800 flex items-center gap-2">
                              <span className="text-2xl">🔒</span>
                              <span>
                                Completa la evaluación del <strong>Módulo {module.number - 1}</strong> para desbloquear este módulo.
                              </span>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Exam Questions */}
                      {isCurrentExam && module.questions && (
                        <div className="border-t border-gray-100 pt-6 mt-6">
                          <h4 className="font-semibold text-gray-900 mb-4">
                            Responde las siguientes preguntas:
                          </h4>
                          <div className="space-y-6">
                            {module.questions.map((q, qIndex) => (
                              <div key={qIndex} className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-900 mb-3">
                                  {qIndex + 1}. {q.question}
                                </p>
                                <div className="space-y-2">
                                  {q.options.map((option, oIndex) => (
                                    <label
                                      key={oIndex}
                                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                        examAnswers[qIndex] === oIndex
                                          ? 'border-primary-600 bg-primary-50'
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${module.number}-${qIndex}`}
                                        value={oIndex}
                                        checked={examAnswers[qIndex] === oIndex}
                                        onChange={() => setExamAnswers({...examAnswers, [qIndex]: oIndex})}
                                        className="mr-3"
                                      />
                                      <span className="text-gray-700">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-4 mt-6">
                            <button
                              onClick={() => {
                                const allAnswered = module.questions?.every((_, idx) => examAnswers[idx] !== undefined);
                                if (allAnswered) {
                                  const allCorrect = module.questions?.every((q, idx) => examAnswers[idx] === q.correctAnswer);
                                  if (allCorrect) {
                                    setCompletedModules(new Set([...completedModules, module.number]));
                                    setExamResults({...examResults, [module.number]: true});
                                  } else {
                                    setExamResults({...examResults, [module.number]: false});
                                  }
                                  setCurrentExam(null);
                                  setExamAnswers({});
                                } else {
                                  alert('Por favor responde todas las preguntas');
                                }
                              }}
                              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                            >
                              Enviar Respuestas
                            </button>
                            <button
                              onClick={() => {
                                setCurrentExam(null);
                                setExamAnswers({});
                              }}
                              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Result Message */}
                      {hasResult && !isCurrentExam && !isCompleted && (
                        <div className="border-t border-gray-100 pt-6 mt-6">
                          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-800">
                              No aprobaste esta evaluación. Revisa el contenido del módulo e inténtalo nuevamente.
                            </p>
                            <button
                              onClick={() => {
                                setCurrentExam(module.number);
                                setExamResults({...examResults, [module.number]: undefined});
                              }}
                              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Reintentar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Generate Diploma */}
            {completedModules.size === modules.length && (
              <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white text-center">
                <Award className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  ¡Felicitaciones! Has completado todas las evaluaciones
                </h3>
                <p className="text-primary-100 mb-6">
                  Ahora puedes solicitar tu diploma digital
                </p>
                <a
                  href="https://forms.gle/knhEDnwWoUSe4rts9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
                >
                  <Award className="w-5 h-5" />
                  Solicitar mi Certificado
                </a>
              </div>
            )}
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
