import React from 'react';
import { InteractiveExercise, ExerciseField } from './InteractiveExercise';

interface Module3ExerciseProps {
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const Module3Exercise: React.FC<Module3ExerciseProps> = ({
  onComplete,
  isCompleted,
  savedData
}) => {
  const fields: ExerciseField[] = [
    {
      id: 'product-name',
      label: '📦 Nombre del Producto',
      type: 'text',
      placeholder: 'Ej: Artesanías de Guatemala',
      required: true,
      minLength: 3,
      maxLength: 100,
      helpText: 'Escribe el nombre del producto que vas a promocionar'
    },
    {
      id: 'product-description',
      label: '📝 Descripción del Producto',
      type: 'textarea',
      placeholder: 'Describe tu producto: características, beneficios, materiales, tamaño...',
      required: true,
      minLength: 50,
      maxLength: 300,
      helpText: 'Una buena descripción incluye: qué es, para quién es, por qué comprarlo (50-300 caracteres)'
    },
    {
      id: 'product-price',
      label: '💰 Precio',
      type: 'text',
      placeholder: 'Q 75.00',
      required: true,
      helpText: 'Incluye el precio de manera clara. Usa Q para Quetzales',
      validation: (value) => {
        const hasNumber = /\d/.test(value);
        if (!hasNumber) {
          return { valid: false, message: 'Debes incluir un precio numérico' };
        }
        return { valid: true };
      }
    },
    {
      id: 'product-image-url',
      label: '🖼️ URL de la Imagen del Producto',
      type: 'url',
      placeholder: 'https://ejemplo.com/imagen.jpg',
      required: true,
      helpText: 'Pega la URL de una imagen de tu producto (puedes usar imágenes de Pexels)'
    },
    {
      id: 'hashtags',
      label: '🏷️ Hashtags (opcional)',
      type: 'text',
      placeholder: '#artesanias #Guatemala #HechoAMano',
      required: false,
      maxLength: 100,
      helpText: 'Los hashtags ayudan a que más personas encuentren tu publicación'
    },
    {
      id: 'call-to-action',
      label: '📢 Llamado a la Acción',
      type: 'text',
      placeholder: 'Ej: ¡Escríbeme para hacer tu pedido!',
      required: true,
      minLength: 10,
      maxLength: 150,
      helpText: 'Invita a las personas a contactarte, comprar, preguntar, etc.'
    }
  ];

  return (
    <InteractiveExercise
      moduleNumber={3}
      title="Ejercicio Práctico: Publicar una foto de producto con precio y descripción"
      description="Crea una publicación profesional para Facebook con toda la información que un cliente necesita."
      fields={fields}
      onComplete={onComplete}
      isCompleted={isCompleted}
      savedData={savedData}
    />
  );
};
