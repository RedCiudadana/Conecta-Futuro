import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export interface ExerciseField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'url' | 'select';
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  options?: string[];
  helpText?: string;
  validation?: (value: string) => { valid: boolean; message?: string };
}

interface InteractiveExerciseProps {
  moduleNumber: number;
  title: string;
  description: string;
  fields: ExerciseField[];
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const InteractiveExercise: React.FC<InteractiveExerciseProps> = ({
  moduleNumber,
  title,
  description,
  fields,
  onComplete,
  isCompleted = false,
  savedData = {}
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(savedData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(savedData).length > 0) {
      setFormData(savedData);
    }
  }, [savedData]);

  const validateField = (field: ExerciseField, value: string): { valid: boolean; message?: string } => {
    if (field.required && !value.trim()) {
      return { valid: false, message: 'Este campo es requerido' };
    }

    if (value && field.minLength && value.length < field.minLength) {
      return { valid: false, message: `Mínimo ${field.minLength} caracteres` };
    }

    if (value && field.maxLength && value.length > field.maxLength) {
      return { valid: false, message: `Máximo ${field.maxLength} caracteres` };
    }

    if (value && field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { valid: false, message: 'Email inválido' };
      }
    }

    if (value && field.type === 'url') {
      try {
        new URL(value);
      } catch {
        return { valid: false, message: 'URL inválida' };
      }
    }

    if (value && field.type === 'tel') {
      const phoneRegex = /^\+?[\d\s-]{8,}$/;
      if (!phoneRegex.test(value)) {
        return { valid: false, message: 'Número de teléfono inválido' };
      }
    }

    if (value && field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return { valid: false, message: 'Formato inválido' };
      }
    }

    if (field.validation) {
      return field.validation(value);
    }

    return { valid: true };
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));

    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const validation = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldId]: validation.valid ? '' : validation.message || ''
      }));
    }
  };

  const handleBlur = (fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    setFocusedField(null);
  };

  const handleFocus = (fieldId: string) => {
    setFocusedField(fieldId);
  };

  const isFormValid = (): boolean => {
    return fields.every(field => {
      const value = formData[field.id] || '';
      const validation = validateField(field, value);
      return validation.valid;
    });
  };

  const getCompletedFieldsCount = (): number => {
    return fields.filter(field => {
      const value = formData[field.id] || '';
      return validateField(field, value).valid;
    }).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = fields.reduce((acc, field) => {
      acc[field.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (isFormValid()) {
      onComplete(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
    setTouched({});
  };

  const renderField = (field: ExerciseField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    const isTouched = touched[field.id];
    const showError = isTouched && error;
    const isValid = isTouched && !error && value;
    const isFocused = focusedField === field.id;

    const baseClasses = `w-full px-4 py-3 border-2 rounded-lg transition-all ${
      showError
        ? 'border-red-500 bg-red-50'
        : isValid
        ? 'border-green-500 bg-green-50'
        : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
    }`;

    return (
      <div key={field.id} className="space-y-2">
        <label htmlFor={field.id} className="block font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            onFocus={() => handleFocus(field.id)}
            placeholder={field.placeholder}
            className={`${baseClasses} min-h-[100px] resize-none`}
            maxLength={field.maxLength}
          />
        ) : field.type === 'select' ? (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            onFocus={() => handleFocus(field.id)}
            className={baseClasses}
          >
            <option value="">Selecciona una opción</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            onFocus={() => handleFocus(field.id)}
            placeholder={field.placeholder}
            className={baseClasses}
            maxLength={field.maxLength}
          />
        )}

        {field.maxLength && value && (
          <div className="text-sm text-gray-500 text-right">
            {value.length} / {field.maxLength}
          </div>
        )}

        {isFocused && field.helpText && !showError && (
          <div className="flex items-start gap-2 text-sm text-primary-600 bg-primary-50 p-2 rounded">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{field.helpText}</span>
          </div>
        )}

        {showError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {isValid && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Correcto</span>
          </div>
        )}
      </div>
    );
  };

  const completedFields = getCompletedFieldsCount();
  const totalFields = fields.length;
  const progress = (completedFields / totalFields) * 100;

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
      <div className="mb-6">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center text-lg">
          <Sparkles className="w-5 h-5 mr-2" />
          ✏️ {title}
        </h4>
        <p className="text-green-800 mb-4">{description}</p>

        {!isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-green-700">
              <span>Progreso del ejercicio</span>
              <span className="font-medium">{completedFields} / {totalFields} campos completados</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {isCompleted ? (
        <div className="bg-white rounded-lg p-6 border-2 border-green-500">
          <div className="flex items-center gap-3 text-green-700 mb-4">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h5 className="font-semibold text-lg">¡Ejercicio Completado! 🎉</h5>
              <p className="text-sm">Has completado este ejercicio exitosamente</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Volver a intentar para practicar →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {fields.map(renderField)}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                isFormValid()
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isFormValid() ? '✅ Completar Ejercicio' : '⏳ Completa todos los campos'}
            </button>
            {Object.keys(formData).length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Reiniciar
              </button>
            )}
          </div>
        </form>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg p-8 max-w-md shadow-2xl transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Excelente trabajo!</h3>
              <p className="text-gray-600 mb-4">
                Has completado el ejercicio del módulo {moduleNumber} correctamente.
              </p>
              <p className="text-sm text-primary-600 font-medium">
                ¡Sigue así, estás aprendiendo muy bien! 🌟
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
