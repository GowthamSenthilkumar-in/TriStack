import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { useNotifications } from '../../context/NotificationContext';
import { CertificateItem } from '../../types';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  CheckCheck,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  User
} from 'lucide-react';

interface StaffPendingRequestsQueueProps {
  onViewCert: (certId: string) => void;
}

export const StaffPendingRequestsQueue: React.FC<StaffPendingRequestsQueueProps> = ({ onViewCert }) => {
  const { user } = useAuth();
  const { certificates = [], approveCertificate, rejectCertificate } = useCertificates();
  const { addToast } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rejectingCertId, setRejectingCertId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Insufficient document clarity or unverified issuer.');

  const pendingList = certificates.filter((c) => {
    if (c.status !== 'pending') return false;
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    const title = (c.title || '').toLowerCase();
    const studentName = (c.studentName || '').toLowerCase();
    const regNo = (c.studentRegNo || c.registerNumber || '').toLowerCase();
    const issuer = (c.issuer || c.organizationOrDept || '').toLowerCase();

    return (
      title.includes(query) ||
      studentName.includes(query) ||
      regNo.includes(query) ||
      issuer.includes(query)
    );
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingList.map((c) => c.id));
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => {
      approveCertificate(id, user?.name || 'Faculty Approver');
    });
    addToast(
      'Bulk Approval Completed',
      `Approved ${selectedIds.length} certificate(s) and logged on institutional ledger.`,
      'success'
    );
    setSelectedIds([]);
  };

  const handleApproveSingle = (cert: CertificateItem) => {
    approveCertificate(cert.id, user?.name || 'Faculty Approver');
    addToast(
      'Certificate Approved & Verified',
      `Assigned ledger ID and QR code to ${cert.studentName}'s credential.`,
      'success'
    );
  };

  const handleConfirmReject = () => {
    if (!rejectingCertId) return;
    rejectCertificate(rejectingCertId, rejectionReason, user?.name || 'Faculty Reviewer');
    addToast('Certificate Rejected', 'Student notified with rejection details.', 'info');
    setRejectingCertId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#1e3a8a] dark:text-blue-400" />
            Pending Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review student submissions, inspect OCR extraction, and issue verified institutional ledger codes.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkApprove}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition flex items-center gap-2 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" /> Bulk Approve ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search pending queue by student name, register number, title, or issuer..."
          className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Table / Cards List */}
      {pendingList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Pending Queue Clear</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            All submitted student certificates have been processed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.length === pendingList.length && pendingList.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-slate-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
              />
              <span>Select All ({pendingList.length})</span>
            </label>
            <span>Action Required</span>
          </div>

          <div className="space-y-3">
            {pendingList.map((cert) => (
              <div
                key={cert.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-sm space-y-4 ${
                  selectedIds.includes(cert.id)
                    ? 'border-[#1e3a8a] bg-blue-50/20 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cert.id)}
                      onChange={() => toggleSelect(cert.id)}
                      className="mt-1 rounded border-slate-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-blue-300">
                          {cert.category}
                        </span>
                        {cert.ocrConfidence && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> OCR {cert.ocrConfidence}% Match
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{cert.title}</h3>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-sans">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="text-slate-700 dark:text-slate-200">{cert.studentName}</strong> (
                          <span className="font-mono">{cert.studentRegNo || '7376241CS108'}</span>)
                        </span>
                        <span>•</span>
                        <span>Issuer: <strong>{cert.issuer}</strong></span>
                        <span>•</span>
                        <span>Submitted: {new Date(cert.issueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => onViewCert(cert.id)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>

                    <button
                      onClick={() => setRejectingCertId(cert.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 transition flex items-center gap-1 border border-rose-200 dark:border-rose-900/50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>

                    <button
                      onClick={() => handleApproveSingle(cert)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingCertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Reject Student Application</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  State the reason so the student can rectify and re-submit.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Rejection Reason / Feedback *
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingCertId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
