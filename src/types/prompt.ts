export type RiskLevel = 'Verde' | 'Amarillo' | 'Rojo';
export type PromptLevel = 'Basico' | 'Intermedio' | 'Avanzado';

export interface Prompt {
  id: number;
  title: string;
  category: string;
  level: PromptLevel;
  risk: RiskLevel;
  description: string;
  prompt_text: string;
  inputs: string[];
  output_format: string;
  example_use_case: string;
}
