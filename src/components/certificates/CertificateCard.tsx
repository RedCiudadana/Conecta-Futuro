import React from 'react';
import { Award, Calendar, User, GraduationCap, Share2, CheckCircle } from 'lucide-react';
import { CertificateRecord } from '../../types';

interface CertificateCardProps {
  certificate: CertificateRecord;
  onShare: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onShare }) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Certificado Verificado</p>
              <p className="text-xs opacity-75 mt-1">Código: {certificate.certificateCode}</p>
            </div>
          </div>
          <div className="bg-green-500 rounded-full p-2">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Certificado de Finalización
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-blue-100 rounded-lg p-3">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Estudiante</p>
              <p className="text-lg font-bold text-gray-900">{certificate.studentName}</p>
              <p className="text-sm text-gray-500 mt-1">{certificate.studentEmail}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-green-100 rounded-lg p-3">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Curso</p>
              <p className="text-lg font-bold text-gray-900">{certificate.courseName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="bg-purple-100 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Finalización</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(certificate.completionDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="bg-orange-100 rounded-lg p-3">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Emisión</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(certificate.issueDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-blue-100 rounded-lg p-3">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Instructor</p>
              <p className="text-base font-semibold text-gray-900">{certificate.instructorName}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onShare}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
          >
            <Share2 className="w-5 h-5" />
            <span>Compartir en LinkedIn</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-center text-gray-700">
            <span className="font-semibold">Código de Verificación:</span>{' '}
            <span className="font-mono text-blue-600 font-bold">{certificate.certificateCode}</span>
          </p>
          <p className="text-xs text-center text-gray-500 mt-2">
            Comparte este código para que otros puedan verificar tu certificado
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
