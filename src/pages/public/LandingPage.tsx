import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, CheckCircle, HelpCircle, Star } from 'lucide-react';
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

const LandingPage: React.FC = () => {
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
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${Fondo})` }}
      >

        <div className="relative z-10 container mx-auto px-6 py-20 sm:py-28">
          <div className="flex flex-col md:flex-row items-center">
            
            {/* Columna izquierda - Texto */}
            <div className="md:w-1/2 text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading">
                Escuela de Innovación Pública
              </h1>
              <p className="text-xl sm:text-2xl text-primary-100 max-w-md">
                Fortaleciendo las capacidades del sector público en América Latina
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="px-8 py-4 rounded-lg bg-black  text-white text-primary-800 font-semibold transition-colors text-lg"
                >
                  Ver Cursos
                </Link>
                <Link
                  to="/learning-paths"
                  className="px-8 py-4 rounded-lg bg-black text-white font-semibold transition-colors text-lg border border-primary-600"
                >
                  Rutas de Aprendizaje
                </Link>
              </div>
            </div>

            {/* Columna derecha - Imagen */}
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <img
                src={Slider}
                alt="Innovación"
                className="max-w-xs md:max-w-md rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-heading">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma está diseñada específicamente para fortalecer las capacidades del sector público
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-6">
                  <img src={feature.icon} alt={feature.title} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-heading">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Áreas de Conocimiento
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora nuestras áreas temáticas diseñadas para el sector público
            </p>
            <img src={Icono11} className="w-100 h-auto mx-auto mt-4" alt="linea" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {highlights.map((topic, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="w-14 h-14 mr-4 rounded-lg flex items-center justify-center">
                  <img src={topic.icon} alt={topic.title}/>
                </div>
                <span className="text-lg text-gray-800">{topic.title}</span>
              </div>
            ))}
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
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Resolvemos tus dudas sobre nuestra plataforma educativa
            </p>
            <img src={Icono11} className="w-100 h-auto mx-auto mt-4" alt="linea" />
          </div>

          <div className="max-w-4xl mx-auto grid gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start">
                  <img src={Icono10} className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">
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
      <div className=" text-white py-20" style={{ backgroundImage: `url(${Fondo})` }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-heading">
            Comienza tu viaje de aprendizaje hoy
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de servidores públicos comprometidos con la innovación
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-primary-800 font-semibold hover:bg-primary-50 transition-colors text-lg"
          >
            Comenzar ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;