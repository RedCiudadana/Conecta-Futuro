import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Sparkles, Download } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  interest: string;
  status: string;
}

interface Module8ExerciseProps {
  onComplete: (data: Record<string, string>) => void;
  isCompleted?: boolean;
  savedData?: Record<string, string>;
}

export const Module8Exercise: React.FC<Module8ExerciseProps> = ({
  onComplete,
  isCompleted,
  savedData
}) => {
  const [formData, setFormData] = useState(() => {
    if (savedData) {
      return {
        product: savedData.product || '',
        pricing: savedData.pricing || '',
        promotion: savedData.promotion || '',
        distribution: savedData.distribution || ''
      };
    }
    return {
      product: '',
      pricing: '',
      promotion: '',
      distribution: ''
    };
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    if (savedData?.contacts) {
      try {
        return JSON.parse(savedData.contacts);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [currentContact, setCurrentContact] = useState({
    name: '',
    phone: '',
    interest: '',
    status: 'Nuevo'
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const validateContact = () => {
    return (
      currentContact.name.length >= 3 &&
      currentContact.phone.length >= 8 &&
      currentContact.interest.length >= 3
    );
  };

  const addContact = () => {
    if (validateContact()) {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...currentContact
      };
      setContacts([...contacts, newContact]);
      setCurrentContact({ name: '', phone: '', interest: '', status: 'Nuevo' });
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const isFormValid = () => {
    return (
      formData.product.length >= 30 &&
      formData.pricing.length >= 20 &&
      formData.promotion.length >= 30 &&
      formData.distribution.length >= 20 &&
      contacts.length >= 5
    );
  };

  const handleComplete = () => {
    if (isFormValid()) {
      const data = {
        ...formData,
        contacts: JSON.stringify(contacts)
      };
      onComplete(data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    setFormData({
      product: '',
      pricing: '',
      promotion: '',
      distribution: ''
    });
    setContacts([]);
    setCurrentContact({ name: '', phone: '', interest: '', status: 'Nuevo' });
  };

  const downloadPlan = () => {
    const planText = `
MI PLAN DE NEGOCIO DIGITAL
========================================

1. PRODUCTO: ¿Qué vendo?
${formData.product}

2. PRECIO: ¿Cómo lo precio?
${formData.pricing}

3. PROMOCIÓN: ¿Cómo lo promociono?
${formData.promotion}

4. PLAZA: ¿Cómo lo entrego?
${formData.distribution}

5. CONTACTOS DE CLIENTES (${contacts.length})
${contacts.map((c, i) => `
   Cliente ${i + 1}:
   - Nombre: ${c.name}
   - Teléfono: ${c.phone}
   - Interés: ${c.interest}
   - Estado: ${c.status}
`).join('\n')}

Creado con Mis Primeros Pasos Digitales
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-plan-de-negocio-digital.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
      <div className="mb-6">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center text-lg">
          <Sparkles className="w-5 h-5 mr-2" />
          ✏️ Ejercicio Práctico: Diseña tu plan básico de ventas digitales
        </h4>
        <p className="text-green-800 mb-4">
          Completa las 4P del marketing (Producto, Precio, Promoción, Plaza) y agrega 5 contactos de clientes potenciales.
        </p>

        {!isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-green-700">
              <span>Progreso del plan</span>
              <span className="font-medium">
                {[
                  formData.product.length >= 30,
                  formData.pricing.length >= 20,
                  formData.promotion.length >= 30,
                  formData.distribution.length >= 20,
                  contacts.length >= 5
                ].filter(Boolean).length} / 5 secciones completadas
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${([
                    formData.product.length >= 30,
                    formData.pricing.length >= 20,
                    formData.promotion.length >= 30,
                    formData.distribution.length >= 20,
                    contacts.length >= 5
                  ].filter(Boolean).length / 5) * 100}%`
                }}
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
              <p className="text-sm">Has completado tu plan de negocio digital</p>
            </div>
          </div>

          <button
            onClick={downloadPlan}
            className="mb-4 flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors"
          >
            <Download className="w-5 h-5" />
            Descargar Mi Plan
          </button>

          <button
            onClick={handleReset}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Volver a intentar para practicar →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Las 4P de tu Negocio</h5>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    📦 1. PRODUCTO: ¿Qué vendo? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    placeholder="Describe tu producto o servicio: características, beneficios, para quién es..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 min-h-[100px] resize-none"
                    maxLength={300}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.product.length} / 300 (mínimo 30)</p>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    💰 2. PRECIO: ¿Cómo lo precio? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    placeholder="Explica tu estrategia de precios: costo + ganancia, precios de competencia, promociones..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 min-h-[100px] resize-none"
                    maxLength={250}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.pricing.length} / 250 (mínimo 20)</p>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    📢 3. PROMOCIÓN: ¿Cómo lo promociono? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.promotion}
                    onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
                    placeholder="¿Dónde y cómo darás a conocer tu producto? Facebook, WhatsApp, boca a boca, volantes..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 min-h-[100px] resize-none"
                    maxLength={300}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.promotion.length} / 300 (mínimo 30)</p>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    🚚 4. PLAZA: ¿Cómo lo entrego? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.distribution}
                    onChange={(e) => setFormData({ ...formData, distribution: e.target.value })}
                    placeholder="Formas de entrega: domicilio, punto de recogida, envío, horarios..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 min-h-[100px] resize-none"
                    maxLength={250}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.distribution.length} / 250 (mínimo 20)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 space-y-4">
            <h5 className="font-semibold text-gray-900">
              📇 Contactos de Clientes Potenciales (Mínimo 5)
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2 text-sm">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentContact.name}
                  onChange={(e) => setCurrentContact({ ...currentContact, name: e.target.value })}
                  placeholder="Nombre del cliente"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2 text-sm">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={currentContact.phone}
                  onChange={(e) => setCurrentContact({ ...currentContact, phone: e.target.value })}
                  placeholder="+502 1234-5678"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2 text-sm">
                  Producto de Interés <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentContact.interest}
                  onChange={(e) => setCurrentContact({ ...currentContact, interest: e.target.value })}
                  placeholder="¿Qué le interesa?"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2 text-sm">
                  Estado
                </label>
                <select
                  value={currentContact.status}
                  onChange={(e) => setCurrentContact({ ...currentContact, status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500"
                >
                  <option>Nuevo</option>
                  <option>Contactado</option>
                  <option>Interesado</option>
                  <option>Cliente</option>
                </select>
              </div>
            </div>

            <button
              onClick={addContact}
              disabled={!validateContact()}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                validateContact()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-5 h-5" />
              Agregar Contacto
            </button>

            {contacts.length > 0 && (
              <div className="mt-4">
                <h6 className="font-semibold text-gray-900 mb-3">Contactos Agregados ({contacts.length})</h6>
                <div className="space-y-2">
                  {contacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone} • {contact.interest}</p>
                        <span className="text-xs text-gray-500">{contact.status}</span>
                      </div>
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Eliminar contacto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleComplete}
              disabled={!isFormValid()}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                isFormValid()
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isFormValid() ? '✅ Completar Mi Plan' : `⏳ Completa todas las secciones`}
            </button>
            {(Object.values(formData).some(v => v) || contacts.length > 0) && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg p-8 max-w-md shadow-2xl transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Felicitaciones!</h3>
              <p className="text-gray-600 mb-4">
                Has completado tu plan de negocio digital. ¡Estás lista para emprender!
              </p>
              <p className="text-sm text-primary-600 font-medium">
                ¡Éxito en tu emprendimiento! 🚀
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
