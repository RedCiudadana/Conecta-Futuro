import React, { useState, useCallback, useEffect } from 'react';
import {
  Database, Download, Upload, Trash2, AlertTriangle, CheckCircle,
  Loader2, Users, FileText, ShieldAlert, RefreshCw,
} from 'lucide-react';
import CSVImportModal from '../../components/ui/admin/CSVImportModal';
import {
  getAllParticipantsForExport,
  deleteAllParticipants,
  getParticipants,
} from '../../services/participantService';
import { STATUS_LABELS } from '../../types/participants';
import type { Participant } from '../../types/participants';

const DatabaseManagementPage: React.FC = () => {
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [showImportModal, setShowImportModal] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{ count: number } | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getParticipants({}, 1);
      setTotalCount(result.count);
    } catch {
      setTotalCount(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  const handleExport = async () => {
    setExporting(true);
    setExportDone(false);
    setFeedback(null);
    try {
      const participants = await getAllParticipantsForExport();
      if (participants.length === 0) {
        setFeedback({ type: 'error', msg: 'No hay participantes para exportar.' });
        setExporting(false);
        return;
      }
      const csv = buildCSV(participants);
      downloadCSV(csv, `participantes_completo_${new Date().toISOString().slice(0, 10)}.csv`);
      setExportDone(true);
      setFeedback({ type: 'success', msg: `Se exportaron ${participants.length} participantes.` });
    } catch (err: any) {
      setFeedback({ type: 'error', msg: `Error al exportar: ${err.message}` });
    }
    setExporting(false);
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    setFeedback(null);
    try {
      const count = await deleteAllParticipants();
      setDeleteResult({ count });
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
      setFeedback({ type: 'success', msg: `Se eliminaron ${count} participantes de la base de datos.` });
      fetchCount();
    } catch (err: any) {
      setFeedback({ type: 'error', msg: `Error al eliminar: ${err.message}` });
    }
    setDeleting(false);
  };

  const handleImportComplete = () => {
    fetchCount();
    setFeedback({ type: 'success', msg: 'Importacion completada exitosamente.' });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="h-7 w-7 text-sky-600" />
            Base de Datos
          </h1>
          <p className="text-gray-500 mt-1">Importar, exportar y gestionar la base de datos de participantes</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-sky-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de participantes</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{totalCount?.toLocaleString('es-GT')}</p>
                )}
              </div>
            </div>
            <button
              onClick={fetchCount}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              title="Actualizar"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-xl flex items-start gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-100'
              : 'bg-red-50 border border-red-100'
          }`}>
            {feedback.type === 'success'
              ? <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              : <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            }
            <p className={`text-sm font-medium ${
              feedback.type === 'success' ? 'text-emerald-800' : 'text-red-800'
            }`}>{feedback.msg}</p>
          </div>
        )}

        {/* Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Import */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <Upload className="h-5 w-5 text-sky-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Importar</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Carga participantes desde un archivo CSV. Compatible con exportaciones de Google Forms, Google Sheets y Excel. Los duplicados se detectan automaticamente.
            </p>
            <button
              onClick={() => { setShowImportModal(true); setFeedback(null); }}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium text-sm shadow-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar CSV
            </button>
          </div>

          {/* Export */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Download className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Exportar</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Descarga todos los participantes en formato CSV. Incluye nombre, correo, telefono, DPI, departamento, institucion, estado y fecha de registro.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting || totalCount === 0}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar todos ({totalCount?.toLocaleString('es-GT') ?? '...'})
                </>
              )}
            </button>
          </div>

          {/* Delete */}
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Borrar datos</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Elimina todos los participantes de la base de datos. Esta accion tambien eliminara inscripciones, asistencias y certificados asociados. No se puede deshacer.
            </p>
            <button
              onClick={() => { setShowDeleteConfirm(true); setDeleteConfirmText(''); setFeedback(null); }}
              disabled={totalCount === 0}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Borrar base de datos
            </button>
          </div>
        </div>

        {/* Export info */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Formato de exportacion
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            El archivo CSV exportado incluye las columnas: Nombre, Apellido, Email, Telefono, DPI, Departamento, Municipio, Genero, Nivel Digital, Institucion, Estado, Fecha de Registro. Puedes abrirlo en Excel, Google Sheets o cualquier herramienta de hojas de calculo.
          </p>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <CSVImportModal
          onClose={() => setShowImportModal(false)}
          onComplete={handleImportComplete}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Borrar todos los participantes</h3>
                <p className="text-sm text-red-600 font-medium">Esta accion no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
              <p className="text-sm text-red-800">
                Se eliminaran permanentemente <span className="font-bold">{totalCount?.toLocaleString('es-GT')}</span> participantes junto con todas sus inscripciones, registros de asistencia y certificados.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escribe <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-red-600">BORRAR TODO</span> para confirmar:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="BORRAR TODO"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={deleting}
                autoFocus
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleteConfirmText !== 'BORRAR TODO' || deleting}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Borrar todo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function buildCSV(participants: Participant[]): string {
  const headers = [
    'Nombre', 'Apellido', 'Email', 'Telefono', 'DPI',
    'Departamento', 'Municipio', 'Genero', 'Nivel Digital',
    'Institucion', 'Estado', 'Fecha Registro',
  ];

  const rows = participants.map(p => [
    p.first_name,
    p.last_name,
    p.primary_email,
    p.phone || '',
    p.dpi || '',
    p.department || '',
    p.municipality || '',
    p.gender || '',
    p.digital_skill_level || '',
    (p.organization as any)?.name || '',
    STATUS_LABELS[p.status] || p.status,
    new Date(p.created_at).toLocaleDateString('es-GT'),
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default DatabaseManagementPage;
