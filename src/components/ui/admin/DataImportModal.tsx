import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, ArrowRight, Loader2, Info, Check, AlertTriangle } from 'lucide-react';
import { parseCSV } from '../../../utils/csvParser';
import type { ImportConfig } from '../../../utils/csvImportConfigs';
import { autoMapFields } from '../../../utils/csvImportConfigs';
import { bulkImportEnrollments, bulkImportCertificates, bulkImportAttendance, type BulkImportResult } from '../../../services/importService';

type Step = 'upload' | 'mapping' | 'preview' | 'importing' | 'results';

const importFns: Record<string, (rows: Record<string, string>[]) => Promise<BulkImportResult>> = {
  enrollments: bulkImportEnrollments,
  certificates: bulkImportCertificates,
  attendance: bulkImportAttendance,
};

interface Props {
  config: ImportConfig;
  onClose: () => void;
  onComplete: () => void;
}

const DataImportModal: React.FC<Props> = ({ config, onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
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
      const auto = autoMapFields(parsed.headers, config);
      setMapping(auto);
      setStep('mapping');
    } catch {
      setError('Error al leer el archivo. Verifica que sea un CSV válido.');
    }
  }, [config]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const requiredFieldsMapped = config.fields
    .filter(f => f.required)
    .every(f => mapping[f.key]);

  const mappedRows = rows.map(row => {
    const obj: Record<string, string> = {};
    for (const field of config.fields) {
      const headerName = mapping[field.key];
      if (headerName) {
        const idx = headers.indexOf(headerName);
        obj[field.key] = idx >= 0 ? row[idx] ?? '' : '';
      }
    }
    return obj;
  });

  const runImport = async () => {
    setStep('importing');
    try {
      const fn = importFns[config.id];
      if (!fn) throw new Error(`No import function for ${config.id}`);
      const result = await fn(mappedRows);
      setImportResult(result);
      setStep('results');
    } catch (err: any) {
      setError(err.message);
      setStep('results');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{config.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{config.subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100">
          {(['upload', 'mapping', 'preview', 'results'] as const).map((s, i) => {
            const labels = ['Subir', 'Mapear', 'Revisar', 'Resultados'];
            const isActive = ['upload', 'mapping', 'preview', 'importing', 'results'].indexOf(step) >= i;
            return (
              <React.Fragment key={s}>
                {i > 0 && <div className={`flex-1 h-0.5 ${isActive ? 'bg-sky-400' : 'bg-gray-200'}`} />}
                <div className={`flex items-center gap-1.5 text-xs font-medium ${isActive ? 'text-sky-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'}`}>
                    {i + 1}
                  </div>
                  <span className="hidden sm:inline">{labels[i]}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-sky-400 bg-sky-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <Upload className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-700">Arrastra tu archivo CSV aquí</p>
                <p className="text-xs text-gray-400 mt-1">o haz clic para seleccionar</p>
                <input ref={fileInputRef} type="file" accept=".csv,.txt,.tsv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
              </div>

              {/* Format guide */}
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sky-700">
                  <Info className="h-4 w-4" />
                  <p className="text-sm font-semibold">Formato esperado del CSV</p>
                </div>
                <p className="text-xs text-sky-600">El archivo debe tener una fila de encabezados con los nombres de las columnas. Estos son los campos que se importarán:</p>
                <div className="space-y-2">
                  {config.fields.map(field => (
                    <div key={field.key} className="flex items-start gap-2 text-xs">
                      <span className={`font-mono px-1.5 py-0.5 rounded shrink-0 ${field.required ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-500'}`}>{field.key}</span>
                      {field.required && <span className="text-red-400 font-bold shrink-0">*</span>}
                      <span className="text-gray-600">{field.description}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-sky-100 pt-3">
                  <p className="text-xs font-semibold text-sky-700 mb-1">Encabezado sugerido:</p>
                  <code className="text-xs text-sky-800 bg-white px-2 py-1 rounded block break-all">{config.sampleHeader}</code>
                </div>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span className="font-medium">{fileName}</span>
                <span className="text-gray-400">({rows.length} filas)</span>
              </div>
              <div className="space-y-4">
                {config.fields.map(field => {
                  const isMapped = !!mapping[field.key];
                  return (
                    <div key={field.key} className={`rounded-lg border p-3 transition-colors ${isMapped ? 'border-sky-200 bg-sky-50/30' : field.required ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <label className="text-sm font-medium text-gray-700 shrink-0 w-44">
                          {field.label} {field.required && <span className="text-red-400">*</span>}
                        </label>
                        <select
                          value={mapping[field.key] ?? ''}
                          onChange={e => setMapping(prev => ({ ...prev, [field.key]: e.target.value || '' }))}
                          className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${isMapped ? 'border-sky-300' : 'border-gray-200'}`}
                        >
                          <option value="">-- No mapear --</option>
                          {headers.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                        {isMapped ? (
                          <Check className="h-4 w-4 text-sky-500 shrink-0" />
                        ) : field.required ? (
                          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                        ) : null}
                      </div>
                      <div className="ml-1 space-y-1.5">
                        <p className="text-xs text-gray-500 leading-relaxed">{field.description}</p>
                        {field.validValues && (
                          <div className="flex flex-wrap gap-1">
                            {field.validValues.map(v => (
                              <span key={v} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{v}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span>Ejemplo:</span>
                          <code className="text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">{field.example}</code>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!requiredFieldsMapped && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  Los campos obligatorios (*) deben estar mapeados para continuar.
                </div>
              )}
              <div className="flex justify-end pt-2">
                <button
                  disabled={!requiredFieldsMapped}
                  onClick={() => setStep('preview')}
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Siguiente <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Vista previa de las primeras 5 filas:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">#</th>
                      {config.previewColumns.map(col => (
                        <th key={col} className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mappedRows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        {config.previewColumns.map(col => (
                          <td key={col} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">{row[col] ?? ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 text-center">Total: {rows.length} filas a importar</p>
              <div className="flex justify-between pt-2">
                <button onClick={() => setStep('mapping')} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Volver
                </button>
                <button onClick={runImport} className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors flex items-center gap-2">
                  Importar {rows.length} registros <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
              <p className="text-sm text-gray-600 font-medium">Importando datos...</p>
            </div>
          )}

          {step === 'results' && importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <ResultCard label="Creados" value={importResult.created} color="emerald" />
                <ResultCard label="Duplicados omitidos" value={importResult.duplicatesSkipped} color="amber" />
              </div>

              {importResult.participantsNotFound.length > 0 && (
                <NotFoundSection title="Participantes no encontrados" items={importResult.participantsNotFound} />
              )}
              {importResult.coursesNotFound.length > 0 && (
                <NotFoundSection title="Cursos no encontrados" items={importResult.coursesNotFound} />
              )}
              {importResult.sessionsNotFound.length > 0 && (
                <NotFoundSection title="Sesiones no encontradas" items={importResult.sessionsNotFound} />
              )}
              {importResult.errors.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-700 mb-1">Errores ({importResult.errors.length})</p>
                  <ul className="text-xs text-red-600 space-y-0.5 max-h-32 overflow-y-auto">
                    {importResult.errors.map((e, i) => <li key={i}>Fila {e.row}: {e.reason}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button onClick={() => { onComplete(); onClose(); }} className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors">
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultCard: React.FC<{ label: string; value: number; color: 'emerald' | 'amber' }> = ({ label, value, color }) => (
  <div className={`p-4 rounded-lg ${color === 'emerald' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
    <p className={`text-2xl font-bold ${color === 'emerald' ? 'text-emerald-700' : 'text-amber-700'}`}>{value}</p>
    <p className={`text-xs font-medium ${color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>{label}</p>
  </div>
);

const NotFoundSection: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="p-3 bg-amber-50 rounded-lg">
    <p className="text-sm font-medium text-amber-700 mb-1">{title} ({items.length})</p>
    <ul className="text-xs text-amber-600 space-y-0.5 max-h-24 overflow-y-auto">
      {items.map((item, i) => <li key={i} className="flex items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" />{item}</li>)}
    </ul>
  </div>
);

export default DataImportModal;
