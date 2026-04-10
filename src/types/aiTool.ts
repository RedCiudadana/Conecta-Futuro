export interface AITool {
  id: number;
  name: string;
  category: string;
  description: string;
  useCase: string;
  link: string;
  logoUrl: string;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  maturityLevel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Estratégico';
  targetUsers: string[];
}

export type FilterState = {
  searchQuery: string;
  category: string;
  userType: string;
  riskLevel: string;
  maturityLevel: string;
};
