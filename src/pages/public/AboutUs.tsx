import React from 'react';
import { Users, Award, Globe, BookOpen } from 'lucide-react';
import Seo from '../../components/Seo';
import { SEO } from '../../config/seo';

const AboutUs = () => {
  return (
    <div>
      <Seo {...SEO['/about']} canonical="/about" />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
            <p className="text-xl text-primary-100 mb-8">
              Somos una organización comprometida con el fortalecimiento de capacidades digitales 
              en el sector público de América Latina
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary-200" />
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm text-primary-200">Estudiantes</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Award className="w-8 h-8 mx-auto mb-2 text-primary-200" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-primary-200">Cursos</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Globe className="w-8 h-8 mx-auto mb-2 text-primary-200" />
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-primary-200">Países</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary-200" />
                <div className="text-2xl font-bold">1,000+</div>
                <div className="text-sm text-primary-200">Certificaciones</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            <h2>Nuestra Misión</h2>
            <p>
              Red Ciudadana es una organización guatemalteca sin fines de lucro que promueve la
              transparencia, la innovación pública y la transformación digital. A través de la
              Escuela Conecta Futuro, formamos gratuitamente a servidores públicos, emprendedores y
              ciudadanos en habilidades digitales esenciales para el siglo XXI.
            </p>

            <h2>Qué hacemos</h2>
            <p>
              Diseñamos y facilitamos cursos sobre datos abiertos, inteligencia artificial, Excel,
              Power BI, ciberseguridad, protección de datos personales e innovación pública. Todos
              nuestros cursos son gratuitos y están diseñados para el contexto guatemalteco y
              latinoamericano.
            </p>
            <p>
              También organizamos eventos como <strong>Conecta Futuro</strong>, un encuentro virtual
              que reúne a instituciones públicas, academia y sociedad civil para compartir
              experiencias sobre interoperabilidad, datos abiertos y confianza digital.
            </p>

            <h2>Nuestro impacto</h2>
            <p>
              Desde nuestra fundición, hemos capacitado a más de 10,000 personas en 15 países, con
              más de 50 cursos disponibles y 1,000 certificaciones emitidas. Trabajamos en alianza
              con gobiernos locales, organismos internacionales y organizaciones de la sociedad
              civil para impulsar un Estado más transparente, colaborativo y eficiente.
            </p>

            <h2>Únete a la comunidad</h2>
            <p>
              Puedes formar parte de nuestra comunidad de aprendizaje inscribiéndote en cualquiera
              de nuestros cursos gratuitos. También puedes seguirnos en redes sociales para
              mantenerte al día sobre nuevas formaciones, eventos y oportunidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;