import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { ShieldCheck, CheckCircle2, Clock, XCircle, ArrowRight, FileText } from 'lucide-react';

interface StudentVerificationStatusProps {
  onViewCert: (certId: string) => void;
}

export const StudentVerificationStatus: React.FC<StudentVerificationStatusProps> = ({ onViewCert }) => {
  const { user } = useAuth();
  const { certificates = [] } = useCertificates();

  const userEmail = (user?.email || '').toLowerCase();
  const userId = user?.id;

  const myCerts = certificates.filter(
    (c) =>
      (c.studentEmail && userEmail && c.studentEmail.toLowerCase() === userEmail) ||
      (userId && c.studentId === userId)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#1e3a8a] dark:text-blue-400" />
          Verification Audit Track
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track the live institutional review status, approval steps, and verification logs for your submitted credentials.
        </p>
      </div>

      <div className="space-y-4">
        {myCerts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No certificate applications or requests logged yet.
          </div>
        ) : (
          myCerts.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{cert.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Issuer: {cert.issuer} • Submitted: {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      cert.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : cert.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                    }`}
                  >
                    {cert.status === 'verified' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {cert.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                    {cert.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                    {cert.status.toUpperCase()}
                  </span>

                  <button
                    onClick={() => onViewCert(cert.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-3 gap-2 text-center relative">
                {/* Step 1: Upload */}
                <div className="space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Uploaded & Extracted</div>
                  <div className="text-[10px] text-slate-400 font-mono">OCR Verified</div>
                </div>

                {/* Step 2: Staff Review */}
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      cert.status === 'verified'
                        ? 'bg-emerald-500 text-white'
                        : cert.status === 'rejected'
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-white animate-pulse'
                    }`}
                  >
                    {cert.status === 'verified' ? '✓' : cert.status === 'rejected' ? '✕' : '2'}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Faculty Verification</div>
                  <div className="text-[10px] text-slate-400">
                    {cert.verifiedBy ? `Reviewed by ${cert.verifiedBy}` : 'Pending Review'}
                  </div>
                </div>

                {/* Step 3: Ledger Vault */}
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      cert.status === 'verified' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {cert.status === 'verified' ? '✓' : '3'}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Institutional Hash Issued</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {cert.status === 'verified' ? 'Active on Vault' : 'Awaiting Approval'}
                  </div>
                </div>
              </div>

              {cert.status === 'rejected' && cert.rejectionReason && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                  <strong>Rejection Reason:</strong> {cert.rejectionReason}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
