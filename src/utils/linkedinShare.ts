import { CertificateRecord } from '../types';

export const shareToLinkedIn = (certificate: CertificateRecord): void => {
  const verificationUrl = `${window.location.origin}/verify-certificate?code=${encodeURIComponent(certificate.certificateCode)}`;

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${year}-${month.toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const issueDate = formatDate(certificate.issueDate);

  const params = new URLSearchParams({
    name: certificate.courseName,
    organizationId: '2532725',
    organizationName: 'Red Ciudadana',
    issueYear: issueDate.split('-')[0] || new Date().getFullYear().toString(),
    issueMonth: issueDate.split('-')[1] || '',
    certUrl: verificationUrl,
    certId: certificate.certificateCode
  });

  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&${params.toString()}`;

  window.open(linkedInUrl, '_blank', 'width=700,height=700');
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
