import React, { useState, useEffect } from 'react';
import { useAccount } from '../../contexts/AccountContext';
import { updateMyProfile } from '../../services/accountService';
import { GUATEMALA_DEPARTMENTS } from '../../types/participants';
import { UserCircle, Save, Loader2, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const GENDERS = ['Femenino', 'Masculino', 'Otro', 'Prefiero no decir'];
const PUEBLOS = ['Maya', 'Garífuna', 'Xinka', 'Ladino/Mestizo', 'Otro', 'Prefiero no decir'];
const URBAN_RURAL = ['Urbana', 'Rural'];
const EMPLOYMENT = ['Empleado/a', 'Independiente', 'Desempleado/a', 'Estudiante', 'Jubilado/a', 'Otro'];
const SKILL_LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

const MyProfile: React.FC = () => {
  const { accountData, loading, refresh } = useAccount();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    phone: '',
    gender: '',
    department: '',
    municipality: '',
    age_range: '',
    urban_rural: '',
    pueblo: '',
    employment_situation: '',
    digital_skill_level: '',
    institution: '',
  });

  useEffect(() => {
    if (accountData?.participant) {
      const p = accountData.participant;
      setForm({
        phone: p.phone ?? '',
        gender: p.gender ?? '',
        department: p.department ?? '',
        municipality: p.municipality ?? '',
        age_range: p.age_range ?? '',
        urban_rural: p.urban_rural ?? '',
        pueblo: p.pueblo ?? '',
        employment_situation: p.employment_situation ?? '',
        digital_skill_level: p.digital_skill_level ?? '',
        institution: p.institution ?? '',
      });
    }
  }, [accountData]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateMyProfile(form);
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-600" /></div>;
  }

  if (!accountData?.participant) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <UserCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No hay perfil para mostrar</p>
      </div>
    );
  }

  const p = accountData.participant;

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Mi Perfil</h1>
        <p className="text-sm text-gray-500">Actualiza tus datos personales</p>
      </div>

      {/* Read-only info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Información de cuenta</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
              <UserCircle className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Nombre</p>
              <p className="text-sm font-medium text-gray-800">{p.first_name} {p.last_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Correo</p>
              <p className="text-sm font-medium text-gray-800">{p.primary_email}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          El nombre y el correo no se pueden cambiar aquí. Contacta al equipo de soporte si necesitas actualizarlos.
        </p>
      </div>

      {/* Editable form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Datos personales</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="1234-5678"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Institución</label>
            <input
              type="text"
              value={form.institution}
              onChange={e => handleChange('institution', e.target.value)}
              placeholder="Municipalidad, organización, empresa..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Género</label>
            <select value={form.gender} onChange={e => handleChange('gender', e.target.value)} className={inputClass}>
              <option value="">Seleccionar...</option>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Rango de edad</label>
            <select value={form.age_range} onChange={e => handleChange('age_range', e.target.value)} className={inputClass}>
              <option value="">Seleccionar...</option>
              {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Departamento</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              <select value={form.department} onChange={e => handleChange('department', e.target.value)} className={`${inputClass} pl-10`}>
                <option value="">Seleccionar...</option>
                {GUATEMALA_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Municipio</label>
            <input
              type="text"
              value={form.municipality}
              onChange={e => handleChange('municipality', e.target.value)}
              placeholder="Municipio"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Zona</label>
            <select value={form.urban_rural} onChange={e => handleChange('urban_rural', e.target.value)} className={inputClass}>
              <option value="">Seleccionar...</option>
              {URBAN_RURAL.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Pueblo</label>
            <select value={form.pueblo} onChange={e => handleChange('pueblo', e.target.value)} className={inputClass}>
              <option value="">Seleccionar...</option>
              {PUEBLOS.map(p2 => <option key={p2} value={p2}>{p2}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Situación laboral</label>
            <select value={form.employment_situation} onChange={e => handleChange('employment_situation', e.target.value)} className={inputClass}>
              <option value="">Seleccionar...</option>
              {EMPLOYMENT.map(e2 => <option key={e2} value={e2}>{e2}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Nivel de habilidad digital</label>
            <select value={form.digital_skill_level} onChange={e => handleChange('digital_skill_level', e.target.value)} className={inputClass}>
              <option value="">Seleccionar...</option>
              {SKILL_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar cambios
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-emerald-600">
              <CheckCircle className="h-4 w-4" />
              Guardado
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
