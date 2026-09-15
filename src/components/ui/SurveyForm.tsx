import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export interface SurveyField {
  key: string;
  label: string;
  type: 'scale' | 'text' | 'choice' | 'boolean';
  help?: string;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  required?: boolean;
}

export interface SurveyDefinition {
  type: 'entry' | 'exit' | 'followup_3m' | 'followup_6m';
  title: string;
  description: string;
  fields: SurveyField[];
}

interface Props {
  definition: SurveyDefinition;
  onSubmit: (responses: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export const ENTRY_SURVEY: SurveyDefinition = {
  type: 'entry',
  title: 'Encuesta de entrada',
  description: 'Cuéntanos sobre tu nivel actual de habilidades digitales. Esto nos ayuda a medir tu progreso.',
  fields: [
    {
      key: 'self_skill_level',
      label: '¿Cómo calificarías tu nivel actual de habilidades digitales?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Principiante', max: 'Avanzado' },
      required: true,
    },
    {
      key: 'uses_technology_for',
      label: '¿Para qué usas actualmente herramientas digitales?',
      type: 'text',
      help: 'Trabajo, estudios, negocios, comunicación personal, etc.',
    },
  ],
};

export const EXIT_SURVEY: SurveyDefinition = {
  type: 'exit',
  title: 'Encuesta de salida',
  description: 'Tu opinión nos ayuda a mejorar el curso y medir el impacto real de la formación.',
  fields: [
    {
      key: 'learning',
      label: '¿Cuánto aprendiste en este curso?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Nada', max: 'Mucho' },
      required: true,
    },
    {
      key: 'satisfaction',
      label: '¿Qué tan satisfecho/a estás con el curso?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Nada satisfecho/a', max: 'Muy satisfecho/a' },
      required: true,
    },
    {
      key: 'applied_intention',
      label: '¿Tienes intención de aplicar lo aprendido?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: { min: 'Definitivamente no', max: 'Definitivamente sí' },
      required: true,
    },
    {
      key: 'what_learned',
      label: '¿Qué fue lo más útil que aprendiste?',
      type: 'text',
    },
    {
      key: 'suggestions',
      label: '¿Qué mejorarías del curso?',
      type: 'text',
    },
  ],
};

export const FOLLOWUP_3M_SURVEY: SurveyDefinition = {
  type: 'followup_3m',
  title: 'Seguimiento a 3 meses',
  description: 'Nos gustaría saber cómo has aplicado lo aprendido. Esta encuesta toma 2 minutos.',
  fields: [
    {
      key: 'found_job',
      label: '¿Conseguiste empleo o un mejor empleo?',
      type: 'choice',
      options: ['Sí, conseguí empleo', 'Sí, mejoré mi empleo actual', 'No', 'No aplicable'],
    },
    {
      key: 'income_increased',
      label: '¿Aumentaron tus ingresos?',
      type: 'choice',
      options: ['Sí, significativamente', 'Sí, ligeramente', 'No', 'No aplicable'],
    },
    {
      key: 'applied_tools',
      label: '¿Aplicaste herramientas digitales en tu trabajo o negocio?',
      type: 'boolean',
    },
    {
      key: 'digital_sales',
      label: '¿Tu negocio vende por canales digitales?',
      type: 'choice',
      options: ['Sí', 'No', 'No tengo negocio'],
    },
  ],
};

export const FOLLOWUP_6M_SURVEY: SurveyDefinition = {
  type: 'followup_6m',
  title: 'Seguimiento a 6 meses',
  description: 'Seis meses después del curso, nos gustaría saber el impacto a mediano plazo.',
  fields: [
    {
      key: 'found_job',
      label: '¿Conseguiste empleo o un mejor empleo desde el curso?',
      type: 'choice',
      options: ['Sí, conseguí empleo', 'Sí, mejoré mi empleo actual', 'No', 'No aplicable'],
    },
    {
      key: 'income_increased',
      label: '¿Aumentaron tus ingresos comparado con antes del curso?',
      type: 'choice',
      options: ['Sí, significativamente', 'Sí, ligeramente', 'No', 'No aplicable'],
    },
    {
      key: 'applied_tools',
      label: '¿Sigues aplicando herramientas digitales en tu trabajo o negocio?',
      type: 'boolean',
    },
    {
      key: 'digital_sales',
      label: '¿Tu negocio vende por canales digitales?',
      type: 'choice',
      options: ['Sí', 'No', 'No tengo negocio'],
    },
    {
      key: 'additional_training',
      label: '¿Tomaste cursos adicionales después del curso?',
      type: 'boolean',
    },
  ],
};

const SurveyForm: React.FC<Props> = ({ definition, onSubmit, submitLabel = 'Enviar respuestas' }) => {
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: unknown) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = definition.fields.filter(f => f.required && (responses[f.key] === undefined || responses[f.key] === ''));
    if (missing.length > 0) {
      setError(`Por favor responde: ${missing.map(f => f.label).join(', ')}`);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(responses);
      setSubmitted(true);
    } catch (err) {
      console.error('[SurveyForm] Error submitting survey:', err);
      setError('No pudimos guardar tus respuestas. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Gracias por tus respuestas!</h3>
        <p className="text-gray-600">Tu opinión nos ayuda a mejorar y medir el impacto de la formación.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{definition.title}</h3>
        <p className="text-gray-600 text-sm">{definition.description}</p>
      </div>

      {definition.fields.map(field => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.help && <p className="text-xs text-gray-500 mb-2">{field.help}</p>}

          {field.type === 'scale' && (
            <div>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: (field.scaleMax ?? 5) - (field.scaleMin ?? 1) + 1 }, (_, i) => i + (field.scaleMin ?? 1)).map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleChange(field.key, val)}
                    className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                      responses[field.key] === val
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              {field.scaleLabels && (
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{field.scaleLabels.min}</span>
                  <span>{field.scaleLabels.max}</span>
                </div>
              )}
            </div>
          )}

          {field.type === 'choice' && (
            <div className="space-y-2">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={field.key}
                    value={opt}
                    checked={responses[field.key] === opt}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === 'boolean' && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange(field.key, true)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  responses[field.key] === true ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => handleChange(field.key, false)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  responses[field.key] === false ? 'bg-gray-500 text-white border-gray-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                No
              </button>
            </div>
          )}

          {field.type === 'text' && (
            <textarea
              value={(responses[field.key] as string) ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Escribe tu respuesta..."
            />
          )}
        </div>
      ))}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Enviando...' : submitLabel}
      </button>
    </form>
  );
};

export default SurveyForm;
