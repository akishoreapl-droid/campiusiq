import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchInquiries, updateInquiryStatus, InquiryRecord, fetchImportBatchesFromDb } from '../../lib/supabase';
import { parseAndValidateFile, commitImportBatch, ParseResult, ImportCommitResult } from '../../lib/ingestion';
import { 
  Database, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Download, 
  RefreshCw, 
  Layers, 
  Check, 
  X,
  FileSpreadsheet,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Sparkles,
  ExternalLink,
  History
} from 'lucide-react';

export const DataManagement: React.FC = () => {
  const { students, refreshDataFromDb, addToast, openInquiryModal, isDbConnected } = useApp();

  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitResult, setCommitResult] = useState<ImportCommitResult | null>(null);

  // Supabase Backend Inquiries State
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'admission' | 'academic_support' | 'placement_help' | 'system_feedback' | 'general'>('all');

  // Ingestion Batches State
  const [importBatches, setImportBatches] = useState<any[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetchInquiries();
      if (res.success && res.data) {
        setInquiries(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const loadBatches = async () => {
    setLoadingBatches(true);
    try {
      const data = await fetchImportBatchesFromDb();
      setImportBatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    loadInquiries();
    loadBatches();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'in_review' | 'resolved') => {
    const res = await updateInquiryStatus(id, newStatus);
    if (res.success) {
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      addToast(`Inquiry status updated to ${newStatus.replace('_', ' ')}`, 'success');
    } else {
      addToast('Failed to update status', 'error');
    }
  };

  // Sample CSV format for downloading
  const sampleCsvContent = `roll_number,name,email,department,year,semester,cgpa,attendance_percentage,coding_score,backlogs
STU-2024-801,Aakash Verma,aakash.verma@campusiq.edu,Computer Science,3,5,8.1,84,72,0
STU-2024-802,Pooja Hegde,pooja.hegde@campusiq.edu,Information Technology,3,5,6.4,59,48,1
STU-2024-803,Nikhil Sen,nikhil.sen@campusiq.edu,Data Science,4,7,9.2,96,89,0
STU-2024-804,Dev Kulkarni,dev.kulkarni@campusiq.edu,Mechanical,2,3,5.5,52,38,2`;

  const handleDownloadSample = () => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + sampleCsvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "campusiq_sample_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const parsed = await parseAndValidateFile(file);
      setParseResult(parsed);
      setCommitResult(null);
      addToast(`Parsed ${file.name} — ${parsed.validRows.length} valid rows, ${parsed.invalidRows.length} errors`, 'info');
    } catch (err: any) {
      addToast(`Failed to parse file: ${err?.message || 'Invalid format'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadDemoDataset = async () => {
    setIsProcessing(true);
    try {
      const blob = new Blob([sampleCsvContent], { type: 'text/csv' });
      const file = new File([blob], 'demo_cohort_students.csv', { type: 'text/csv' });
      const parsed = await parseAndValidateFile(file);
      setParseResult(parsed);
      setCommitResult(null);
      addToast('Loaded sample dataset with validation checks', 'info');
    } catch (err: any) {
      addToast('Failed to load demo dataset', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommitImport = async () => {
    if (!parseResult) return;

    setIsCommitting(true);
    try {
      const res = await commitImportBatch(parseResult);
      setCommitResult(res);
      addToast(`Batch Committed: ${res.imported} saved to PostgreSQL, ${res.failed} rejected.`, 'success');
      await refreshDataFromDb();
      await loadBatches();
    } catch (err: any) {
      addToast(`Import commit failed: ${err?.message || 'Server error'}`, 'error');
    } finally {
      setIsCommitting(false);
    }
  };

  const handleDownloadErrorReport = () => {
    if (!commitResult?.errors.length && !parseResult?.invalidRows.length) return;

    const errorLines = [
      'Row Number,Error Reason',
      ...(parseResult?.invalidRows.map(r => `${r.rowNumber},"${r.errors.join('; ')}"`) || []),
      ...(commitResult?.errors.map(e => `${e.row},"${e.message}"`) || []),
    ];

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + errorLines.join('\n'));
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `import_error_report_${commitResult?.batchId || 'draft'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E6E1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-[#192A27] tracking-tight">
              Data Ingestion & Integrity Management
            </h1>
            <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-0.5 rounded-full border border-[#CCE8DA]">
              Production Schema
            </span>
          </div>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Monitor synchronized institutional pipelines: SIS, Biometric Attendance, LMS, and Live Supabase PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshDataFromDb}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#123D35] bg-white border border-[#E2E6E1] hover:bg-[#F7F6F1] rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#16856B]" />
            <span>Sync Supabase</span>
          </button>
          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#123D35] bg-white border border-[#E2E6E1] hover:bg-[#F7F6F1] rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#6D7975]" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Connected Data Sources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#E2E6E1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#192A27]">Academic Records (SIS)</span>
            <span className="text-[10px] font-semibold text-[#27845B] bg-[#EBF7F1] px-1.5 py-0.5 rounded">Synced</span>
          </div>
          <p className="text-xs text-[#6D7975]">CGPA, semester results, backlogs, internal exams.</p>
          <div className="mt-3 pt-2 border-t border-[#E2E6E1] text-[11px] text-[#6D7975] flex justify-between">
            <span>Scholars: <strong>{students.length}</strong></span>
            <span>Live DB</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E6E1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#192A27]">Biometric Attendance</span>
            <span className="text-[10px] font-semibold text-[#27845B] bg-[#EBF7F1] px-1.5 py-0.5 rounded">Active</span>
          </div>
          <p className="text-xs text-[#6D7975]">RFID classroom scanners & laboratory logs.</p>
          <div className="mt-3 pt-2 border-t border-[#E2E6E1] text-[11px] text-[#6D7975] flex justify-between">
            <span>Daily logs: <strong>1,420</strong></span>
            <span>Latency: 1h</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E6E1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#192A27]">Canvas / Moodle LMS</span>
            <span className="text-[10px] font-semibold text-[#27845B] bg-[#EBF7F1] px-1.5 py-0.5 rounded">Active</span>
          </div>
          <p className="text-xs text-[#6D7975]">Assignment submissions, module completion rates.</p>
          <div className="mt-3 pt-2 border-t border-[#E2E6E1] text-[11px] text-[#6D7975] flex justify-between">
            <span>Tasks: <strong>890</strong></span>
            <span>Latency: 4h</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E6E1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#192A27]">Placement Assessments</span>
            <span className="text-[10px] font-semibold text-[#27845B] bg-[#EBF7F1] px-1.5 py-0.5 rounded">Active</span>
          </div>
          <p className="text-xs text-[#6D7975]">Coding contest scores, mock interview scorecards.</p>
          <div className="mt-3 pt-2 border-t border-[#E2E6E1] text-[11px] text-[#6D7975] flex justify-between">
            <span>Assessments: <strong>320</strong></span>
            <span>Latency: 24h</span>
          </div>
        </div>

        {/* Supabase Connected Source */}
        <div className="p-4 bg-[#E8F5F1]/60 rounded-xl border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Supabase Backend
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-emerald-900/80">Project: <strong>campusiq</strong> (Ammu Org). PostgreSQL 17.</p>
          <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-800 flex justify-between">
            <span>Inquiries: <strong>{inquiries.length}</strong></span>
            <span className="font-mono text-[10px]">ap-south-1</span>
          </div>
        </div>
      </div>

      {/* ================= CSV & XLSX INGESTION CENTER ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#192A27]">Institutional Batch Data Ingestion Center (CSV / XLSX)</h2>
          <p className="text-xs text-[#6D7975] mt-0.5">
            Import new student cohorts or update academic & placement benchmarks. Parser validates schema bounds and commits to PostgreSQL tables.
          </p>
        </div>

        <div className="p-8 border-2 border-dashed border-[#E2E6E1] hover:border-[#16856B] rounded-xl text-center transition-colors bg-[#F7F6F1]/50">
          <Upload className="w-8 h-8 text-[#16856B] mx-auto mb-2" />
          <p className="text-xs font-bold text-[#192A27]">
            Drag and drop your institutional CSV or Excel (.xlsx) file here
          </p>
          <p className="text-[11px] text-[#6D7975] mt-1 mb-4">
            Supports roll_number, name, email, department, year, semester, cgpa, attendance_percentage, coding_score, backlogs
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="px-4 py-2 bg-[#123D35] hover:bg-[#0B2925] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors">
              <span>{isProcessing ? 'Processing File...' : 'Browse CSV / XLSX File'}</span>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                disabled={isProcessing}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleLoadDemoDataset}
              disabled={isProcessing}
              className="px-4 py-2 bg-white border border-[#E2E6E1] hover:bg-[#F7F6F1] text-[#192A27] text-xs font-semibold rounded-lg transition-colors"
            >
              Load Demo CSV Cohort
            </button>
          </div>
        </div>

        {/* Validation Assessment Banner */}
        {parseResult && !commitResult && (
          <div className="p-4 rounded-xl bg-[#E8F5F1] border border-[#CCE8DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#123D35]">
            <div>
              <span className="font-bold block">Validation Assessment for "{parseResult.fileName}":</span>
              <span>
                Total Rows: <strong>{parseResult.totalRows}</strong> • Valid to Ingest: <strong>{parseResult.validRows.length}</strong> • Rejected: <strong>{parseResult.invalidRows.length}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setParseResult(null)}
                className="px-3 py-1.5 text-xs text-[#6D7975] hover:text-[#192A27]"
              >
                Cancel
              </button>
              {parseResult.invalidRows.length > 0 && (
                <button
                  onClick={handleDownloadErrorReport}
                  className="px-3 py-1.5 text-xs text-[#C44B4B] bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                >
                  Download Error Report
                </button>
              )}
              <button
                onClick={handleCommitImport}
                disabled={isCommitting || parseResult.validRows.length === 0}
                className="px-4 py-1.5 bg-[#123D35] hover:bg-[#0B2925] text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                {isCommitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Committing to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Commit Ingestion ({parseResult.validRows.length} Records)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Commit Success Banner */}
        {commitResult && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
            <div>
              <span className="font-bold block flex items-center gap-1.5 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Batch Ingested Successfully (Batch ID: {commitResult.batchId})
              </span>
              <span className="text-emerald-800">
                Successfully written to PostgreSQL: <strong>{commitResult.imported}</strong> records. Errors: <strong>{commitResult.failed}</strong>.
              </span>
            </div>
            {commitResult.failed > 0 && (
              <button
                onClick={handleDownloadErrorReport}
                className="px-3 py-1.5 text-xs text-red-700 bg-red-100 hover:bg-red-200 rounded-lg font-semibold"
              >
                Download Error CSV
              </button>
            )}
          </div>
        )}

        {/* Preview Valid Rows Table */}
        {parseResult && parseResult.validRows.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs font-bold text-[#192A27] mb-2 uppercase tracking-wider">
              Preview Records Ready for PostgreSQL:
            </h3>
            <div className="overflow-x-auto border border-[#E2E6E1] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E6E1] bg-[#F7F6F1] text-[#6D7975] font-semibold text-[11px]">
                    <th className="py-2 px-3">Roll Number</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Department</th>
                    <th className="py-2 px-3">CGPA</th>
                    <th className="py-2 px-3">Attendance</th>
                    <th className="py-2 px-3">Coding</th>
                    <th className="py-2 px-3 text-right">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E6E1]/60">
                  {parseResult.validRows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F6F1]/50">
                      <td className="py-2 px-3 font-mono font-bold">{row.studentId}</td>
                      <td className="py-2 px-3">{row.name}</td>
                      <td className="py-2 px-3">{row.department}</td>
                      <td className="py-2 px-3">{row.cgpa}</td>
                      <td className="py-2 px-3">{row.attendancePercentage}%</td>
                      <td className="py-2 px-3">{row.codingScore}</td>
                      <td className="py-2 px-3 text-right">
                        <span className="text-[10px] font-semibold text-[#27845B] bg-[#EBF7F1] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parseResult.validRows.length > 10 && (
              <p className="text-[11px] text-[#6D7975] mt-1 text-center">
                Showing first 10 of {parseResult.validRows.length} validated records.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ================= INGESTION AUDIT BATCHES HISTORY ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E6E1]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#16856B]" />
            <h2 className="text-sm font-bold text-[#192A27]">
              PostgreSQL Batch Ingestion History (`public.import_batches`)
            </h2>
          </div>
          <button
            onClick={loadBatches}
            disabled={loadingBatches}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#123D35] hover:bg-[#F7F6F1] border border-[#E2E6E1] rounded-md"
          >
            <RefreshCw className={`w-3 h-3 ${loadingBatches ? 'animate-spin' : ''}`} />
            <span>Refresh Batches</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-[#E2E6E1] rounded-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E6E1] bg-[#F7F6F1] text-[#6D7975] font-semibold text-[11px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Filename</th>
                <th className="py-2.5 px-3">Dataset Type</th>
                <th className="py-2.5 px-3">Total Rows</th>
                <th className="py-2.5 px-3">Successful</th>
                <th className="py-2.5 px-3">Failed</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6E1]/60">
              {importBatches.map((b, idx) => (
                <tr key={b.id || idx} className="hover:bg-[#F7F6F1]/50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#6D7975]">
                    {b.created_at ? new Date(b.created_at).toLocaleString() : 'Recent'}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#192A27]">{b.filename}</td>
                  <td className="py-2.5 px-3 capitalize text-[#16856B]">{b.dataset_type}</td>
                  <td className="py-2.5 px-3 font-semibold">{b.total_rows}</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">{b.successful_rows}</td>
                  <td className="py-2.5 px-3 text-red-600 font-semibold">{b.failed_rows}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {importBatches.length === 0 && !loadingBatches && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-xs text-[#6D7975]">
                    No previous import batches recorded in PostgreSQL. Upload a CSV or Excel file above to create a batch!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= SUPABASE BACKEND LIVE INQUIRIES CONSOLE ================= */}
      <div className="bg-white rounded-xl border border-[#E2E6E1] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E6E1]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#123D35] text-white flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#192A27]">
                Supabase Backend — Live Inquiries & Form Submissions
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F6F1] text-[#123D35] border border-[#E2E6E1]">
                public.inquiries ({inquiries.length} records)
              </span>
            </div>
            <p className="text-xs text-[#6D7975] mt-1">
              All website visitors, applicants, and student inquiry forms are securely synchronized to your Supabase PostgreSQL cluster in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={loadInquiries}
              disabled={loadingInquiries}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#123D35] bg-[#F7F6F1] hover:bg-[#E8F5F1] border border-[#E2E6E1] rounded-lg transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
              <span>Refresh Supabase</span>
            </button>
            <button
              onClick={() => openInquiryModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#123D35] hover:bg-[#0B2925] rounded-lg transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Submit Test Inquiry</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'admission', label: 'Admissions' },
            { id: 'academic_support', label: 'Academic Support' },
            { id: 'placement_help', label: 'Placement Copilot' },
            { id: 'system_feedback', label: 'Feedback' },
            { id: 'general', label: 'General' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setInquiryFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                inquiryFilter === f.id
                  ? 'bg-[#123D35] text-white font-semibold'
                  : 'bg-[#F7F6F1] text-[#6D7975] hover:text-[#192A27] hover:bg-[#E2E6E1]/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Inquiries Table */}
        <div className="overflow-x-auto border border-[#E2E6E1] rounded-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E6E1] bg-[#F7F6F1] text-[#6D7975] font-semibold text-[11px]">
                <th className="py-2.5 px-3">Date / ID</th>
                <th className="py-2.5 px-3">Submitted By</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Subject & Inquiry Details</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6E1]/60">
              {inquiries
                .filter(i => inquiryFilter === 'all' || i.inquiry_type === inquiryFilter)
                .map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-[#F7F6F1]/50 transition-colors">
                    <td className="py-3 px-3 align-top font-mono text-[11px] text-[#6D7975]">
                      <div className="flex items-center gap-1 text-[#192A27] font-semibold">
                        <Clock className="w-3 h-3 text-[#16856B]" />
                        <span>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#A9B5AC] truncate max-w-[100px]">
                        {item.id?.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <div className="font-semibold text-[#192A27]">{item.name}</div>
                      <div className="flex items-center gap-1 text-[#6D7975] text-[11px]">
                        <Mail className="w-2.5 h-2.5 text-[#16856B]" />
                        <span>{item.email}</span>
                      </div>
                      {item.phone && (
                        <div className="flex items-center gap-1 text-[#6D7975] text-[10px]">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{item.phone}</span>
                        </div>
                      )}
                      <span className="inline-block mt-1 text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#F7F6F1] text-[#123D35] border border-[#E2E6E1]">
                        {item.role || 'Visitor'}
                      </span>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <span className="font-semibold capitalize text-[#16856B]">
                        {item.inquiry_type?.replace('_', ' ') || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-3 align-top max-w-sm">
                      <div className="font-semibold text-[#192A27]">{item.subject}</div>
                      <p className="text-[#6D7975] text-[11px] mt-0.5 line-clamp-2">{item.message}</p>
                    </td>
                    <td className="py-3 px-3 align-top">
                      {item.status === 'resolved' ? (
                        <span className="text-[10px] font-semibold text-[#27845B] bg-[#EBF7F1] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Resolved
                        </span>
                      ) : item.status === 'in_review' ? (
                        <span className="text-[10px] font-semibold text-[#C58A2A] bg-[#FBF4E8] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> In Review
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> New
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 align-top text-right space-x-1 whitespace-nowrap">
                      {item.id && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(item.id!, 'in_review')}
                            title="Mark as In Review"
                            className="px-2 py-1 text-[10px] font-medium border border-[#E2E6E1] hover:bg-[#F7F6F1] rounded text-[#6D7975]"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id!, 'resolved')}
                            title="Mark as Resolved"
                            className="px-2 py-1 text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded text-emerald-800"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              {inquiries.length === 0 && !loadingInquiries && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-[#6D7975]">
                    No inquiries recorded in Supabase yet. Click "Submit Test Inquiry" to add one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
