import React, { useEffect, useState } from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';
import { comunidadContentService } from '../../services/comunidadService';
import { Link } from 'react-router-dom';
import type { Comunidad } from '../../types/community';
import Slider from '../../assets/slider/community.png';

const Community = () => {
  const [news, setNews] = useState<Comunidad[]>([]);

  useEffect(() => {
    comunidadContentService.getComunidades().then(setNews);
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="from-primary-900 to-primary-800 text-white" style={{ backgroundImage: `url(${Slider})` }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Últimas Noticias</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.slug} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-4 justify-between text-sm text-gray-500">
                  {item.date && <span>{formatDate(item.date)}</span>}
                  {item.highlight && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
                      Destacado
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.descripcion}</p>
                <Link
                  to={`/community/${item.slug}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  Leer más
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
