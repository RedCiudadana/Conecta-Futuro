import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, UserPlus, ChevronLeft, ChevronRight, Filter, X,
  Download, Upload, Users, Building2, Award, BookOpen,
} from 'lucide-react';
import CSVImportModal from '../../components/ui/admin/CSVImportModal';
import { getParticipants } from '../../services/participantService';
import type { Participant, ParticipantFilters, ParticipantStatus } from '../../types/participants';
import { STATUS_LABELS, STATUS_COLORS, GUATEMALA_DEPARTMENTS } from '../../types/participants';

const ParticipantListPage: React.FC = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ParticipantFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const pageSize = 25;
  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getParticipants(filters, page);
      setParticipants(result.data);
      setTotalCount(result.count);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => {
    setPage(1);
    setFilters(prev => ({ ...prev, search: searchInput }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput('');
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  const handleExportCSV = () => {
    if (participants.length === 0) return;
    const headers = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'DPI', 'Institución', 'Departamento', 'Estado', 'Emprendedor', 'Servidor Público', 'Fecha Registro'];
    const rows = participants.map(p => [
      p.first_name, p.last_name, p.primary_email, p.phone || '', p.dpi || '',
      p.institution || '', p.department || '', STATUS_LABELS[p.status],
      p.business_owner ? 'Sí' : 'No', p.public_official ? 'Sí' : 'No',
      new Date(p.created_at).toLocaleDateString('es-GT'),
    ]);
    const bom = '\uFEFF';
    const csv = bom + [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `participantes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participantes</h1>
          <p className="text-gray-500 mt-1">{totalCount} participantes registrados</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4 mr-2" />Importar
          </button>
          <button onClick={handleExportCSV}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />Exportar
          </button>
          <Link to="/dashboard/participantes/nuevo"
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium shadow-sm">
            <UserPlus className="h-4 w-4 mr-2" />Nuevo
          </Link>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Buscar por nombre, email, DPI, teléfono o institución..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <button onClick={handleSearch} className="px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium">Buscar</button>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
              hasActiveFilters ? 'border-sky-300 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}>
            <Filter className="h-4 w-4 mr-2" />Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-sky-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="inline-flex items-center px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4 mr-1" /> Limpiar
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterSelect label="Estado" value={filters.status || ''}
              onChange={v => { setFilters(prev => ({ ...prev, status: v as ParticipantStatus | '' })); setPage(1); }}
              options={Object.entries(STATUS_LABELS).map(([val, label]) => ({ value: val, label }))} />
            <FilterSelect label="Departamento" value={filters.department || ''}
              onChange={v => { setFilters(prev => ({ ...prev, department: v })); setPage(1); }}
              options={GUATEMALA_DEPARTMENTS.map(d => ({ value: d, label: d }))} />
            <FilterSelect label="Género" value={filters.gender || ''}
              onChange={v => { setFilters(prev => ({ ...prev, gender: v as any })); setPage(1); }}
              options={[{ value: 'masculino', label: 'Masculino' }, { value: 'femenino', label: 'Femenino' }, { value: 'otro', label: 'Otro' }]} />
            <FilterSelect label="Nivel Digital" value={filters.digital_skill_level || ''}
              onChange={v => { setFilters(prev => ({ ...prev, digital_skill_level: v as any })); setPage(1); }}
              options={[{ value: 'basico', label: 'Básico' }, { value: 'intermedio', label: 'Intermedio' }, { value: 'avanzado', label: 'Avanzado' }]} />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Institución</label>
              <input type="text" value={filters.institution || ''}
                onChange={e => { setFilters(prev => ({ ...prev, institution: e.target.value })); setPage(1); }}
                placeholder="Filtrar por institución..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
              <input type="date" value={filters.date_from || ''}
                onChange={e => { setFilters(prev => ({ ...prev, date_from: e.target.value })); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
              <input type="date" value={filters.date_to || ''}
                onChange={e => { setFilters(prev => ({ ...prev, date_to: e.target.value })); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600 text-sm">{error}</div>
        ) : participants.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron participantes</p>
            <p className="text-gray-400 text-sm mt-1">Intenta con otros filtros o agrega un nuevo participante</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Participante</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Institución</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Departamento</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {participants.map(p => (
                  <tr key={p.id} onClick={() => navigate(`/dashboard/participantes/${p.id}`)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {p.first_name[0]}{p.last_name[0]}
                        </div>
                        <div className="ml-3 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.first_name} {p.last_name}</p>
                          <p className="text-xs text-gray-400 truncate">{p.primary_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600 truncate block max-w-[200px]">
                        {p.institution || (p.organization as any)?.name || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{p.department || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                        {STATUS_LABELS[p.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {new Date(p.created_at).toLocaleDateString('es-GT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalCount)} de {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
      {showImportModal && (
        <CSVImportModal
          onClose={() => setShowImportModal(false)}
          onComplete={() => { setPage(1); fetchData(); }}
        />
      )}
    </>
  );
};

const FilterSelect: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
      <option value="">Todos</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export default ParticipantListPage;
