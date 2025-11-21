import React from 'react';
import { InteractiveExercise, ExerciseField } from './InteractiveExercise';

interface Module1ExerciseProps {
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const Module1Exercise: React.FC<Module1ExerciseProps> = ({
  onComplete,
  isCompleted,
  savedData
}) => {
  const fields: ExerciseField[] = [
    {
      id: 'email-to',
      label: '📧 Correo Electrónico - Destinatario',
      type: 'email',
      placeholder: 'ejemplo@correo.com',
      required: true,
      helpText: 'Escribe una dirección de correo electrónico válida'
    },
    {
      id: 'email-subject',
      label: '📧 Correo Electrónico - Asunto',
      type: 'text',
      placeholder: 'Ej: Información sobre mis productos',
      required: true,
      minLength: 5,
      maxLength: 100,
      helpText: 'El asunto debe ser claro y descriptivo (mínimo 5 caracteres)'
    },
    {
      id: 'email-message',
      label: '📧 Correo Electrónico - Mensaje',
      type: 'textarea',
      placeholder: 'Escribe tu mensaje aquí...',
      required: true,
      minLength: 20,
      maxLength: 500,
      helpText: 'Escribe un mensaje claro y profesional (mínimo 20 caracteres)'
    },
    {
      id: 'whatsapp-phone',
      label: '💬 WhatsApp - Número de teléfono',
      type: 'tel',
      placeholder: '+502 1234-5678',
      required: true,
      helpText: 'Incluye el código de país (Ej: +502 para Guatemala)'
    },
    {
      id: 'whatsapp-message',
      label: '💬 WhatsApp - Mensaje',
      type: 'textarea',
      placeholder: 'Hola, me gustaría saber más sobre...',
      required: true,
      minLength: 10,
      maxLength: 300,
      helpText: 'Escribe un mensaje amigable y directo (mínimo 10 caracteres)'
    }
  ];

  return (
    <InteractiveExercise
      moduleNumber={1}
      title="Ejercicio Práctico: Enviar un correo y un mensaje por WhatsApp"
      description="Practica escribiendo un correo electrónico y un mensaje de WhatsApp como si contactaras a un cliente o proveedor."
      fields={fields}
      onComplete={onComplete}
      isCompleted={isCompleted}
      savedData={savedData}
    />
  );
};
