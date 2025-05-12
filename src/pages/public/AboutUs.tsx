import React from 'react';
import { Users, Award, Globe, BookOpen } from 'lucide-react';

const AboutUs = () => {
  return (
    <div>
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
                <div className="text-2xl font-bold">5,000+</div>
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
        <div className="prose prose-lg">
          <p>About us content will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;