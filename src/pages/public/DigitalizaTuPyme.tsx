import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Smartphone,
  Award,
  BarChart3,
  MessageCircle,
  Share2,
  TrendingUp,
  DollarSign,
  Sparkles,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Store,
  Zap,
  Brain,
  Shield
} from 'lucide-react';
import Fondo from '../../assets/slider/fondo.png';
import Icono11 from '../../assets/iconos/EC-33.png';

const DigitalizaTuPyme: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Ahorra tiempo con herramientas prácticas',
      description: 'Automatiza tareas repetitivas y enfócate en lo importante'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Mejora tu atención al cliente',
      description: 'WhatsApp Business, redes sociales y respuestas profesionales'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Organiza tus finanzas e inventario',
      description: 'Control de ingresos, gastos y productos de forma simple'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Automatiza tareas repetitivas sin programar',
      description: 'Usa herramientas intuitivas sin necesidad de conocimientos técnicos'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Aprende IA aplicada a tu día a día',
      description: 'Inteligencia Artificial práctica para mejorar tu negocio'
    }
  ];

  const checkItems = [
    'Tienes un negocio o estás emprendiendo',
    'Vendes por WhatsApp, redes o en tu comunidad',
    'Quieres organizarte mejor y ganar tiempo',
    'Quieres vender más y mejorar tu comunicación',
    'Te interesa la IA pero no sabes por dónde empezar'
  ];

  const diagnosticBenefits = [
    {
      title: 'Un resultado claro',
      description: 'Sistema tipo semáforo que muestra tu nivel actual',
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: 'Tus áreas prioritarias',
      description: 'Ventas, finanzas, procesos, presencia digital',
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Una ruta recomendada',
      description: 'Módulos personalizados según tus necesidades',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: 'Consejos rápidos',
      description: 'Acciones concretas para empezar hoy mismo',
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const maturityLevels = [
    {
      level: 1,
      color: 'red',
      emoji: '🔴',
      title: 'Nivel 1: Empezando',
      description: 'Mi negocio apenas inicia en lo digital',
      recommendation: 'Módulos 1–2–3–4–5',
      objective: 'Ordenar lo básico y activar presencia digital'
    },
    {
      level: 2,
      color: 'orange',
      emoji: '🟠',
      title: 'Nivel 2: En proceso',
      description: 'Ya uso herramientas, pero puedo mejorar',
      recommendation: 'Módulos 3–4–5–6–7',
      objective: 'Mejorar ventas, finanzas y automatizar'
    },
    {
      level: 3,
      color: 'yellow',
      emoji: '🟡',
      title: 'Nivel 3: Activo',
      description: 'Mi negocio está digitalizado y listo para crecer',
      recommendation: 'Módulos 6–7–8–9',
      objective: 'Escalar con procesos y decisiones con datos'
    },
    {
      level: 4,
      color: 'green',
      emoji: '🟢',
      title: 'Nivel 4: Avanzado',
      description: 'Uso tecnología de forma estratégica',
      recommendation: 'Módulos 7–8–9 + mentoría',
      objective: 'Automatización, IA aplicada y crecimiento sostenido'
    }
  ];

  const diagnosticQuestions = [
    'Organización del negocio',
    'Tiempo en tareas repetitivas',
    'Gestión de ventas y clientes',
    'Atención al cliente',
    'Presencia digital',
    'Contenido y promoción',
    'Control de ingresos y gastos',
    'Inventario/servicios',
    'Uso de herramientas digitales/IA',
    'Plan de crecimiento digital'
  ];

  const modules = [
    {
      number: 1,
      title: '¿Qué significa digitalizar mi PyME?',
      description: 'Introducción al mundo digital para negocios pequeños y medianos'
    },
    {
      number: 2,
      title: 'Diagnóstico digital de mi negocio',
      description: 'Evaluación completa de tu estado actual y oportunidades de mejora'
    },
    {
      number: 3,
      title: 'Trabajo mejor y ahorro tiempo',
      description: 'Herramientas para optimizar procesos y aumentar productividad'
    },
    {
      number: 4,
      title: 'Digitalizo mis ventas y mi comunicación',
      description: 'WhatsApp Business, redes sociales y estrategias de venta digital'
    },
    {
      number: 5,
      title: 'Mi negocio en redes e internet',
      description: 'Construye tu presencia digital y atrae más clientes'
    },
    {
      number: 6,
      title: 'Ordeno mis cuentas e inventario',
      description: 'Control financiero e inventario con herramientas digitales'
    },
    {
      number: 7,
      title: 'Que la tecnología trabaje por mí',
      description: 'Automatización inteligente sin necesidad de programar'
    },
    {
      number: 8,
      title: 'Personas, apoyo y organización',
      description: 'Gestión de equipo y colaboración digital'
    },
    {
      number: 9,
      title: 'Mi ruta para crecer con tecnología',
      description: 'Plan estratégico personalizado para el crecimiento de tu PyME'
    }
  ];

  const programs = [
    {
      category: 'Emprendimiento',
      title: 'Digitaliza tu PyME',
      description: 'Herramientas digitales para vender y organizarte',
      icon: <Store className="w-8 h-8" />,
      link: '/digitaliza-tu-pyme',
      current: true
    },
    {
      category: 'Gobierno',
      title: 'IA para productividad pública',
      description: 'Datos, UX y servicios digitales para funcionarios',
      icon: <Users className="w-8 h-8" />,
      link: '/courses'
    },
    {
      category: 'Inclusión Digital',
      title: 'Mis Primeros Pasos Digitales',
      description: 'WhatsApp, seguridad, trámites y habilidades básicas',
      icon: <Smartphone className="w-8 h-8" />,
      link: '/primeros-pasos-digitales'
    }
  ];

  const faqs = [
    {
      question: '¿Necesito experiencia previa?',
      answer: 'No, empezamos desde cero. El programa está diseñado para personas sin conocimientos técnicos previos.'
    },
    {
      question: '¿Cuánto tiempo toma?',
      answer: '6 a 8 semanas a tu ritmo. Puedes avanzar según tu disponibilidad y dedicar el tiempo que necesites.'
    },
    {
      question: '¿Necesito computadora?',
      answer: 'No, puedes hacerlo desde tu celular. Todas las herramientas y recursos están optimizados para dispositivos móviles.'
    },
    {
      question: '¿Tiene costo?',
      answer: 'El programa es completamente gratuito. Solo necesitas compromiso y ganas de aprender.'
    },
    {
      question: '¿Qué pasa si no tengo redes sociales?',
      answer: 'Te ayudamos a crear tu presencia mínima viable. Aprenderás paso a paso cómo configurar tus perfiles.'
    },
    {
      question: '¿El diagnóstico es obligatorio?',
      answer: 'Es altamente recomendado porque te ayuda a identificar tus prioridades, pero no es obligatorio para participar en el programa.'
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
              Digitaliza tu PyME
            </h1>
            <p className="text-xl sm:text-2xl text-primary-100 max-w-3xl mx-auto mb-4">
              Tecnología sencilla e Inteligencia Artificial para trabajar mejor, vender más y organizar tu negocio
            </p>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
              No necesitas experiencia previa. Aprende a tu ritmo desde tu celular o computadora.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm">
                Sin costo
              </span>
              <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm">
                Cupo limitado
              </span>
              <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm">
                Certificado Conecta Futuro
              </span>
              <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm">
                100% práctico
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/diagnostico-digital"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-lg"
              >
                Hacer diagnóstico (5 min)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#modulos"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors text-lg"
              >
                Ver módulos del programa
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ¿Qué es Digitaliza tu PyME? */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-heading">
              Un programa hecho para negocios reales
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Digitaliza tu PyME es un programa de Conecta Futuro que ayuda a emprendedores y MIPYMES a dar pasos prácticos de digitalización: ordenar procesos, mejorar ventas, fortalecer presencia digital y usar herramientas de IA de forma sencilla y responsable.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Para quién es */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center font-heading">
              ¿Este programa es para ti?
            </h2>
            <img src={Icono11} className="w-100 h-auto mx-auto mb-8" alt="linea" />

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
              <div className="space-y-4 mb-6">
                {checkItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-900 text-sm">
                  <strong>Nota inclusiva:</strong> Funciona para emprendimientos urbanos y rurales, negocios familiares, cooperativas y asociaciones productivas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnóstico Section */}
      <div id="diagnostico" className="py-16 bg-gradient-to-b from-primary-600 to-primary-700 text-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-heading">
              Conoce el nivel digital de tu negocio en 5 minutos
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Antes de iniciar, te recomendamos hacer nuestro diagnóstico rápido. Con 10 preguntas, conocerás tu nivel de madurez digital y recibirás una ruta sugerida de módulos para aprovechar mejor el programa.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
            {diagnosticBenefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">{benefit.title}</h3>
                    <p className="text-primary-100 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/diagnostico-digital"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-primary-600 font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              Iniciar diagnóstico
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-primary-100 text-sm mt-4">
              Toma 5 minutos. No pedimos datos sensibles.
            </p>
          </div>
        </div>
      </div>

      {/* Cómo funciona el diagnóstico */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center font-heading">
              ¿Cómo funciona?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Responde 10 preguntas
                </h3>
                <p className="text-gray-600">
                  Sobre tu negocio y uso actual de tecnología
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Recibe tu resultado
                </h3>
                <p className="text-gray-600">
                  Nivel de madurez digital en escala de 1 a 4
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Te recomendamos módulos
                </h3>
                <p className="text-gray-600">
                  Según tus necesidades específicas
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
              <p className="text-gray-700 text-sm">
                <strong>Aclaración:</strong> Tus respuestas se usan para orientarte y mejorar la formación. No se publican ni se comparten.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados del diagnóstico */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center font-heading">
              Tu resultado te ubica en uno de estos niveles
            </h2>
            <img src={Icono11} className="w-100 h-auto mx-auto mb-12" alt="linea" />

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {maturityLevels.map((level) => (
                <div
                  key={level.level}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">{level.emoji}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {level.title}
                      </h3>
                      <p className="text-gray-600 text-sm italic">
                        "{level.description}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Recomendación:
                      </p>
                      <p className="text-gray-600">{level.recommendation}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Objetivo:
                      </p>
                      <p className="text-gray-600">{level.objective}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="#modulos"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                Ver módulos del programa
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Vista previa de las 10 preguntas */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center font-heading">
              ¿Qué te vamos a preguntar?
            </h2>

            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {diagnosticQuestions.map((question, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 pt-1">{question}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/diagnostico-digital"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-lg"
              >
                Hacer diagnóstico
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos del programa */}
      <div id="modulos" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center font-heading">
              Módulos de Digitaliza tu PyME
            </h2>
            <img src={Icono11} className="w-100 h-auto mx-auto mb-12" alt="linea" />

            <div className="space-y-4 mb-8">
              {modules.map((module) => {
                const isExpanded = expandedModule === module.number;
                return (
                  <div
                    key={module.number}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleModule(module.number)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                          {module.number}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {module.title}
                          </h3>
                          {isExpanded && (
                            <p className="text-gray-600 text-sm mt-1">
                              {module.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <p className="text-gray-600 pt-4">
                          {module.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-lg"
              >
                Inscribirme al curso
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Certificación */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white text-center">
              <Award className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4 font-heading">
                Certificado Conecta Futuro
              </h2>
              <p className="text-primary-100 text-lg mb-6">
                Al completar el programa y tu proyecto final, recibirás un certificado digital verificable y compartible.
              </p>

              <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Certificado verificable</h3>
                  <p className="text-primary-100 text-sm">
                    Con código único de validación
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <Share2 className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Ideal para LinkedIn</h3>
                  <p className="text-primary-100 text-sm">
                    Comparte tu logro profesional
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Nuevas habilidades</h3>
                  <p className="text-primary-100 text-sm">
                    Reconoce tu aprendizaje digital
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explora otros programas */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center font-heading">
              Conecta Futuro tiene un programa para ti
            </h2>
            <img src={Icono11} className="w-100 h-auto mx-auto mb-12" alt="linea" />

            <div className="grid md:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
                    program.current ? 'border-primary-600 border-2' : 'border-gray-100'
                  }`}
                >
                  <div className="text-primary-600 mb-4">{program.icon}</div>
                  <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                    {program.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-xl mt-2 mb-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  {program.current ? (
                    <span className="inline-flex items-center text-primary-600 font-semibold">
                      Estás aquí
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </span>
                  ) : (
                    <Link
                      to={program.link}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Ver programa
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                Ver todos los programas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center font-heading">
              Preguntas frecuentes
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isExpanded = expandedFAQ === index;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-gray-900">
                          {faq.question}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-gray-600 pl-9">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
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
            ¿Listo para digitalizar tu negocio?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Da el primer paso hacia la transformación digital de tu PyME. Comienza con el diagnóstico gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/diagnostico-digital"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-lg"
            >
              Hacer diagnóstico ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalizaTuPyme;
