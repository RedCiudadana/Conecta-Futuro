import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, ChevronDown, ArrowRight, Users } from 'lucide-react';
import { parseCSV, autoMapColumns, normalizeGender, normalizeSkillLevel } from '../../../utils/csvParser';
import type { ColumnMapping } from '../../../utils/csvParser';
import { bulkImportParticipants, type BulkImportResult } from '../../../services/participantService';
import { GUATEMALA_DEPARTMENTS } from '../../../types/participants';

type Step = 'upload' | 'mapping' | 'preview' | 'importing' | 'results';

const UNMAPPED = -1;

const CSVImportModal: React.FC<{ onClose: () => void; onComplete: () => void }> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<keyof ColumnMapping, number>>({} as any);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

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
      const auto = autoMapColumns(parsed.headers);
      const fullMapping: Record<keyof ColumnMapping, number> = {
        first_name: auto.first_name ?? UNMAPPED,
        last_name: auto.last_name ?? UNMAPPED,
        email: auto.email ?? UNMAPPED,
        phone: auto.phone ?? UNMAPPED,
        dpi: auto.dpi ?? UNMAPPED,
        department: auto.department ?? UNMAPPED,
        municipality: auto.municipality ?? UNMAPPED,
        gender: auto.gender ?? UNMAPPED,
        organization: auto.organization ?? UNMAPPED,
        digital_skill_level: auto.digital_skill_level ?? UNMAPPED,
        how_found_us: auto.how_found_us ?? UNMAPPED,
      };
      setMapping(fullMapping);
      setStep('mapping');
    } catch {
      setError('No se pudo leer el archivo. Asegúrate de que sea un CSV válido.');
    }
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      processFile(file);
    } else {
      setError('Por favor selecciona un archivo CSV.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const canProceedToPreview = mapping.first_name !== UNMAPPED && mapping.email !== UNMAPPED;

  const getPreviewRows = () => {
    return rows.slice(0, 5).map(row => ({
      first_name: mapping.first_name !== UNMAPPED ? row[mapping.first_name] || '' : '',
      last_name: mapping.last_name !== UNMAPPED ? row[mapping.last_name] || '' : '',
      email: mapping.email !== UNMAPPED ? row[mapping.email] || '' : '',
      phone: mapping.phone !== UNMAPPED ? row[mapping.phone] || '' : '',
      dpi: mapping.dpi !== UNMAPPED ? row[mapping.dpi] || '' : '',
      department: mapping.department !== UNMAPPED ? row[mapping.department] || '' : '',
    }));
  };

  const handleImport = async () => {
    setStep('importing');
    setProgress(0);

    const mappedRows = rows.map(row => {
      let firstName = mapping.first_name !== UNMAPPED ? row[mapping.first_name]?.trim() || '' : '';
      let lastName = mapping.last_name !== UNMAPPED ? row[mapping.last_name]?.trim() || '' : '';

      if (firstName && !lastName) {
        const parts = firstName.split(/\s+/);
        if (parts.length >= 2) {
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        } else {
          lastName = '';
        }
      }

      const rawGender = mapping.gender !== UNMAPPED ? row[mapping.gender] || '' : '';
      const rawSkill = mapping.digital_skill_level !== UNMAPPED ? row[mapping.digital_skill_level] || '' : '';
      const rawDept = mapping.department !== UNMAPPED ? row[mapping.department]?.trim() || '' : '';

      const matchedDept = GUATEMALA_DEPARTMENTS.find(d =>
        d.toLowerCase() === rawDept.toLowerCase()
      ) || rawDept || null;

      return {
        first_name: firstName,
        last_name: lastName,
        primary_email: mapping.email !== UNMAPPED ? row[mapping.email]?.trim() || '' : '',
        phone: mapping.phone !== UNMAPPED ? row[mapping.phone]?.trim() || null : null,
        dpi: mapping.dpi !== UNMAPPED ? row[mapping.dpi]?.trim() || null : null,
        department: matchedDept,
        municipality: mapping.municipality !== UNMAPPED ? row[mapping.municipality]?.trim() || null : null,
        gender: normalizeGender(rawGender),
        organization_name: mapping.organization !== UNMAPPED ? row[mapping.organization]?.trim() || null : null,
        digital_skill_level: normalizeSkillLevel(rawSkill),
        how_found_us: mapping.how_found_us !== UNMAPPED ? row[mapping.how_found_us]?.trim() || null : null,
      };
    });

    setProgress(30);

    try {
      const result = await bulkImportParticipants(mappedRows);
      setProgress(100);
      setImportResult(result);
      setStep('results');
    } catch (err: any) {
      setError(`Error durante la importación: ${err.message}`);
      setStep('preview');
    }
  };

  const fieldLabels: Record<keyof ColumnMapping, string> = {
    first_name: 'Nombre *',
    last_name: 'Apellido',
    email: 'Email *',
    phone: 'Teléfono',
    dpi: 'DPI',
    department: 'Departamento',
    municipality: 'Municipio',
    gender: 'Género',
    organization: 'Organización',
    digital_skill_level: 'Nivel digital',
    how_found_us: 'Cómo nos encontró',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
              <Upload className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Importar Participantes</h2>
              <p className="text-sm text-gray-500">Desde archivo CSV (Google Forms, Excel)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            {(['upload', 'mapping', 'preview', 'results'] as const).map((s, i) => {
              const labels = ['Subir archivo', 'Mapear columnas', 'Vista previa', 'Resultados'];
              const stepOrder = ['upload', 'mapping', 'preview', 'importing', 'results'];
              const currentIdx = stepOrder.indexOf(step);
              const thisIdx = stepOrder.indexOf(s);
              const isActive = currentIdx >= thisIdx;
              return (
                <React.Fragment key={s}>
                  {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300 flex-shrink-0" />}
                  <span className={`font-medium ${isActive ? 'text-sky-600' : 'text-gray-400'}`}>{labels[i]}</span>
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

          {/* STEP: Upload */}
          {step === 'upload' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                dragOver ? 'border-sky-400 bg-sky-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-1">Arrastra tu archivo CSV aquí</p>
              <p className="text-gray-400 text-sm mb-4">o haz clic para seleccionar</p>
              <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileSelect} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium"
              >
                Seleccionar archivo
              </button>
              <p className="text-xs text-gray-400 mt-6">
                Compatible con exportaciones de Google Forms, Google Sheets y Excel.
                <br />Formatos soportados: CSV con separador coma, punto y coma, o tabulación.
              </p>
            </div>
          )}

          {/* STEP: Column Mapping */}
          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl">
                <FileText className="h-5 w-5 text-sky-500 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-sky-700">{fileName}</span>
                  <span className="text-sky-600 ml-2">{rows.length} filas detectadas</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Asigna cada columna de tu archivo al campo correspondiente. Los campos marcados con * son obligatorios.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.entries(fieldLabels) as [keyof ColumnMapping, string][]).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                    <div className="relative">
                      <select
                        value={mapping[field] ?? UNMAPPED}
                        onChange={e => setMapping(prev => ({ ...prev, [field]: parseInt(e.target.value) }))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          mapping[field] !== UNMAPPED ? 'border-sky-300 bg-sky-50/50' : 'border-gray-200'
                        }`}
                      >
                        <option value={UNMAPPED}>— No asignar —</option>
                        {headers.map((h, i) => (
                          <option key={i} value={i}>{h}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              {mapping.first_name !== UNMAPPED && mapping.last_name === UNMAPPED && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3">
                  Si la columna de nombre contiene nombre y apellido juntos, se separarán automáticamente por el primer espacio.
                </p>
              )}
            </div>
          )}

          {/* STEP: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <Users className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-700">
                  Se importarán <span className="font-bold">{rows.length}</span> participantes. Los duplicados (mismo email o DPI) se omitirán automáticamente.
                </p>
              </div>

              <p className="text-sm font-medium text-gray-700">Vista previa (primeras 5 filas):</p>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Nombre</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Apellido</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Teléfono</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">DPI</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Departamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getPreviewRows().map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-gray-900">{row.first_name || <span className="text-red-400">—</span>}</td>
                        <td className="px-4 py-2 text-gray-600">{row.last_name || '—'}</td>
                        <td className="px-4 py-2 text-gray-600">{row.email || <span className="text-red-400">—</span>}</td>
                        <td className="px-4 py-2 text-gray-500">{row.phone || '—'}</td>
                        <td className="px-4 py-2 text-gray-500">{row.dpi || '—'}</td>
                        <td className="px-4 py-2 text-gray-500">{row.department || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 5 && (
                <p className="text-xs text-gray-400 text-center">...y {rows.length - 5} filas más</p>
              )}
            </div>
          )}

          {/* STEP: Importing */}
          {step === 'importing' && (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600 mx-auto mb-6"></div>
              <p className="text-gray-700 font-medium mb-2">Importando participantes...</p>
              <p className="text-gray-400 text-sm">Esto puede tomar un momento</p>
              <div className="mt-6 max-w-xs mx-auto bg-gray-100 rounded-full h-2">
                <div
                  className="bg-sky-600 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP: Results */}
          {step === 'results' && importResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                <CheckCircle className="h-8 w-8 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 text-lg">Importación completada</p>
                  <p className="text-emerald-600 text-sm">Se procesaron {rows.length} filas del archivo</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
                  <p className="text-2xl font-bold text-emerald-600">{importResult.created}</p>
                  <p className="text-xs text-gray-500 mt-1">Creados</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
                  <p className="text-2xl font-bold text-amber-600">{importResult.skippedDuplicates}</p>
                  <p className="text-xs text-gray-500 mt-1">Duplicados omitidos</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
                  <p className="text-2xl font-bold text-red-600">{importResult.errors.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Errores</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="border border-red-100 rounded-xl overflow-hidden">
                  <div className="bg-red-50 px-4 py-2">
                    <p className="text-sm font-medium text-red-700">Detalle de errores</p>
                  </div>
                  <div className="max-h-40 overflow-y-auto divide-y divide-red-50">
                    {importResult.errors.slice(0, 20).map((err, i) => (
                      <div key={i} className="px-4 py-2 text-xs text-red-600 flex justify-between">
                        <span>Fila {err.row}: {err.email || 'sin email'}</span>
                        <span className="text-red-400">{err.reason}</span>
                      </div>
                    ))}
                    {importResult.errors.length > 20 && (
                      <div className="px-4 py-2 text-xs text-red-400 text-center">
                        ...y {importResult.errors.length - 20} errores más
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
              else if (step === 'preview') setStep('mapping');
              else onClose();
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {step === 'results' ? 'Cerrar' : 'Atrás'}
          </button>

          {step === 'mapping' && (
            <button
              onClick={() => setStep('preview')}
              disabled={!canProceedToPreview}
              className="px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Vista previa
            </button>
          )}

          {step === 'preview' && (
            <button
              onClick={handleImport}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
            >
              Importar {rows.length} participantes
            </button>
          )}

          {step === 'results' && (
            <button
              onClick={() => { onComplete(); onClose(); }}
              className="px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium transition-colors"
            >
              Listo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;
