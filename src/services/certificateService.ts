import { CertificateRecord } from '../types';

let cachedCertificates: CertificateRecord[] | null = null;

const parseCSV = (csvText: string): CertificateRecord[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  const certificates: CertificateRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');

    if (values.length >= 6) {
      certificates.push({
        certificateCode: values[0].trim(),
        studentName: values[1].trim(),
        // Email addresses are no longer published with the roster.
        studentEmail: '',
        courseName: values[2].trim(),
        completionDate: values[3].trim(),
        issueDate: values[4].trim(),
        instructorName: values[5].trim(),
        expirationDate: values[6] ? values[6].trim() : undefined,
        certificateUrl: values[7] ? values[7].trim() : undefined,
      });
    }
  }

  return certificates;
};

export const fetchCertificates = async (): Promise<CertificateRecord[]> => {
  if (cachedCertificates) {
    return cachedCertificates;
  }

  try {
    const response = await fetch('/certificates.csv');

    if (!response.ok) {
      throw new Error('Failed to fetch certificates');
    }

    const csvText = await response.text();
    cachedCertificates = parseCSV(csvText);

    return cachedCertificates;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw new Error('Unable to load certificates. Please try again later.');
  }
};

export const searchCertificateByCode = async (code: string): Promise<CertificateRecord | null> => {
  const certificates = await fetchCertificates();
  const normalizedCode = code.trim().toUpperCase();

  return certificates.find(
    cert => cert.certificateCode.toUpperCase() === normalizedCode
  ) || null;
};

// Searching the roster by name or email let anyone harvest participants in
// bulk, so verification is now by certificate code only: you can confirm a
// certificate you were given, but you cannot list who holds one.

export const clearCertificateCache = (): void => {
  cachedCertificates = null;
};
