import React, {useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Code, Database, Users, Brain, Globe, Shield, 
  LineChart, Laptop, Rocket, Clock, Award, CheckCircle,
  Building, Lightbulb, Smartphone, ShoppingBag, Coins,
  Heart, FileText, MessageSquare, Camera
} from 'lucide-react';

const LearningPaths = () => {
  const paths = [
    {
      id: 'gobierno-digital',
      title: 'Gobierno Digital',
      description: 'Fortalecer capacidades en funcionarios públicos y sociedad civil para diseñar, implementar y evaluar servicios públicos digitales centrados en el ciudadano, con enfoque de datos abiertos, interoperabilidad, ética e innovación.',
      icon: Building,
      bgColor: 'bg-primary-600',
      textColor: 'text-primary-600',
      hoverBg: 'hover:bg-primary-50',
      tagBg: 'bg-primary-700',
      audience: 'Funcionarios públicos, OSC, desarrolladores cívicos, periodistas de datos',
      modules: [
        {
          id: '1.1',
          name: 'Fundamentos de Gobierno Digital',
          description: 'Conceptos clave, marco legal, madurez digital, principios de diseño centrado en el usuario',
          icon: Lightbulb,
          duration: '6 horas'
        },
        {
          id: '1.2',
          name: 'Interoperabilidad y Servicios Digitales',
          description: 'Tipos de interoperabilidad, X-Road, API públicas, caso guatemalteco',
          icon: Code,
          duration: '8 horas'
        },
        {
          id: '1.3',
          name: 'Datos Abiertos y Transparencia',
          description: 'Estándares internacionales (OCDS, DCAT), portales de datos, uso ciudadano',
          icon: Database,
          duration: '6 horas'
        },
        {
          id: '1.4',
          name: 'Inteligencia Artificial y Automatización en el Gobierno',
          description: 'Casos de uso, ética, agentes IA, automatización de procesos públicos',
          icon: Brain,
          duration: '8 horas'
        },
        {
          id: '1.5',
          name: 'Diseño de Políticas Públicas Digitales',
          description: 'Laboratorios de innovación, GovTech, regulación tecnológica, inclusión',
          icon: Shield,
          duration: '6 horas'
        }
      ]
    },
    {
      id: 'emprendimiento-digital',
      title: 'Emprendimiento Digital',
      description: 'Dotar a jóvenes y mujeres emprendedoras de herramientas digitales para lanzar, fortalecer o escalar sus negocios usando tecnología, automatización y plataformas digitales.',
      icon: Rocket,
      bgColor: 'bg-[#2563eb]',
      textColor: 'text-[#2563eb]',
      hoverBg: 'hover:bg-blue-50',
      tagBg: 'bg-[#1d4ed8]',
      audience: 'Mujeres rurales, jóvenes emprendedores, microempresas, retornados',
      modules: [
        {
          id: '2.1',
          name: 'Alfabetización Digital para Emprender',
          description: 'Uso de herramientas básicas: correo, nube, buscadores, redes',
          icon: Laptop,
          duration: '6 horas'
        },
        {
          id: '2.2',
          name: 'Comercio Electrónico y Plataformas Digitales',
          description: 'Creación de tienda online, métodos de pago, marketplaces (Gumroad, Shopify, WhatsApp Business)',
          icon: ShoppingBag,
          duration: '8 horas'
        },
        {
          id: '2.3',
          name: 'Marketing Digital y Redes Sociales',
          description: 'Canva, Meta Ads, TikTok y Reels, analítica básica, narrativa de marca',
          icon: MessageSquare,
          duration: '8 horas'
        },
        {
          id: '2.4',
          name: 'Automatización para Emprendimientos',
          description: 'Herramientas no-code: Make.com, Zapier, Bolt.new, formularios inteligentes',
          icon: Brain,
          duration: '8 horas'
        },
        {
          id: '2.5',
          name: 'Finanzas Básicas y Formalización',
          description: 'Facturación digital, SAT online, formalización, acceso a microcréditos',
          icon: Coins,
          duration: '6 horas'
        }
      ]
    },
    {
      id: 'primeros-pasos-digitales',
      title: 'Mis primeros pasos digitales',
      description: 'Garantizar el acceso y uso significativo de la tecnología a personas en situación de exclusión digital (adultos mayores, pueblos indígenas, jóvenes sin conectividad), empoderándolos con competencias digitales básicas y derechos digitales.',
      icon: Heart,
      bgColor: 'bg-accent-600',
      textColor: 'text-accent-600',
      hoverBg: 'hover:bg-accent-50',
      tagBg: 'bg-accent-700',
      audience: 'Adultos mayores, pueblos indígenas, jóvenes sin conectividad',
      modules: [
        {
          id: '3.1',
          name: 'Primeros Pasos Digitales',
          description: 'Encendido de dispositivos, uso de teclas, navegación básica, WhatsApp, fotografías',
          icon: Smartphone,
          duration: '6 horas'
        },
        {
          id: '3.2',
          name: 'Ciudadanía Digital',
          description: 'Derechos en línea, protección de datos personales, ciberseguridad básica',
          icon: Shield,
          duration: '6 horas'
        },
        {
          id: '3.3',
          name: 'Acceso a Trámites y Servicios Públicos Digitales',
          description: 'Portales del gobierno, citas en línea, trámites comunes, plataformas de salud y educación',
          icon: FileText,
          duration: '6 horas'
        },
        {
          id: '3.4',
          name: 'Creación de Contenido Comunitario',
          description: 'Videos con celular, grabación de audio, narrativas comunitarias en redes sociales',
          icon: Camera,
          duration: '8 horas'
        },
        {
          id: '3.5',
          name: 'Alfabetización Digital en Idiomas Mayas',
          description: 'Terminología, uso de interfaces multilingües, derechos lingüísticos digitales',
          icon: MessageSquare,
          duration: '6 horas'
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rutas de Aprendizaje
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Desarrolla tu expertise en áreas específicas siguiendo nuestras rutas de aprendizaje diseñadas por expertos
        </p>
      </div>

      <div className="space-y-12">
        {paths.map((path) => (
          <div key={path.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Path Header */}
            <div className={`${path.bgColor} text-white p-8`}>
              <div className="flex items-start justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center mb-4">
                    <path.icon className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">{path.title}</h2>
                  </div>
                  <p className="text-lg text-white mb-4">{path.description}</p>
                  <div className={`flex items-center text-sm ${path.tagBg} rounded-full px-4 py-1 w-fit`}>
                    <Users className="w-4 h-4 mr-2" />
                    <span>Público: {path.audience}</span>
                  </div>
                </div>
                <Link
                  to={`/courses?path=${path.id}`}
                  className={`px-6 py-3 bg-white ${path.textColor} rounded-lg ${path.hoverBg} transition-colors font-semibold flex-shrink-0`}
                >
                  Comenzar ruta
                </Link>
              </div>
            </div>

            {/* Modules */}
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-6">Módulos en esta ruta:</h3>
              <div className="space-y-6">
                {path.modules.map((module) => (
                  <div key={module.id} className="flex items-start">
                    <div className={`p-3 bg-opacity-10 rounded-lg mr-4 ${path.bgColor}`}>
                      <module.icon className={`w-6 h-6 ${path.textColor}`} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {module.id} - {module.name}
                        </h4>
                        <div className="flex items-center ml-3 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{module.duration}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{module.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certificate Section */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Al completar esta ruta:</div>
                    <div className="font-semibold text-gray-900">Certificado de Especialización en {path.title}</div>
                  </div>
                  <Award className={`w-8 h-8 ${path.textColor}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPaths;