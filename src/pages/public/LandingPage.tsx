import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, CheckCircle, HelpCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Fondo from '../../assets/slider/fondo.png';
import Slider from '../../assets/slider/slider.png';
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
import ConectaFuturoPopup from '../../components/ui/ConectaFuturoPopup';

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Escuela Conecta Futuro',
      description: 'Impulsa tu desarrollo profesional con cursos gratuitos sobre innovación, emprendimiento, gobierno digital y tecnología.',
      buttonText: 'Ver Cursos',
      buttonLink: '/courses',
      image: Slider
    },
    {
      title: 'Aprende a tu Ritmo',
      description: 'Accede a contenido de calidad diseñado por expertos, disponible 24/7 para que aprendas cuando y donde quieras.',
      buttonText: 'Explorar Cursos',
      buttonLink: '/courses',
      image: Slider
    },
    {
      title: 'Certificación Profesional',
      description: 'Obtén certificados avalados que validan tus nuevas competencias y habilidades digitales.',
      buttonText: 'Certificaciones',
      buttonLink: '/courses',
      image: Slider
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  const features = [
    {
      icon: Icono1,
      title: 'Cursos Especializados',
      description: 'Contenido diseñado específicamente para el sector público.'
    },
    {
      icon: Icono2,
      title: 'Instructores Expertos',
      description: 'Aprende de profesionales con amplia experiencia en gobierno.'
    },
    {
      icon: Icono3,
      title: 'Certificaciones',
      description: 'Obtén certificados avalados por Red Ciudadana.'
    }
  ];

  const highlights = [
    {
      icon: Icono4,
      title: 'Innovación Pública'
    },
    {
      icon: Icono5,
      title: 'Transformación Digital'
    },
    {
      icon: Icono6,
      title: 'Inteligencia Artificial'
    },
    {
      icon: Icono7,
      title: 'Datos Abiertos'
    },
    {
      icon: Icono8,
      title: 'Gobierno Digital'
    },
    {
      icon: Icono9,
      title: 'Participación Ciudadana'
    }
  ];

  const testimonials = [
    {
      name: 'María Fernanda Rodríguez',
      role: 'Analista de Datos, Ministerio de Educación',
      image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg',
      quote: 'Los cursos de Excel y Power BI han transformado completamente la manera en que analizamos datos en nuestra institución. La calidad del contenido y la atención personalizada superaron mis expectativas.',
      rating: 5
    },
    {
      name: 'Carlos Mendoza',
      role: 'Director de Innovación, Municipalidad de Guatemala',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      quote: 'La ruta de aprendizaje en Gobierno Digital me dio las herramientas necesarias para liderar proyectos de transformación digital en mi municipalidad. ¡Altamente recomendado!',
      rating: 5
    },
    {
      name: 'Ana Lucía Pérez',
      role: 'Coordinadora de Proyectos, ONG Local',
      image: 'https://images.pexels.com/photos/3767392/pexels-photo-3767392.jpeg',
      quote: 'Como líder de una organización social, los cursos me ayudaron a entender mejor cómo usar la tecnología para maximizar nuestro impacto en la comunidad.',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: '¿Qué tipo de certificación recibiré?',
      answer: 'Al completar cada curso, recibirás un certificado digital avalado por Red Ciudadana, que acredita las horas de formación y las competencias adquiridas.'
    },
    {
      question: '¿Los cursos son gratuitos?',
      answer: 'Ofrecemos tanto cursos gratuitos como de pago. Los cursos gratuitos están claramente marcados en nuestra plataforma.'
    },
    {
      question: '¿Cuánto tiempo tengo para completar un curso?',
      answer: 'Los cursos están diseñados para ser flexibles. Una vez inscrito, tienes acceso al contenido durante 6 meses para completarlo a tu propio ritmo.'
    },
    {
      question: '¿Necesito conocimientos previos?',
      answer: 'Cada curso indica los requisitos previos necesarios. Muchos de nuestros cursos están diseñados para principiantes y no requieren conocimientos específicos.'
    },
    {
      question: '¿Cómo funciona el soporte durante el curso?',
      answer: 'Contamos con tutores especializados que responden consultas a través del foro del curso y sesiones de consulta programadas.'
    },
    {
      question: '¿Puedo acceder al contenido después de completar el curso?',
      answer: 'Sí, una vez completado el curso, mantendrás acceso al material durante 12 meses adicionales para consultas y repaso.'
    }
  ];

  return (
    <div className="min-h-screen">
      <ConectaFuturoPopup />

      {/* Hero Slider */}
      <div className="relative overflow-hidden">
        <div
          className="relative bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${Fondo})` }}
        >
          {/* Slides Container */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-28">
            <div className="relative">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Columna izquierda - Texto */}
                    <div className="md:w-1/2 text-center md:text-left space-y-4 sm:space-y-6">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-md mx-auto md:mx-0">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                        <Link
                          to={slide.buttonLink}
                          className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-black text-white font-semibold transition-colors text-base sm:text-lg hover:bg-gray-800 text-center"
                        >
                          {slide.buttonText}
                        </Link>
                      </div>
                    </div>

                    {/* Columna derecha - Imagen */}
                    <div className="md:w-1/2 flex justify-center">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full max-w-[280px] sm:max-w-xs md:max-w-md rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
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

          {/* Dots Navigation */}
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

      {/* Features Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-heading px-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Nuestra plataforma está diseñada específicamente para fortalecer las capacidades del sector público y emprendedores locales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <img src={feature.icon} alt={feature.title} className="w-full h-full" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 font-heading">
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-heading px-4">
              Áreas de Conocimiento
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Explora nuestras áreas temáticas diseñadas para el sector público y emprendedores locales.
            </p>
            <img src={Icono11} className="w-full max-w-[200px] h-auto mx-auto mt-4" alt="linea" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {highlights.map((topic, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mr-3 sm:mr-4 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img src={topic.icon} alt={topic.title} className="w-full h-full"/>
                </div>
                <span className="text-base sm:text-lg text-gray-800">{topic.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curso Destacado - Primeros Pasos Digitales */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                  <div className="inline-block px-3 sm:px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 w-fit">
                    Curso Especial Gratuito
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-heading">
                    Mis Primeros Pasos Digitales
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    Un curso diseñado especialmente para emprendedoras con pocos conocimientos digitales.
                    Aprende a usar herramientas básicas para vender tus productos en línea, desde cero y a tu ritmo.
                  </p>
                  <div className="space-y-2 sm:space-y-3 mb-6">
                    <div className="flex items-start sm:items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base">8 módulos prácticos</span>
                    </div>
                    <div className="flex items-start sm:items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base">Sin experiencia previa necesaria</span>
                    </div>
                    <div className="flex items-start sm:items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base">Certificado digital al completar</span>
                    </div>
                    <div className="flex items-start sm:items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base">Aprende WhatsApp Business, redes sociales y más</span>
                    </div>
                  </div>
                  <Link
                    to="/primeros-pasos-digitales"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-base sm:text-lg w-full sm:w-fit"
                  >
                    Conocer el curso
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </div>
                <div className="relative h-48 sm:h-64 md:h-auto bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center p-6 sm:p-8 order-1 md:order-2">
                  <div className="text-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-primary-600" />
                    </div>
                    <p className="text-primary-800 font-semibold text-base sm:text-lg md:text-xl px-4">¡Empieza hoy tu transformación digital!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {/* <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Historias de éxito de quienes ya han transformado sus capacidades con nosotros
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 relative">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-600 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="absolute top-4 right-4 text-primary-200">
                  <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* FAQ Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-heading px-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Resolvemos tus dudas sobre nuestra plataforma educativa
            </p>
            <img src={Icono11} className="w-full max-w-[200px] h-auto mx-auto mt-4" alt="linea" />
          </div>

          <div className="max-w-4xl mx-auto grid gap-4 sm:gap-6">
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

      {/* CTA Section */}
      <div className="text-white py-12 sm:py-16 md:py-20" style={{ backgroundImage: `url(${Fondo})` }}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-heading px-4">
            Comienza tu viaje de aprendizaje hoy
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Únete a nuestra comunidad de servidores públicos comprometidos con la innovación
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-black text-white font-semibold transition-colors text-base sm:text-lg hover:bg-gray-800 w-full max-w-xs sm:w-auto mx-auto"
          >
            Comenzar ahora
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;