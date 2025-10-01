import React, {useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Code, Database, Users, Brain, Globe, Shield, 
  LineChart, Laptop, Rocket, Clock, Award, CheckCircle,
  Building, Lightbulb, Smartphone, ShoppingBag, Coins,
  Heart, FileText, MessageSquare, Camera
} from 'lucide-react';
import Slider from '../../assets/slider/learningpaths.png';

const LearningPaths = () => {
  const paths = [
    {
      id: 'gobierno-digital',
      title: 'Gobierno Digital',
      description: 'Fortalecer capacidades en funcionarios públicos y sociedad civil para diseñar, implementar y evaluar servicios públicos digitales centrados en el ciudadano, con enfoque de datos abiertos, interoperabilidad, ética e innovación.',
      icon: Building,
      bgColor: 'bg-black',
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
      id: 'primeros-pasos-digitales',
      title: 'Mis primeros pasos digitales',
      description: 'Garantizar el acceso y uso significativo de la tecnología a personas en situación de exclusión digital (adultos mayores, pueblos indígenas, jóvenes sin conectividad), empoderándolos con competencias digitales básicas y derechos digitales.',
      icon: Heart,
      bgColor: 'bg-black',
      textColor: 'text-accent-600',
      hoverBg: 'hover:bg-accent-50',
      tagBg: 'bg-accent-700',
      audience: 'Adultos mayores, pueblos indígenas, jóvenes sin conectividad',
      modules: [
        {
          id: '1',
          name: 'Introducción al mundo digital',
          description: '¿Qué es el internet y cómo funciona en el teléfono? • Uso básico de smartphone: botones, configuración, WiFi, datos móviles • Conceptos básicos: cuenta de Google, correo electrónico • Ejercicio práctico: enviar un correo y un mensaje por WhatsApp',
          icon: Smartphone,
          duration: '2 horas'
        },
        {
          id: '2',
          name: 'Comunicación digital con clientes',
          description: 'WhatsApp como herramienta de ventas • Crear un perfil de WhatsApp Business • Uso de estados, respuestas automáticas y etiquetas para clientes • Ejercicio práctico: crear catálogo en WhatsApp Business',
          icon: MessageSquare,
          duration: '2 horas'
        },
        {
          id: '3',
          name: 'Redes sociales para mi negocio',
          description: '¿Por qué estar en redes sociales? • Crear una página de Facebook para negocios • Diferencia entre perfil personal y página • Ejercicio práctico: publicar una foto de producto con precio y descripción',
          icon: Globe,
          duration: '2 horas'
        },
        {
          id: '4',
          name: 'Contenido que vende',
          description: 'Cómo tomar fotos atractivas con el celular • Uso de aplicaciones sencillas (Canva, CapCut) para editar imágenes y videos • Tips para escribir descripciones simples y llamativas • Ejercicio práctico: diseñar un flyer digital para un producto',
          icon: Camera,
          duration: '2 horas'
        },
        {
          id: '5',
          name: 'Estrategias de ventas en línea',
          description: 'Cómo responder a clientes de forma clara y rápida • Métodos de confianza: mostrar producto, precio, forma de entrega • Promociones simples: descuentos, combos, rifas • Ejercicio práctico: simular una venta en WhatsApp',
          icon: ShoppingBag,
          duration: '2 horas'
        },
        {
          id: '6',
          name: 'Manejo básico de dinero digital',
          description: 'Introducción a pagos digitales: transferencias, billeteras electrónicas • Cómo enviar y recibir pagos desde el celular • Seguridad digital: cómo evitar estafas • Ejercicio práctico: simular una venta con pago digital',
          icon: Coins,
          duration: '2 horas'
        },
        {
          id: '7',
          name: 'Construyendo mi identidad digital',
          description: 'Cómo dar confianza: nombre, logo, colores, mensajes coherentes • Usar testimonios y fotos de clientes satisfechos • Diferencia entre vender un producto y vender una marca • Ejercicio práctico: crear una mini identidad de marca con Canva',
          icon: Lightbulb,
          duration: '2 horas'
        },
        {
          id: '8',
          name: 'Mi plan de negocio digital',
          description: 'Paso a paso: definir producto, precio, promoción y entrega • Cómo organizar contactos de clientes en Excel/hoja de papel • Revisión de casos exitosos locales • Ejercicio práctico: cada emprendedora diseña su plan básico de ventas digitales',
          icon: FileText,
          duration: '2 horas'
        }
      ]
    }
  ];

  return (
    <div >

      {/* Hero */}
      <div className="from-primary-900 to-primary-800 text-white" style={{ backgroundImage: `url(${Slider})` }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Rutas de Aprendizaje</h1>
            <p className="text-xl text-primary-100 mb-8">
              Desarrolla tu expertise en áreas específicas siguiendo nuestras rutas de aprendizaje diseñadas por expertos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="space-y-12">
          {paths.map((path) => (
            <div key={path.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Path Header */}
              <div className={`${path.bgColor} text-white p-8`}>
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
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
                        <module.icon className={`w-6 h-6 text-white`} />
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
    </div>

  );
};

export default LearningPaths;