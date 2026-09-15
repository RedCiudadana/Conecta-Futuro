import React, { useState, useEffect } from 'react';
import Seo from '../../components/Seo';
import { SEO, SITE_URL } from '../../config/seo';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Target,
  Globe,
  BarChart3,
  Layers,
  Smartphone,
  Store,
  Building2,
  HeartHandshake,
  GraduationCap,
  Sparkles,
  Search,
  Lightbulb,
  TrendingUp,
  Repeat,
  Server,
  Handshake,
} from 'lucide-react';
import SliderImage1 from '../../assets/slider/whatsapp_image_2025-12-18_at_12.17.25_pm.jpeg';
import SliderImage2 from '../../assets/slider/whatsapp_image_2025-11-12_at_6.29.32_am.jpeg';
import SliderImage3 from '../../assets/slider/whatsapp_image_2025-09-26_at_12.02.22_pm.jpeg';
import Icono1 from '../../assets/iconos/EC-23.png';
import Icono2 from '../../assets/iconos/EC-24.png';
import Icono3 from '../../assets/iconos/EC-25.png';
import Icono4 from '../../assets/iconos/EC-26.png';
import Icono5 from '../../assets/iconos/EC-27.png';
import Icono6 from '../../assets/iconos/EC-28.png';
import Icono7 from '../../assets/iconos/EC-29.png';
import Icono8 from '../../assets/iconos/EC-30.png';
import Icono9 from '../../assets/iconos/EC-31.png';
import Icono10 from '../../assets/iconos/EC-32.png';
import Icono11 from '../../assets/iconos/EC-33.png';
import Fondo from '../../assets/slider/fondo.png';
import ConectaFuturoPopup from '../../components/ui/ConectaFuturoPopup';

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      eyebrow: 'Tecnología para crear oportunidades',
      title: 'Aprende habilidades digitales que puedes aplicar desde hoy',
      description:
        'Escuela Red Ciudadana acerca formación práctica, herramientas y recursos digitales a personas, emprendedores y organizaciones para fortalecer sus capacidades, mejorar su productividad y participar en las oportunidades de la economía digital.',
      buttonText: 'Explorar oportunidades de aprendizaje',
      buttonLink: '/courses',
      image: SliderImage1,
    },
    {
      eyebrow: 'Aprende. Aplica. Avanza.',
      title: 'No es solo aprender. Es utilizar la tecnología para crear oportunidades.',
      description:
        'Combinamos contenidos accesibles, herramientas digitales, ejercicios prácticos y acompañamiento para que los conocimientos se conviertan en capacidades que puedes aplicar en tu vida, trabajo o emprendimiento.',
      buttonText: 'Conoce cómo funciona',
      buttonLink: '/courses',
      image: SliderImage2,
    },
    {
      eyebrow: 'Formación + Tecnología + Comunidad',
      title: 'Herramientas, recursos y acompañamiento en un solo lugar',
      description:
        'Explora cursos, directorios de inteligencia artificial, banco de prompts, diagnóstico digital y más. Todo diseñado para ayudarte a desarrollar habilidades que puedes usar desde hoy.',
      buttonText: 'Explorar cursos y recursos',
      buttonLink: '/courses',
      image: SliderImage3,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const indicators = [
    { label: 'Personas formadas', value: '10,000+', icon: <Users className="w-6 h-6" /> },
    { label: 'Cursos y recursos', value: '50+', icon: <BookOpen className="w-6 h-6" /> },
    { label: 'Territorios alcanzados', value: '15+', icon: <Globe className="w-6 h-6" /> },
  ];

  const problems = [
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: 'Brecha de habilidades',
      description:
        'La tecnología evoluciona más rápido que las oportunidades de formación disponibles para muchas personas.',
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: 'Brecha de acceso',
      description:
        'La ubicación, el costo y la falta de acompañamiento pueden limitar el acceso a capacitación de calidad.',
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Brecha de aplicación',
      description:
        'Aprender una herramienta no siempre significa saber utilizarla para resolver problemas reales.',
    },
  ];

  const processSteps = [
    { title: 'Aprende', description: 'Comprende herramientas y conceptos.', icon: <BookOpen className="w-8 h-8" /> },
    { title: 'Practica', description: 'Resuelve ejercicios y situaciones reales.', icon: <Sparkles className="w-8 h-8" /> },
    { title: 'Aplica', description: 'Utiliza lo aprendido en tu trabajo, emprendimiento u organización.', icon: <Target className="w-8 h-8" /> },
    { title: 'Avanza', description: 'Continúa desarrollando nuevas habilidades.', icon: <TrendingUp className="w-8 h-8" /> },
  ];

  const modelComponents = [
    { icon: <BookOpen className="w-7 h-7" />, title: 'Formación práctica', description: 'Aprendizajes diseñados alrededor de problemas y necesidades reales.' },
    { icon: <CheckCircle className="w-7 h-7" />, title: 'Accesible', description: 'Opciones gratuitas y de bajo costo que reducen barreras de entrada.' },
    { icon: <Smartphone className="w-7 h-7" />, title: 'Digital', description: 'Tecnología que permite aprender desde diferentes lugares y dispositivos.' },
    { icon: <Layers className="w-7 h-7" />, title: 'Modular', description: 'Cursos y recursos que pueden adaptarse a diferentes niveles de conocimiento.' },
    { icon: <BarChart3 className="w-7 h-7" />, title: 'Medible', description: 'Registramos participación, aprendizaje, finalización y certificación para entender qué funciona.' },
    { icon: <TrendingUp className="w-7 h-7" />, title: 'Escalable', description: 'Los contenidos y metodologías pueden utilizarse con nuevas comunidades, instituciones y territorios.' },
  ];

  const populations = [
    { icon: <Users className="w-7 h-7" />, title: 'Personas', description: 'Desarrolla habilidades digitales que puedas utilizar en tus actividades personales y profesionales.' },
    { icon: <Store className="w-7 h-7" />, title: 'Emprendedores y PyMEs', description: 'Utiliza herramientas digitales para organizar, comunicar, vender y hacer más productivo tu negocio.' },
    { icon: <Building2 className="w-7 h-7" />, title: 'Funcionarios públicos', description: 'Fortalece capacidades para impulsar instituciones y servicios públicos más digitales.' },
    { icon: <HeartHandshake className="w-7 h-7" />, title: 'Organizaciones sociales', description: 'Incorpora herramientas digitales para fortalecer proyectos y comunidades.' },
    { icon: <GraduationCap className="w-7 h-7" />, title: 'Jóvenes y estudiantes', description: 'Desarrolla habilidades que complementen tu formación y mejoren tu preparación para el futuro laboral.' },
  ];

  const learningAreas = [
    { icon: <Smartphone className="w-7 h-7" />, title: 'Habilidades Digitales', description: 'Herramientas esenciales para desenvolverse con confianza en entornos digitales.' },
    { icon: <Sparkles className="w-7 h-7" />, title: 'Inteligencia Artificial', description: 'Aprende a utilizar la IA de forma práctica, productiva y responsable.' },
    { icon: <Store className="w-7 h-7" />, title: 'Emprendimiento Digital', description: 'Tecnología aplicada al crecimiento y productividad de pequeños negocios.' },
    { icon: <TrendingUp className="w-7 h-7" />, title: 'Transformación Digital', description: 'Metodologías y herramientas para mejorar procesos, servicios y organizaciones.' },
    { icon: <BarChart3 className="w-7 h-7" />, title: 'Datos', description: 'Desarrolla capacidades para comprender, analizar y utilizar información.' },
    { icon: <Lightbulb className="w-7 h-7" />, title: 'Innovación Pública', description: 'Herramientas para transformar instituciones y resolver problemas públicos.' },
  ];

  const ecosystemActors = [
    { title: 'Sector público', description: 'Conectar formación con políticas, servicios e iniciativas de transformación digital.' },
    { title: 'Empresas y sector tecnológico', description: 'Acercar herramientas, conocimiento y oportunidades al ecosistema.' },
    { title: 'Academia', description: 'Contribuir con conocimiento, investigación y metodologías.' },
    { title: 'Sociedad civil y comunidades', description: 'Identificar necesidades reales y acercar oportunidades a más personas.' },
  ];

  const innovationCycle = [
    { title: 'Experimentar', description: 'Probamos nuevas metodologías.' },
    { title: 'Medir', description: 'Analizamos participación y resultados.' },
    { title: 'Aprender', description: 'Identificamos qué funciona y qué puede mejorarse.' },
    { title: 'Escalar', description: 'Adaptamos los modelos exitosos para llegar a más personas.' },
  ];

  const scalabilityFeatures = [
    { title: 'Contenido reutilizable', icon: <Layers className="w-6 h-6" /> },
    { title: 'Metodologías replicables', icon: <Repeat className="w-6 h-6" /> },
    { title: 'Tecnología escalable', icon: <Server className="w-6 h-6" /> },
    { title: 'Alianzas locales', icon: <Handshake className="w-6 h-6" /> },
    { title: 'Datos para aprender', icon: <BarChart3 className="w-6 h-6" /> },
  ];

  const faqs = [
    {
      question: '¿Qué tipo de certificación recibiré?',
      answer:
        'Al completar cada curso, recibes un certificado digital que acredita las horas de formación y las habilidades adquiridas.',
    },
    {
      question: '¿Los cursos son gratuitos?',
      answer:
        'Combinamos programas abiertos, formación patrocinada, alianzas institucionales y servicios especializados para ampliar el acceso a oportunidades de aprendizaje.',
    },
    {
      question: '¿Necesito conocimientos previos?',
      answer:
        'Cada curso indica los requisitos previos necesarios. Muchos de nuestros recursos están diseñados para personas sin experiencia y parten desde cero.',
    },
    {
      question: '¿Puedo aprender desde mi celular?',
      answer:
        'Sí. La mayoría de nuestros recursos están optimizados para dispositivos móviles. Puedes aprender desde donde estés.',
    },
    {
      question: '¿Las herramientas del Directorio de IA son para cualquier persona?',
      answer:
        'Sí. El Directorio de IA ayuda a encontrar herramientas según las necesidades de cada persona, negocio u organización, con orientación sobre su uso responsable.',
    },
    {
      question: '¿Puedo usar estos recursos en mi organización?',
      answer:
        'Sí. Trabajamos con instituciones, empresas, cooperación, universidades y organizaciones. Podemos desarrollar programas patrocinados, formación institucional, programas territoriales y laboratorios de aprendizaje.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Seo
        title={SEO['/'].title}
        description={SEO['/'].description}
        canonical="/"
        image="/og/escuela-default.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Escuela Red Ciudadana",
          "url": SITE_URL,
          "logo": `${SITE_URL}/logo/redciudadana.png`,
          "description":
            "Plataforma de aprendizaje e innovación que desarrolla habilidades digitales y acerca oportunidades a personas, emprendedores, instituciones y comunidades.",
          "parentOrganization": {
            "@type": "NGO",
            "name": "Asociación Civil Red Ciudadana",
            "url": SITE_URL,
            "logo": `${SITE_URL}/logo/redciudadana.png`
          },
          "sameAs": [
            "https://www.facebook.com/Redciudadanagt",
            "https://twitter.com/redxguate",
            "https://www.instagram.com/redxguate/",
            "https://www.youtube.com/c/RedciudadanaOrgGt",
          ],
        }}
      />
      {/* <ConectaFuturoPopup /> */}

      {/* Hero Slider */}
      <div className="relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={`bg-${index}`}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          </div>
        ))}

        <div className="relative">
          <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 lg:py-32">
            <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-center md:justify-start h-full">
                    <div className="max-w-2xl text-center md:text-left space-y-4 sm:space-y-6 text-white">
                      <p className="text-sm sm:text-base font-semibold text-primary-200 uppercase tracking-wide drop-shadow-lg">
                        {slide.eyebrow}
                      </p>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight drop-shadow-2xl">
                        {slide.title}
                      </h1>
                      <p className="text-lg sm:text-xl md:text-2xl text-white/90 drop-shadow-lg">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                        <Link
                          to={slide.buttonLink}
                          className="px-8 sm:px-10 py-4 sm:py-5 rounded-lg bg-white text-black font-bold transition-all text-lg sm:text-xl hover:bg-gray-100 hover:scale-105 text-center shadow-2xl"
                        >
                          {slide.buttonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full transition-all backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full transition-all backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentSlide
                    ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-white'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/75'
                } rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="py-8 sm:py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {indicators.map((ind, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center">
                  {ind.icon}
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">{ind.value}</p>
                <p className="text-sm sm:text-base text-gray-500">{ind.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              El talento está en todas partes. Las oportunidades digitales todavía no.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              La transformación digital está cambiando la forma de trabajar, emprender, aprender y acceder a oportunidades.
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              Sin embargo, miles de personas todavía enfrentan barreras para desarrollar las habilidades necesarias para aprovechar herramientas digitales, inteligencia artificial y nuevas tecnologías.
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              Estas brechas son mayores para personas y pequeños negocios con menos acceso a capacitación, acompañamiento y recursos especializados. Escuela Red Ciudadana busca acercar esas oportunidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {problems.map((p, i) => (
              <div key={i} className="p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-600 text-white rounded-lg flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">{p.title}</h3>
                <p className="text-gray-600">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Response - Process */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              De aprender tecnología a utilizarla para crear oportunidades
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Escuela Red Ciudadana desarrolla experiencias de aprendizaje prácticas que permiten a las personas aprender haciendo. Combinamos contenidos accesibles, herramientas digitales, ejercicios, recursos y acompañamiento para que los conocimientos puedan convertirse en capacidades aplicables.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
              {processSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 z-10 text-primary-400">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Model Section */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Un modelo diseñado para ampliar oportunidades
            </h2>
            <img src={Icono11} className="w-full max-w-[200px] h-auto mx-auto mt-4" alt="linea" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {modelComponents.map((m, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  {m.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{m.title}</h3>
                <p className="text-gray-600 text-sm">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Populations */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
              Formación para diferentes caminos
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Las habilidades digitales pueden abrir oportunidades distintas para cada persona.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {populations.map((p, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-600 text-white rounded-lg flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{p.title}</h3>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Territory & Inclusion */}
      <div className="py-16 sm:py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 font-heading">
              Las oportunidades no deberían depender de dónde vives
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              La formación digital puede ayudar a reducir las distancias entre las oportunidades disponibles en las grandes ciudades y las que existen en otros territorios. Nuestro modelo busca combinar aprendizaje en línea, alianzas locales y recursos accesibles para llegar progresivamente a más comunidades.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-primary-600 font-bold hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              Conoce nuestros programas
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Learning Areas */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
              Habilidades para un mundo que está cambiando
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Explora conocimientos y herramientas que pueden ayudarte a participar activamente en la transformación digital.
            </p>
            <img src={Icono11} className="w-full max-w-[200px] h-auto mx-auto mt-4" alt="linea" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {learningAreas.map((area, i) => (
              <div key={i} className="flex items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mr-4 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {area.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 font-heading">{area.title}</h3>
                  <p className="text-gray-600 text-sm">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured: Primeros Pasos Digitales */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                  <div className="inline-block px-3 sm:px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 w-fit">
                    Una puerta de entrada a las oportunidades digitales
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-heading">
                    Primeros Pasos Digitales
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    Un programa pensado para personas que quieren comenzar a utilizar herramientas digitales de manera práctica, sencilla y segura. Aprende desde cero a utilizar herramientas que pueden ayudarte a comunicarte, organizarte, promocionar productos y desenvolverte mejor en entornos digitales.
                  </p>
                  <div className="space-y-2 sm:space-y-3 mb-6">
                    <div className="flex items-start sm:items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base">Desde cero: no necesitas experiencia previa</span>
                    </div>
                    <div className="flex items-start sm:items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base">Práctico: aprendes utilizando herramientas reales</span>
                    </div>
                    <div className="flex items-start sm:items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base">Flexible: avanza a tu propio ritmo</span>
                    </div>
                    <div className="flex items-start sm:items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base">Aplicable: utiliza inmediatamente lo aprendido</span>
                    </div>
                  </div>
                  <Link
                    to="/primeros-pasos-digitales"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-base sm:text-lg w-full sm:w-fit"
                  >
                    Dar mis primeros pasos
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </div>
                <div className="relative h-48 sm:h-64 md:h-auto bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center p-6 sm:p-8 order-1 md:order-2">
                  <div className="text-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-primary-600" />
                    </div>
                    <p className="text-primary-800 font-semibold text-base sm:text-lg md:text-xl px-4">Aprende. Aplica. Avanza.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Ninguna transformación ocurre sola
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              Para ampliar las oportunidades digitales necesitamos conectar conocimiento, instituciones, empresas, comunidades y tecnología.
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              Escuela Red Ciudadana busca construir alianzas que permitan desarrollar nuevos contenidos, llegar a más territorios y probar modelos de formación que puedan escalar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {ecosystemActors.map((actor, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-heading">{actor.title}</h3>
                <p className="text-gray-600 text-sm">{actor.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-lg shadow-lg"
            >
              Construyamos una alianza
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Innovation Lab */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Un laboratorio para aprender qué funciona
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Además de formar personas, Escuela Red Ciudadana busca experimentar con nuevas formas de enseñar habilidades digitales. Probamos metodologías, herramientas y modelos de acompañamiento para identificar cuáles pueden generar mejores resultados y escalar hacia nuevas comunidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {innovationCycle.map((step, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scalability */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Un modelo que puede crecer
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              Los contenidos, metodologías y herramientas de Escuela Red Ciudadana están diseñados para poder adaptarse a diferentes comunidades, organizaciones y territorios.
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              Nuestro objetivo es construir modelos de aprendizaje que puedan ser implementados junto a aliados locales y replicados progresivamente en Guatemala y otros países de América Latina.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {scalabilityFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="text-gray-800 font-medium">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For Organizations */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Hagamos llegar estas oportunidades a más personas
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Trabajamos con instituciones, empresas, cooperación, universidades y organizaciones que quieren fortalecer capacidades digitales y generar oportunidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Programas patrocinados', desc: 'Formación gratuita para una población específica financiada por un aliado.' },
              { title: 'Formación institucional', desc: 'Programas diseñados para equipos y organizaciones.' },
              { title: 'Programas territoriales', desc: 'Formación implementada junto a aliados locales.' },
              { title: 'Laboratorios de aprendizaje', desc: 'Pilotos para probar nuevas metodologías o tecnologías.' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-lg shadow-lg"
            >
              Conversemos sobre una alianza
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Preguntas frecuentes
            </h2>
            <img src={Icono11} className="w-full max-w-[200px] h-auto mx-auto mt-4" alt="linea" />
          </div>

          <div className="max-w-4xl mx-auto grid gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img src={Icono10} className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mt-0.5 sm:mt-1 flex-shrink-0" alt="question" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-white py-16 sm:py-20" style={{ backgroundImage: `url(${Fondo})` }}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-heading px-4">
            Las oportunidades del futuro empiezan con las habilidades de hoy
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Encuentra una experiencia de aprendizaje, desarrolla una nueva capacidad y descubre cómo la tecnología puede ayudarte a avanzar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-white text-black font-semibold transition-colors text-base sm:text-lg hover:bg-gray-100"
            >
              Explorar cursos y recursos
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-black/40 text-white font-semibold transition-colors text-base sm:text-lg hover:bg-black/60 border border-white/30"
            >
              Crear mi perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
