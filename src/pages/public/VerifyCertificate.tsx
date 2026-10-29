import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Award, AlertCircle, Loader2 } from 'lucide-react';
import { CertificateRecord } from '../../types';
import Fondo from '../../assets/slider/fondo.png';
import Seo from '../../components/Seo';
import { SEO } from '../../config/seo';
import { searchCertificateByCode } from '../../services/certificateService';
import CertificateCard from '../../components/certificates/CertificateCard';
import { shareToLinkedIn } from '../../utils/linkedinShare';

// Verification is by certificate code only: listing holders by name or
// email let anyone harvest the participant roster.
type SearchType = 'code';

const VerifyCertificate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<SearchType>('code');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setSearchType('code');
      setSearchValue(codeParam);
      handleSearch(codeParam, 'code');
    }
  }, [searchParams]);

  const handleSearch = async (value?: string, type?: SearchType) => {
    const searchVal = value || searchValue;
    const searchTp = type || searchType;

    if (!searchVal.trim()) {
      setError('Por favor ingresa un valor para buscar');
      return;
    }

    setLoading(true);
    setError(null);
    setCertificate(null);
    setCertificates([]);

    try {
      if (searchTp === 'code') {
        const result = await searchCertificateByCode(searchVal);
        if (result) {
          setCertificate(result);
        } else {
          setError('No se encontró ningún certificado con ese código');
        }
      }
    } catch (err) {
      console.error('[VerifyCertificate] search failed:', err);
      setError('No pudimos completar la búsqueda. Intenta de nuevo en unos minutos.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareLinkedIn = (cert: CertificateRecord) => {
    shareToLinkedIn(cert);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo {...SEO['/verify-certificate']} canonical="/verify-certificate" />
      <div className="relative bg-cover bg-center text-white py-16" style={{ backgroundImage: `url(${Fondo})` }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-4 mb-6">
              <Award className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              Verificación de Certificados
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Busca y verifica certificados emitidos por Conecta Futuro. Comparte tus logros en LinkedIn.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary-600 hover:bg-primary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 font-heading">¿Cómo funciona?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">1. Busca</h4>
                <p className="text-sm text-primary-100">
                  Ingresa el código de tu certificado
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">2. Verifica</h4>
                <p className="text-sm text-primary-100">
                  Visualiza los detalles completos de tu certificado
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">3. Comparte</h4>
                <p className="text-sm text-primary-100">
                  Comparte tu logro en LinkedIn con un solo clic
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                  Código de Certificado (ej: CERT-2024-001)
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="CERT-2024-001"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-lg"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Buscar Certificado</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-1">
                    Certificado no encontrado
                  </h3>
                  <p className="text-red-700">{error}</p>
                  <p className="text-sm text-red-600 mt-2">
                    Por favor verifica que el código sea correcto e inténtalo de nuevo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {certificate && (
            <div className="mb-8">
              <CertificateCard
                certificate={certificate}
                onShare={() => handleShareLinkedIn(certificate)}
              />
            </div>
          )}

          {certificates.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 font-heading">
                Se encontraron {certificates.length} certificado(s)
              </h2>
              {certificates.map((cert, index) => (
                <CertificateCard
                  key={index}
                  certificate={cert}
                  onShare={() => handleShareLinkedIn(cert)}
                />
              ))}
            </div>
          )}

          {!loading && !error && !certificate && certificates.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="inline-block bg-primary-600 rounded-full p-6 mb-6">
                <Award className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">
                ¿Buscas tu certificado?
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Ingresa tu código de certificado, nombre o correo electrónico en el formulario anterior
                para verificar y compartir tus logros.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
