import React, { useEffect, useState, useCallback } from 'react';
import { Award, Loader2, CheckCircle, AlertCircle, ExternalLink, FolderOpen, Save, Search } from 'lucide-react';
import { supabase } from '../../config/supabase';
import {
  getCourses,
  getCourseEligibleParticipants,
  bulkIssueCertificates,
} from '../../services/participantService';
import type { Course, Participant } from '../../types/participants';
import { PROGRAM_LABELS } from '../../types/participants';

type Eligible = Participant & { attendance_pct: number };
type Ineligible = Participant & { attendance_pct: number; reason: string };

const CertificateEligibilityPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [eligible, setEligible] = useState<Eligible[]>([]);
  const [ineligible, setIneligible] = useState<Ineligible[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [issuing, setIssuing] = useState(false);
  const [issueResult, setIssueResult] = useState<{ issued: number; errors: string[] } | null>(null);
  const [minAttendance, setMinAttendance] = useState(80);
  const [driveUrl, setDriveUrl] = useState('');
  const [savingDrive, setSavingDrive] = useState(false);
  const [driveSaved, setDriveSaved] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCourses().then(c => { setCourses(c); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const evaluate = useCallback(async (course: Course, threshold = 80) => {
    setEvaluating(true);
    setIssueResult(null);
    setSelectedIds(new Set());
    try {
      const result = await getCourseEligibleParticipants(course.id, threshold);
      setEligible(result.eligible);
      setIneligible(result.ineligible);
    } catch {
      setEligible([]);
      setIneligible([]);
    }
    setEvaluating(false);
  }, []);

  const selectCourse = (course: Course) => {
    setSelectedCourse(course);
    setDriveUrl(course.drive_folder_url ?? '');
    setDriveSaved(false);
    evaluate(course, minAttendance);
  };

  const handleThresholdChange = (val: number) => {
    setMinAttendance(val);
    if (selectedCourse) evaluate(selectedCourse, val);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === eligible.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(eligible.map(e => e.id)));
    }
  };

  const handleIssue = async () => {
    if (!selectedCourse || selectedIds.size === 0) return;
    setIssuing(true);
    setIssueResult(null);
    try {
      const result = await bulkIssueCertificates(selectedCourse.id, Array.from(selectedIds));
      setIssueResult(result);
      if (selectedCourse) evaluate(selectedCourse, minAttendance);
    } catch (e: any) {
      setIssueResult({ issued: 0, errors: [e.message] });
    }
    setIssuing(false);
  };

  const saveDriveUrl = async () => {
    if (!selectedCourse) return;
    setSavingDrive(true);
    try {
      await supabase.from('courses').update({ drive_folder_url: driveUrl || null }).eq('id', selectedCourse.id);
      setSelectedCourse({ ...selectedCourse, drive_folder_url: driveUrl || null });
      setDriveSaved(true);
      setTimeout(() => setDriveSaved(false), 2500);
    } catch { }
    setSavingDrive(false);
  };

  const filteredEligible = eligible.filter(e => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) || e.primary_email.toLowerCase().includes(q);
  });

  const filteredIneligible = ineligible.filter(e => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) || e.primary_email.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Award className="h-7 w-7 text-amber-500" />
          Certificados
        </h1>
        <p className="text-gray-500 mt-1">Revisa la elegibilidad por curso y emite certificados en lote</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Cursos</h2>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No hay cursos registrados</div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[700px] overflow-y-auto">
              {courses.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectCourse(c)}
                  className={`w-full text-left p-4 hover:bg-sky-50 transition-colors ${selectedCourse?.id === c.id ? 'bg-sky-50 border-l-4 border-sky-500' : ''}`}
                >
                  <p className="text-sm font-medium text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {c.program ? PROGRAM_LABELS[c.program] : 'Sin programa'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Eligibility Panel */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedCourse ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Selecciona un curso para ver la elegibilidad de certificados</p>
            </div>
          ) : (
            <>
              {/* Course Header + Drive Link */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedCourse.title}</h2>
                  <p className="text-sm text-gray-500">
                    {eligible.length} elegibles | {ineligible.length} no elegibles
                  </p>
                </div>

                {/* Drive Folder Link */}
                <div className="border-t border-gray-100 pt-4">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <FolderOpen className="h-3.5 w-3.5" /> Carpeta de Google Drive con diplomas anteriores
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={driveUrl}
                      onChange={e => { setDriveUrl(e.target.value); setDriveSaved(false); }}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                    <button
                      onClick={saveDriveUrl}
                      disabled={savingDrive}
                      className="px-3 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      {driveSaved ? <><CheckCircle className="h-4 w-4" /> Guardado</> : savingDrive ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Guardar</>}
                    </button>
                  </div>
                  {driveUrl && (
                    <a href={driveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 mt-2 font-medium">
                      <ExternalLink className="h-3 w-3" /> Abrir carpeta de diplomas
                    </a>
                  )}
                </div>

                {/* Attendance Threshold */}
                <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Asistencia mínima:</label>
                  <select
                    value={minAttendance}
                    onChange={e => handleThresholdChange(Number(e.target.value))}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value={60}>60%</option>
                    <option value={70}>70%</option>
                    <option value={80}>80%</option>
                    <option value={90}>90%</option>
                    <option value={100}>100%</option>
                  </select>
                </div>
              </div>

              {/* Issue Result */}
              {issueResult && (
                <div className={`p-4 rounded-xl border ${issueResult.issued > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                  <p className="text-sm font-medium text-gray-800">
                    {issueResult.issued > 0
                      ? `Se emitieron ${issueResult.issued} certificados correctamente.`
                      : 'No se emitieron certificados.'}
                  </p>
                  {issueResult.errors.length > 0 && (
                    <ul className="text-xs text-red-600 mt-2 space-y-0.5">
                      {issueResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  )}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar participante..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {evaluating ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <Loader2 className="h-6 w-6 text-sky-500 animate-spin mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Evaluando elegibilidad...</p>
                </div>
              ) : (
                <>
                  {/* Eligible List */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <h3 className="font-semibold text-gray-900">Elegibles ({filteredEligible.length})</h3>
                      </div>
                      {filteredEligible.length > 0 && (
                        <div className="flex items-center gap-3">
                          <button onClick={toggleAll} className="text-xs text-sky-600 font-medium hover:text-sky-700">
                            {selectedIds.size === eligible.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                          </button>
                          <button
                            onClick={handleIssue}
                            disabled={selectedIds.size === 0 || issuing}
                            className="inline-flex items-center px-3 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {issuing ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Award className="h-4 w-4 mr-1.5" />}
                            Emitir {selectedIds.size > 0 && `(${selectedIds.size})`}
                          </button>
                        </div>
                      )}
                    </div>
                    {filteredEligible.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">No hay participantes elegibles</div>
                    ) : (
                      <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                        {filteredEligible.map(p => (
                          <label key={p.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(p.id)}
                              onChange={() => toggleSelect(p.id)}
                              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                            />
                            <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold text-xs shrink-0">
                              {p.first_name[0]}{p.last_name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</p>
                              <p className="text-xs text-gray-500 truncate">{p.primary_email}</p>
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
                              {p.attendance_pct}% asistencia
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ineligible List */}
                  {filteredIneligible.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-700">No elegibles ({filteredIneligible.length})</h3>
                      </div>
                      <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                        {filteredIneligible.map(p => (
                          <div key={p.id} className="flex items-center gap-3 p-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs shrink-0">
                              {p.first_name[0]}{p.last_name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700">{p.first_name} {p.last_name}</p>
                              <p className="text-xs text-gray-400 truncate">{p.primary_email}</p>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full shrink-0">
                              {p.reason}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateEligibilityPage;
