import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, ChevronDown, ArrowRight, ClipboardCheck } from 'lucide-react';
import { parseCSV } from '../../../utils/csvParser';
import { bulkRecordAttendance, getAllParticipantsForMatching } from '../../../services/participantService';
import type { AttendanceStatus, Enrollment } from '../../../types/participants';

const UNMAPPED = -1;

interface AttendanceImportResult {
  matched: number;
  unmatched: string[];
  total: number;
}

function resolveAttendanceStatus(raw: string): AttendanceStatus {
  const v = raw.toLowerCase().trim();
  if (v.includes('ausent') || v === 'absent' || v === 'no' || v === '0') return 'absent';
  if (v.includes('tard') || v === 'late' || v.includes('retras')) return 'late';
  if (v.includes('excus') || v === 'excused' || v.includes('justific')) return 'excused';
  return 'present';
}

type Step = 'upload' | 'mapping' | 'preview' | 'importing' | 'results';

interface Props {
  sessionId: string;
  enrolledParticipants: Enrollment[];
  onClose: () => void;
  onComplete: () => void;
}

const AttendanceImportModal: React.FC<Props> = ({ sessionId, enrolledParticipants, onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [emailCol, setEmailCol] = useState(UNMAPPED);
  const [nameCol, setNameCol] = useState(UNMAPPED);
  const [statusCol, setStatusCol] = useState(UNMAPPED);
  const [importResult, setImportResult] = useState<AttendanceImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      if (parsed.headers.length === 0 || parsed.rows.length === 0) {
        setError('El archivo no contiene datos válidos.');
        return;
      }
      setFileName(file.name);
      setHeaders(parsed.headers);
      setRows(parsed.rows);

      const eIdx = parsed.headers.findIndex(h => h.includes('email') || h.includes('correo'));
      const nIdx = parsed.headers.findIndex(h => h === 'nombre' || h === 'nombre completo' || h === 'name' || h.includes('nombre'));
      const sIdx = parsed.headers.findIndex(h => h.includes('estado') || h.includes('status') || h.includes('asistencia'));

      setEmailCol(eIdx);
      setNameCol(nIdx);
      setStatusCol(sIdx);
      setStep('mapping');
    } catch {
      setError('No se pudo leer el archivo.');
    }
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) processFile(file);
    else setError('Selecciona un archivo CSV.');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const canProceed = emailCol !== UNMAPPED || nameCol !== UNMAPPED;

  const handleImport = async () => {
    setStep('importing');
    try {
      let allParticipants: { id: string; first_name: string; last_name: string; primary_email: string }[] = [];
      if (nameCol !== UNMAPPED && emailCol === UNMAPPED) {
        allParticipants = await getAllParticipantsForMatching();
      }

      const enrolledMap = new Map<string, string>();
      const enrolledNameMap = new Map<string, string>();
      for (const ep of enrolledParticipants) {
        const p = ep.participant as any;
        if (!p) continue;
        enrolledMap.set(p.primary_email?.toLowerCase(), p.id);
        enrolledNameMap.set(`${p.first_name} ${p.last_name}`.toLowerCase(), p.id);
      }

      const allEmailMap = new Map<string, string>();
      const allNameMap = new Map<string, string>();
      for (const p of allParticipants) {
        allEmailMap.set(p.primary_email.toLowerCase(), p.id);
        allNameMap.set(`${p.first_name} ${p.last_name}`.toLowerCase(), p.id);
      }

      const records: { participant_id: string; session_id: string; status: AttendanceStatus }[] = [];
      const unmatched: string[] = [];

      for (const row of rows) {
        const email = emailCol !== UNMAPPED ? row[emailCol]?.toLowerCase().trim() : '';
        const name = nameCol !== UNMAPPED ? row[nameCol]?.trim().toLowerCase() : '';
        const rawStatus = statusCol !== UNMAPPED ? row[statusCol] || '' : '';

        let participantId: string | undefined;

        if (email) {
          participantId = enrolledMap.get(email) || allEmailMap.get(email);
        }
        if (!participantId && name) {
          participantId = enrolledNameMap.get(name) || allNameMap.get(name);
        }

        if (!participantId) {
          unmatched.push(email || name || `Fila: ${row.join(', ').slice(0, 60)}`);
          continue;
        }

        records.push({
          participant_id: participantId,
          session_id: sessionId,
          status: rawStatus ? resolveAttendanceStatus(rawStatus) : 'present',
        });
      }

      if (records.length > 0) {
        await bulkRecordAttendance(records);
      }

      setImportResult({ matched: records.length, unmatched, total: rows.length });
      setStep('results');
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      setStep('mapping');
    }
  };

  const previewRows = rows.slice(0, 5).map(row => ({
    email: emailCol !== UNMAPPED ? row[emailCol] || '' : '',
    name: nameCol !== UNMAPPED ? row[nameCol] || '' : '',
    status: statusCol !== UNMAPPED ? row[statusCol] || 'Presente (por defecto)' : 'Presente (por defecto)',
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Importar Asistencia</h2>
              <p className="text-sm text-gray-500">Desde archivo CSV</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            {(['upload', 'mapping', 'results'] as const).map((s, i) => {
              const labels = ['Subir archivo', 'Mapear y vista previa', 'Resultados'];
              const order = ['upload', 'mapping', 'preview', 'importing', 'results'];
              const isActive = order.indexOf(step) >= order.indexOf(s);
              return (
                <React.Fragment key={s}>
                  {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300 flex-shrink-0" />}
                  <span className={`font-medium ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>{labels[i]}</span>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {step === 'upload' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-1">Arrastra tu archivo CSV aquí</p>
              <p className="text-gray-400 text-sm mb-4">o haz clic para seleccionar</p>
              <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileSelect} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                Seleccionar archivo
              </button>
              <p className="text-xs text-gray-400 mt-6">
                El CSV debe contener una columna de email o nombre para identificar participantes.
                <br />Opcionalmente incluye una columna de estado (presente/ausente/tarde/excusado).
              </p>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <FileText className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-emerald-700">{fileName}</span>
                  <span className="text-emerald-600 ml-2">{rows.length} filas</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <div className="relative">
                    <select
                      value={emailCol}
                      onChange={e => setEmailCol(parseInt(e.target.value))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${emailCol !== UNMAPPED ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200'}`}
                    >
                      <option value={UNMAPPED}>— No asignar —</option>
                      {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nombre (respaldo)</label>
                  <div className="relative">
                    <select
                      value={nameCol}
                      onChange={e => setNameCol(parseInt(e.target.value))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${nameCol !== UNMAPPED ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200'}`}
                    >
                      <option value={UNMAPPED}>— No asignar —</option>
                      {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                  <div className="relative">
                    <select
                      value={statusCol}
                      onChange={e => setStatusCol(parseInt(e.target.value))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${statusCol !== UNMAPPED ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200'}`}
                    >
                      <option value={UNMAPPED}>— Marcar todos como presente —</option>
                      {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {emailCol === UNMAPPED && nameCol !== UNMAPPED && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3">
                  Sin columna de email, se buscará por nombre completo. Puede haber coincidencias imprecisas si hay nombres repetidos.
                </p>
              )}

              <p className="text-sm font-medium text-gray-700 mt-2">Vista previa:</p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Nombre</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewRows.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-gray-600">{row.email || '—'}</td>
                        <td className="px-4 py-2 text-gray-600">{row.name || '—'}</td>
                        <td className="px-4 py-2 text-gray-500">{row.status || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto mb-6"></div>
              <p className="text-gray-700 font-medium">Procesando asistencia...</p>
            </div>
          )}

          {step === 'results' && importResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                <CheckCircle className="h-8 w-8 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 text-lg">Importación completada</p>
                  <p className="text-emerald-600 text-sm">{importResult.total} filas procesadas</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
                  <p className="text-2xl font-bold text-emerald-600">{importResult.matched}</p>
                  <p className="text-xs text-gray-500 mt-1">Registros actualizados</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
                  <p className="text-2xl font-bold text-amber-600">{importResult.unmatched.length}</p>
                  <p className="text-xs text-gray-500 mt-1">No encontrados</p>
                </div>
              </div>

              {importResult.unmatched.length > 0 && (
                <div className="border border-amber-100 rounded-xl overflow-hidden">
                  <div className="bg-amber-50 px-4 py-2">
                    <p className="text-sm font-medium text-amber-700">Participantes no encontrados</p>
                  </div>
                  <div className="max-h-40 overflow-y-auto divide-y divide-amber-50">
                    {importResult.unmatched.slice(0, 20).map((id, i) => (
                      <div key={i} className="px-4 py-2 text-xs text-amber-600">{id}</div>
                    ))}
                    {importResult.unmatched.length > 20 && (
                      <div className="px-4 py-2 text-xs text-amber-400 text-center">
                        ...y {importResult.unmatched.length - 20} más
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => {
              if (step === 'mapping') setStep('upload');
              else onClose();
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {step === 'results' ? 'Cerrar' : 'Atrás'}
          </button>

          {step === 'mapping' && (
            <button
              onClick={handleImport}
              disabled={!canProceed}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Importar asistencia
            </button>
          )}

          {step === 'results' && (
            <button
              onClick={() => { onComplete(); onClose(); }}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
            >
              Listo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceImportModal;
