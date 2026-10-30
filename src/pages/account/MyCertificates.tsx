import React from 'react';
import { useAccount } from '../../contexts/AccountContext';
import { Award, Download, Clock, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  emitted: 'Emitido',
  issued: 'Emitido',
  pending: 'Pendiente',
  revoked: 'Revocado',
};

const STATUS_COLORS: Record<string, string> = {
  emitted: 'bg-emerald-50 text-emerald-700',
  issued: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  revoked: 'bg-red-50 text-red-600',
};

const MyCertificates: React.FC = () => {
  const { accountData, loading } = useAccount();

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-600" /></div>;
  }

  const certificates = accountData?.certificates ?? [];
  const emitted = certificates.filter(c => c.status === 'emitted' || c.status === 'issued');
  const pending = certificates.filter(c => c.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Mis Certificados</h1>
        <p className="text-sm text-gray-500">Visualiza y descarga tus certificados emitidos</p>
      </div>

      {certificates.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tienes certificados todavía</p>
          <p className="text-sm text-gray-400 mt-1">Los certificados aparecerán aquí cuando sean aprobados y emitidos</p>
        </div>
      )}

      {/* Emitted certificates */}
      {emitted.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            Emitidos <span className="text-gray-400 font-normal">({emitted.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {emitted.map((cert) => (
              <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{cert.course?.title ?? 'Curso'}</h3>
                      <p className="text-xs text-gray-400 font-mono">{cert.certificate_code}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${STATUS_COLORS[cert.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[cert.status] ?? cert.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  {cert.issued_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(cert.issued_at).toLocaleDateString('es-GT')}
                    </span>
                  )}
                  {cert.hours != null && (
                    <span>{cert.hours} horas</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {cert.pdf_url && (
                    <a
                      href={cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Descargar PDF
                    </a>
                  )}
                  {cert.verification_url && (
                    <a
                      href={cert.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Verificar
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending certificates */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            Pendientes <span className="text-gray-400 font-normal">({pending.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((cert) => (
              <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 opacity-75">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{cert.course?.title ?? 'Curso'}</h3>
                      <p className="text-xs text-gray-400">En revisión</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${STATUS_COLORS[cert.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[cert.status] ?? cert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
