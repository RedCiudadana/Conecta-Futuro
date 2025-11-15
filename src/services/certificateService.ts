import { CertificateRecord } from '../types';

let cachedCertificates: CertificateRecord[] | null = null;

const parseCSV = (csvText: string): CertificateRecord[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  const certificates: CertificateRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');

    if (values.length >= 7) {
      certificates.push({
        certificateCode: values[0].trim(),
        studentName: values[1].trim(),
        studentEmail: values[2].trim(),
        courseName: values[3].trim(),
        completionDate: values[4].trim(),
        issueDate: values[5].trim(),
        instructorName: values[6].trim(),
        expirationDate: values[7] ? values[7].trim() : undefined,
        certificateUrl: values[8] ? values[8].trim() : undefined,
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

export const searchCertificatesByName = async (name: string): Promise<CertificateRecord[]> => {
  const certificates = await fetchCertificates();
  const normalizedName = name.trim().toLowerCase();

  if (normalizedName.length < 2) {
    return [];
  }

  return certificates.filter(cert =>
    cert.studentName.toLowerCase().includes(normalizedName)
  );
};

export const searchCertificatesByEmail = async (email: string): Promise<CertificateRecord[]> => {
  const certificates = await fetchCertificates();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.length < 3) {
    return [];
  }

  return certificates.filter(cert =>
    cert.studentEmail.toLowerCase().includes(normalizedEmail)
  );
};

export const clearCertificateCache = (): void => {
  cachedCertificates = null;
};
