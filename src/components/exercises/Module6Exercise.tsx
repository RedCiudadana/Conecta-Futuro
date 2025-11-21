import React from 'react';
import { InteractiveExercise, ExerciseField } from './InteractiveExercise';

interface Module6ExerciseProps {
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const Module6Exercise: React.FC<Module6ExerciseProps> = ({
  onComplete,
  isCompleted,
  savedData
}) => {
  const fields: ExerciseField[] = [
    {
      id: 'payment-method',
      label: '💳 Método de Pago Digital',
      type: 'select',
      options: [
        'Transferencia Bancaria',
        'Billetera Electrónica (Tigo Money, Claro Pay)',
        'Pago con Tarjeta',
        'PayPal',
        'Otro método digital'
      ],
      required: true,
      helpText: 'Selecciona el método de pago que usarás en esta venta'
    },
    {
      id: 'amount',
      label: '💰 Monto a Recibir',
      type: 'text',
      placeholder: 'Q 250.00',
      required: true,
      helpText: 'Indica el monto total de la venta',
      validation: (value) => {
        const hasNumber = /\d+/.test(value);
        if (!hasNumber) {
          return { valid: false, message: 'Debes incluir un monto numérico' };
        }
        return { valid: true };
      }
    },
    {
      id: 'sale-description',
      label: '📝 Concepto/Descripción de la Venta',
      type: 'textarea',
      placeholder: 'Ej: Pago por 2 pasteles de chocolate - Pedido #123',
      required: true,
      minLength: 15,
      maxLength: 200,
      helpText: 'Describe claramente qué estás vendiendo para el registro de la transacción'
    },
    {
      id: 'confirmation-data',
      label: '✅ Datos de Confirmación',
      type: 'textarea',
      placeholder: 'Ej: Número de cuenta: 1234567890, Nombre: María López, Banco: Industrial',
      required: true,
      minLength: 20,
      maxLength: 200,
      helpText: 'Información necesaria para confirmar la transacción (cuenta, nombre, banco, etc.)'
    },
    {
      id: 'security-checklist',
      label: '🔒 Medidas de Seguridad Aplicadas',
      type: 'textarea',
      placeholder: 'Ej: Verificar nombre del remitente, confirmar monto exacto, solicitar comprobante...',
      required: true,
      minLength: 30,
      maxLength: 300,
      helpText: 'Lista las medidas de seguridad que tomaste para evitar estafas',
      validation: (value) => {
        const securityWords = ['verificar', 'confirmar', 'comprobante', 'revisar', 'validar'];
        const hasSecurity = securityWords.some(word => value.toLowerCase().includes(word));
        if (!hasSecurity) {
          return { valid: false, message: 'Menciona acciones de verificación y seguridad' };
        }
        return { valid: true };
      }
    }
  ];

  return (
    <InteractiveExercise
      moduleNumber={6}
      title="Ejercicio Práctico: Simular una venta con pago digital"
      description="Completa una transacción digital de forma segura. Aprende a manejar pagos electrónicos correctamente."
      fields={fields}
      onComplete={onComplete}
      isCompleted={isCompleted}
      savedData={savedData}
    />
  );
};
