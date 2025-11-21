import React from 'react';
import { InteractiveExercise, ExerciseField } from './InteractiveExercise';

interface Module4ExerciseProps {
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const Module4Exercise: React.FC<Module4ExerciseProps> = ({
  onComplete,
  isCompleted,
  savedData
}) => {
  const fields: ExerciseField[] = [
    {
      id: 'flyer-title',
      label: '🎯 Título del Flyer',
      type: 'text',
      placeholder: 'Ej: ¡Promoción Especial!',
      required: true,
      minLength: 5,
      maxLength: 30,
      helpText: 'Un título corto y llamativo que capture la atención (5-30 caracteres)'
    },
    {
      id: 'product-highlight',
      label: '✨ Descripción Breve del Producto',
      type: 'textarea',
      placeholder: 'Ej: Pasteles artesanales decorados a mano con ingredientes frescos',
      required: true,
      minLength: 20,
      maxLength: 100,
      helpText: 'Describe lo más importante de tu producto en pocas palabras (20-100 caracteres)'
    },
    {
      id: 'flyer-price',
      label: '💵 Precio Destacado',
      type: 'text',
      placeholder: 'Q 120.00 o 2 x Q 200',
      required: true,
      helpText: 'El precio debe ser claro y visible. Puedes incluir promociones'
    },
    {
      id: 'contact-info',
      label: '📱 Información de Contacto',
      type: 'text',
      placeholder: '+502 1234-5678 o WhatsApp: 1234-5678',
      required: true,
      minLength: 8,
      helpText: 'Número de teléfono o WhatsApp donde pueden contactarte'
    },
    {
      id: 'flyer-colors',
      label: '🎨 Paleta de Colores',
      type: 'select',
      options: [
        'Verde y Blanco (Natural)',
        'Rojo y Amarillo (Energético)',
        'Azul y Blanco (Profesional)',
        'Rosa y Morado (Elegante)',
        'Naranja y Negro (Moderno)'
      ],
      required: true,
      helpText: 'Elige colores que representen tu marca y producto'
    },
    {
      id: 'special-offer',
      label: '🎁 Oferta Especial (opcional)',
      type: 'text',
      placeholder: 'Ej: ¡Envío gratis en tu primera compra!',
      required: false,
      maxLength: 100,
      helpText: 'Agrega un incentivo extra para atraer clientes'
    }
  ];

  return (
    <InteractiveExercise
      moduleNumber={4}
      title="Ejercicio Práctico: Diseñar un flyer digital para un producto"
      description="Crea los elementos de un flyer profesional que podrías usar en redes sociales o WhatsApp."
      fields={fields}
      onComplete={onComplete}
      isCompleted={isCompleted}
      savedData={savedData}
    />
  );
};
