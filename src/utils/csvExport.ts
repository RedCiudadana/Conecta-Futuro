interface DiagnosticData {
  name: string | null;
  email: string | null;
  businessName: string | null;
  answers: Array<{
    question_id: number;
    question: string;
    answer_value: number;
    dimension: string;
  }>;
  totalScore: number;
  maturityLevel: number;
  recommendedModules: string[];
  timestamp: string;
}

export const saveDiagnosticToCSV = (data: DiagnosticData): void => {
  const fileName = 'diagnostic_results.csv';
  const filePath = `/public/${fileName}`;

  const csvRow = [
    new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.businessName || '',
    data.totalScore,
    data.maturityLevel,
    data.recommendedModules.join(';'),
    JSON.stringify(data.answers).replace(/,/g, '|')
  ].map(value => `"${value}"`).join(',');

  const headers = 'Timestamp,Name,Email,Business Name,Total Score,Maturity Level,Recommended Modules,Answers\n';

  try {
    fetch(filePath)
      .then(response => response.text())
      .then(existingContent => {
        const content = existingContent.includes('Timestamp')
          ? existingContent + csvRow + '\n'
          : headers + csvRow + '\n';

        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(() => {
        const content = headers + csvRow + '\n';
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  } catch (error) {
    console.error('Error saving diagnostic to CSV:', error);
  }
};

export const appendToDiagnosticCSV = (data: DiagnosticData): void => {
  const fileName = 'diagnostic_results.csv';

  const csvRow = [
    new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.businessName || '',
    data.totalScore,
    data.maturityLevel,
    data.recommendedModules.join(';'),
    JSON.stringify(data.answers).replace(/,/g, '|')
  ].map(value => `"${value}"`).join(',');

  const csvContent = csvRow + '\n';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
};
