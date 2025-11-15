import { CertificateRecord } from '../types';

export const shareToLinkedIn = (certificate: CertificateRecord): void => {
  const verificationUrl = `${window.location.origin}/verify-certificate?code=${encodeURIComponent(certificate.certificateCode)}`;

  const text = `¡Completé exitosamente el curso "${certificate.courseName}" con ${certificate.instructorName}! 🎓\n\nCertificado emitido por Conecta Futuro\nFecha de finalización: ${certificate.completionDate}\n\nVerifica mi certificado aquí: ${verificationUrl}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`;

  window.open(linkedInUrl, '_blank', 'width=600,height=600');
};

export const generateVerificationUrl = (certificateCode: string): string => {
  return `${window.location.origin}/verify-certificate?code=${encodeURIComponent(certificateCode)}`;
};

export const copyVerificationUrl = async (certificateCode: string): Promise<boolean> => {
  try {
    const url = generateVerificationUrl(certificateCode);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy URL:', error);
    return false;
  }
};
