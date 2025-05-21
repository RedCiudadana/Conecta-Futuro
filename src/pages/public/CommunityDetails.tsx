import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { comunidadContentService } from '../../services/comunidadService';
import type { Comunidad } from '../../types/community';
import ReactMarkdown from 'react-markdown';
import { ArrowRight } from 'lucide-react';

const CommunityDetails = () => {
  const { slug } = useParams();
  const [noticia, setNoticia] = useState<Comunidad | null>(null);
  const [otrasNoticias, setOtrasNoticias] = useState<Comunidad[]>([]);

  useEffect(() => {
    if (slug) {
      comunidadContentService.getComunidades().then((todas) => {
        const actual = todas.find((n) => n.slug === slug) ?? null;
        setNoticia(actual);
        const otras = todas.filter((n) => n.slug !== slug);
        setOtrasNoticias(otras);
      });
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (!noticia) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando noticia...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{noticia.title}</h1>

        {/* Fecha y destacado */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>{formatDate(noticia.date)}</span>
          {noticia.highlight && (
            <span className="ml-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
              Destacado
            </span>
          )}
        </div>

        {/* Imagen */}
        {noticia.image && (
          <img
            src={noticia.image}
            alt={noticia.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        {/* Descripción */}
        {/* <p className="text-lg text-gray-700 mb-6">{noticia.descripcion}</p> */}

        {/* Body Markdown */}
        <article className="prose prose-lg max-w-none text-justify
          [&_p]:mb-6
          [&_h2]:mt-10 [&_h2]:mb-4
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6
          [&_a]:text-blue-600 [&_a]:underline
        ">
          <ReactMarkdown>{noticia.body}</ReactMarkdown>
        </article>

        {/* Más noticias */}
        {otrasNoticias.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Más noticias</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otrasNoticias.map((item) => (
                <div key={item.slug} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-4 justify-between text-sm text-gray-500">
                      <span>{formatDate(item.date)}</span>
                      {item.highlight && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
                          Destacado
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-4">{item.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-6">{item.descripcion}</p>
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
        )}

      </div>
    </div>
  );
};

export default CommunityDetails;
