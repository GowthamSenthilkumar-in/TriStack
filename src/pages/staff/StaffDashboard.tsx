import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BarChart3,
  Award,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface StaffDashboardProps {
  onNavigate: (path: string) => void;
  onViewCert: (certId: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onNavigate, onViewCert }) => {
  const { user } = useAuth();
  const { certificates = [], approveCertificate, rejectCertificate } = useCertificates();

  const pendingList = certificates.filter((c) => c.status === 'pending');
  const verifiedList = certificates.filter((c) => c.status === 'verified');
  const rejectedList = certificates.filter((c) => c.status === 'rejected');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-[#1e3a8a] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Staff Verification & Issuance Workstation
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Faculty Review Console — {user?.name || 'Staff Member'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            Department: <span className="font-bold text-white">{user?.department || 'Computer Science and Engineering'}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/staff/pending-requests')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-emerald-950 bg-white hover:bg-emerald-50 transition shadow-md inline-flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" /> Review Pending Requests ({pendingList.length})
            </button>
            <button
              onClick={() => onNavigate('/staff/generate')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-800/60 hover:bg-emerald-800 transition border border-emerald-400/30 inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Issue Custom Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{pendingList.length}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Review</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{verifiedList.length}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Credentials</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{rejectedList.length}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rejected Claims</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{certificates.length}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Ledger Items</p>
          </div>
        </div>
      </div>

      {/* Pending Items Urgent Banner */}
      {pendingList.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                {pendingList.length} Student Certificate Submissions Awaiting Verification
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-400">
                Review OCR extracted document details and verify student credentials.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/staff/pending-requests')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-400 transition shrink-0"
          >
            Open Review Queue
          </button>
        </div>
      )}

      {/* Recent Submissions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">Recent Student Submissions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest student uploaded documents</p>
          </div>
          <button
            onClick={() => onNavigate('/staff/issued-certificates')}
            className="text-xs font-bold text-[#1e3a8a] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            View Full Ledger <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.slice(0, 3).map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onViewDetails={(c) => onViewCert(c.id)}
              onApprove={(c) => approveCertificate(c.id, user?.name || 'Faculty Staff')}
              onReject={(c, reason) => rejectCertificate(c.id, reason, user?.name || 'Faculty Staff')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
