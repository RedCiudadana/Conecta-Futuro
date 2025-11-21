import React from 'react';
import { InteractiveExercise, ExerciseField } from './InteractiveExercise';

interface Module5ExerciseProps {
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const Module5Exercise: React.FC<Module5ExerciseProps> = ({
  onComplete,
  isCompleted,
  savedData
}) => {
  const fields: ExerciseField[] = [
    {
      id: 'greeting',
      label: '👋 Paso 1: Saludo al Cliente',
      type: 'text',
      placeholder: 'Ej: ¡Hola! Buen día, ¿en qué puedo ayudarte?',
      required: true,
      minLength: 10,
      maxLength: 100,
      helpText: 'Saluda de manera amigable y profesional'
    },
    {
      id: 'product-presentation',
      label: '📦 Paso 2: Presentación del Producto',
      type: 'textarea',
      placeholder: 'Ej: Tengo disponible pasteles de chocolate hechos con ingredientes naturales...',
      required: true,
      minLength: 30,
      maxLength: 200,
      helpText: 'Presenta tu producto destacando sus mejores características',
      validation: (value) => {
        const hasCharacteristics = value.length >= 30;
        if (!hasCharacteristics) {
          return { valid: false, message: 'Describe las características del producto (mínimo 30 caracteres)' };
        }
        return { valid: true };
      }
    },
    {
      id: 'price-info',
      label: '💰 Paso 3: Precio y Formas de Pago',
      type: 'textarea',
      placeholder: 'Ej: El precio es Q 150. Aceptamos efectivo y transferencia bancaria',
      required: true,
      minLength: 20,
      maxLength: 150,
      helpText: 'Indica el precio claramente y las formas de pago disponibles',
      validation: (value) => {
        const hasPrice = /\d/.test(value);
        const hasPayment = value.toLowerCase().includes('pago') ||
                          value.toLowerCase().includes('efectivo') ||
                          value.toLowerCase().includes('transferencia') ||
                          value.toLowerCase().includes('acepto');
        if (!hasPrice) {
          return { valid: false, message: 'Debes mencionar el precio' };
        }
        if (!hasPayment) {
          return { valid: false, message: 'Menciona las formas de pago' };
        }
        return { valid: true };
      }
    },
    {
      id: 'delivery-info',
      label: '🚚 Paso 4: Información de Entrega',
      type: 'textarea',
      placeholder: 'Ej: Hacemos entregas en zona 1 y puedes recoger en mi local...',
      required: true,
      minLength: 20,
      maxLength: 150,
      helpText: 'Explica cómo entregas el producto (domicilio, punto de recogida, horarios)',
      validation: (value) => {
        const hasDeliveryInfo = value.toLowerCase().includes('entrega') ||
                                value.toLowerCase().includes('recog') ||
                                value.toLowerCase().includes('domicilio') ||
                                value.toLowerCase().includes('envío');
        if (!hasDeliveryInfo) {
          return { valid: false, message: 'Debes explicar cómo entregas el producto' };
        }
        return { valid: true };
      }
    },
    {
      id: 'closing',
      label: '🤝 Paso 5: Cierre de Venta',
      type: 'text',
      placeholder: 'Ej: ¿Te gustaría hacer tu pedido ahora? ¡Con gusto te lo preparo!',
      required: true,
      minLength: 15,
      maxLength: 150,
      helpText: 'Invita al cliente a tomar acción de manera amable'
    }
  ];

  return (
    <InteractiveExercise
      moduleNumber={5}
      title="Ejercicio Práctico: Simular una venta en WhatsApp"
      description="Completa cada paso de una conversación de venta profesional. Incluye toda la información necesaria para cerrar una venta."
      fields={fields}
      onComplete={onComplete}
      isCompleted={isCompleted}
      savedData={savedData}
    />
  );
};
