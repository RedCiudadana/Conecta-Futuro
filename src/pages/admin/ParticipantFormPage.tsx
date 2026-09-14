import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import {
  createParticipant,
  updateParticipant,
  getParticipantById,
  getOrganizations,
  checkDuplicateEmail,
  checkDuplicateDPI,
} from '../../services/participantService';
import type { Organization, ParticipantStatus, Gender, DigitalSkillLevel } from '../../types/participants';
import { GUATEMALA_DEPARTMENTS, STATUS_LABELS } from '../../types/participants';

interface FormData {
  first_name: string;
  last_name: string;
  primary_email: string;
  phone: string;
  dpi: string;
  gender: Gender | '';
  birth_date: string;
  municipality: string;
  department: string;
  organization_id: string;
  role_in_org: string;
  digital_skill_level: DigitalSkillLevel | '';
  how_found_us: string;
  status: ParticipantStatus;
  notes: string;
}

const emptyForm: FormData = {
  first_name: '', last_name: '', primary_email: '', phone: '', dpi: '',
  gender: '', birth_date: '', municipality: '', department: '', organization_id: '',
  role_in_org: '', digital_skill_level: '', how_found_us: '', status: 'registered', notes: '',
};

const ParticipantFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState<FormData>(emptyForm);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    getOrganizations().then(setOrganizations).catch(() => {});
    if (isEditing) {
      setLoading(true);
      getParticipantById(id)
        .then(p => {
          if (p) {
            setForm({
              first_name: p.first_name,
              last_name: p.last_name,
              primary_email: p.primary_email,
              phone: p.phone || '',
              dpi: p.dpi || '',
              gender: p.gender || '',
              birth_date: p.birth_date || '',
              municipality: p.municipality || '',
              department: p.department || '',
              organization_id: p.organization_id || '',
              role_in_org: p.role_in_org || '',
              digital_skill_level: p.digital_skill_level || '',
              how_found_us: p.how_found_us || '',
              status: p.status,
              notes: p.notes || '',
            });
          }
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setDuplicateWarning(null);
  };

  const checkDuplicates = async (): Promise<boolean> => {
    if (form.primary_email) {
      const dup = await checkDuplicateEmail(form.primary_email, id);
      if (dup) {
        setDuplicateWarning(`Ya existe un participante con este email: ${dup.first_name} ${dup.last_name}`);
        return true;
      }
    }
    if (form.dpi) {
      const dup = await checkDuplicateDPI(form.dpi, id);
      if (dup) {
        setDuplicateWarning(`Ya existe un participante con este DPI: ${dup.first_name} ${dup.last_name}`);
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.first_name.trim() || !form.last_name.trim() || !form.primary_email.trim()) {
      setError('Nombre, apellido y email son obligatorios.');
      return;
    }

    setSaving(true);
    try {
      const hasDuplicate = await checkDuplicates();
      if (hasDuplicate) { setSaving(false); return; }

      const payload: any = { ...form };
      if (!payload.gender) delete payload.gender;
      if (!payload.digital_skill_level) delete payload.digital_skill_level;
      if (!payload.organization_id) payload.organization_id = null;
      if (!payload.dpi) payload.dpi = null;
      if (!payload.birth_date) payload.birth_date = null;

      if (isEditing) {
        await updateParticipant(id, payload);
        navigate(`/admin/participantes/${id}`);
      } else {
        const created = await createParticipant(payload);
        navigate(`/admin/participantes/${created.id}`);
      }
    } catch (e: any) {
      setError(e.message || 'Error al guardar participante.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Participante' : 'Nuevo Participante'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEditing ? 'Actualiza la información del participante' : 'Registra un nuevo participante en el sistema'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {duplicateWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{duplicateWarning}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {/* Personal Info */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input name="primary_email" type="email" value={form.primary_email} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DPI</label>
              <input name="dpi" value={form.dpi} onChange={handleChange} maxLength={13}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Seleccionar...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero_no_decir">Prefiero no decir</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input name="birth_date" type="date" value={form.birth_date} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <select name="department" value={form.department} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Seleccionar...</option>
                {GUATEMALA_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
              <input name="municipality" value={form.municipality} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Organización</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organización</label>
              <select name="organization_id" value={form.organization_id} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Sin organización</option>
                {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol en la organización</label>
              <input name="role_in_org" value={form.role_in_org} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
        </div>

        {/* Digital Profile */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Perfil Digital</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de habilidad digital</label>
              <select name="digital_skill_level" value={form.digital_skill_level} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Seleccionar...</option>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">¿Cómo nos encontró?</label>
              <input name="how_found_us" value={form.how_found_us} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Notas Internas</h2>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Notas visibles solo para administradores..." />
        </div>

        {/* Actions */}
        <div className="p-6 flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            className="inline-flex items-center px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-60">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Participante'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipantFormPage;
