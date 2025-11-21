import React from 'react';
import { InteractiveExercise, ExerciseField } from './InteractiveExercise';

interface Module7ExerciseProps {
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const Module7Exercise: React.FC<Module7ExerciseProps> = ({
  onComplete,
  isCompleted,
  savedData
}) => {
  const fields: ExerciseField[] = [
    {
      id: 'brand-name',
      label: '🏪 Nombre de tu Negocio/Marca',
      type: 'text',
      placeholder: 'Ej: Dulces Artesanales María',
      required: true,
      minLength: 5,
      maxLength: 30,
      helpText: 'Elige un nombre memorable y que describa tu negocio (5-30 caracteres)'
    },
    {
      id: 'slogan',
      label: '💬 Eslogan o Frase Representativa',
      type: 'text',
      placeholder: 'Ej: Sabor casero en cada bocado',
      required: true,
      minLength: 10,
      maxLength: 50,
      helpText: 'Una frase corta que capture la esencia de tu marca (10-50 caracteres)'
    },
    {
      id: 'primary-color',
      label: '🎨 Color Principal',
      type: 'select',
      options: [
        'Rojo',
        'Azul',
        'Verde',
        'Amarillo',
        'Naranja',
        'Rosa',
        'Morado',
        'Negro',
        'Café'
      ],
      required: true,
      helpText: 'Color que representará tu marca en tus diseños'
    },
    {
      id: 'secondary-color',
      label: '🎨 Color Secundario',
      type: 'select',
      options: [
        'Blanco',
        'Gris',
        'Negro',
        'Beige',
        'Crema',
        'Dorado',
        'Plateado'
      ],
      required: true,
      helpText: 'Color complementario para combinar con el principal'
    },
    {
      id: 'brand-values',
      label: '⭐ Valores de tu Negocio',
      type: 'textarea',
      placeholder: 'Ej: Calidad, Puntualidad, Honestidad',
      required: true,
      minLength: 15,
      maxLength: 150,
      helpText: 'Menciona 3 valores que definen cómo trabajas y qué te hace diferente',
      validation: (value) => {
        const words = value.split(/[,\n]/).filter(w => w.trim().length > 0);
        if (words.length < 3) {
          return { valid: false, message: 'Menciona al menos 3 valores (separados por comas)' };
        }
        return { valid: true };
      }
    },
    {
      id: 'target-audience',
      label: '👥 ¿A quién le vendes?',
      type: 'textarea',
      placeholder: 'Ej: Familias que buscan productos frescos y naturales',
      required: true,
      minLength: 20,
      maxLength: 150,
      helpText: 'Describe a tus clientes ideales: edad, intereses, necesidades'
    },
    {
      id: 'unique-selling-point',
      label: '✨ ¿Qué te hace especial?',
      type: 'textarea',
      placeholder: 'Ej: Todos mis productos son hechos a mano con recetas familiares',
      required: true,
      minLength: 20,
      maxLength: 200,
      helpText: 'Explica por qué los clientes deberían elegirte a ti y no a la competencia'
    }
  ];

  return (
    <InteractiveExercise
      moduleNumber={7}
      title="Ejercicio Práctico: Crear una mini identidad de marca"
      description="Define los elementos que harán que tu negocio sea reconocible y memorable para tus clientes."
      fields={fields}
      onComplete={onComplete}
      isCompleted={isCompleted}
      savedData={savedData}
    />
  );
};
