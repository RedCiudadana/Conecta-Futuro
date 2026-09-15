import React, { useState } from 'react';
import { Info, CheckCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import { GUATEMALA_DEPARTMENTS } from '../types/participants';
import { trackEvent } from '../services/analyticsEventService';

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const PUEBLOS = ['Maya', 'Garífuna', 'Xinka', 'Ladino/Mestizo', 'Otro', 'Prefiero no decir'];
const URBAN_RURAL = ['Urbana', 'Rural'];
const EMPLOYMENT = ['Empleado/a', 'Independiente', 'Desempleado/a', 'Estudiante', 'Jubilado/a', 'Otro'];

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [consent, setConsent] = useState(false);
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [department, setDepartment] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [urbanRural, setUrbanRural] = useState('');
  const [pueblo, setPueblo] = useState('');
  const [employment, setEmployment] = useState('');
  const [hasBusiness, setHasBusiness] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const [firstName, ...rest] = fullName.trim().split(' ');
        const lastName = rest.join(' ');

        await supabase.from('participants').upsert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName || '',
          primary_email: email,
          gender: gender || null,
          department: department || null,
          municipality: municipality || null,
          age_range: ageRange || null,
          urban_rural: urbanRural || null,
          pueblo: pueblo || null,
          employment_situation: employment || null,
          business_owner: hasBusiness,
          profile_data_consent: consent,
          profile_consent_date: consent ? new Date().toISOString() : null,
          status: 'registered',
        });

        trackEvent('registration', { metadata: { source: 'public_form' } });
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('[Register] Error:', err);
      setError(err.message ?? 'No pudimos crear tu cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta creada!</h2>
          <p className="text-gray-600">Revisa tu correo para confirmar tu registro.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Únete a la plataforma y accede a cursos, recursos y certificados.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Cuenta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Datos de cuenta</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Datos de perfil opcional */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Datos de perfil (opcionales)</h3>
                <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Estos datos nos ayudan a entender quién llega a la plataforma y medir el impacto de la formación.
                    Son completamente opcionales. Los usamos solo en formato agregado y nunca compartimos tu información individual.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rango de edad</label>
                  <select value={ageRange} onChange={e => setAgeRange(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Prefiero no decir</option>
                    {AGE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Género</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Prefiero no decir</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Departamento</label>
                  <select value={department} onChange={e => setDepartment(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Seleccionar</option>
                    {GUATEMALA_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Municipio</label>
                  <input type="text" value={municipality} onChange={e => setMunicipality(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Zona</label>
                  <select value={urbanRural} onChange={e => setUrbanRural(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Prefiero no decir</option>
                    {URBAN_RURAL.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pueblo de pertenencia</label>
                  <select value={pueblo} onChange={e => setPueblo(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Prefiero no decir</option>
                    {PUEBLOS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Situación laboral</label>
                  <select value={employment} onChange={e => setEmployment(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Prefiero no decir</option>
                    {EMPLOYMENT.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBusiness}
                      onChange={e => setHasBusiness(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Tengo un emprendimiento o negocio</span>
                  </label>
                </div>
              </div>

              {/* Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto compartir mis datos de perfil para fines de análisis de impacto. Entiendo que mis datos se usarán de forma agregada y anónima, y que puedo retirar mi consentimiento en cualquier momento.
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
