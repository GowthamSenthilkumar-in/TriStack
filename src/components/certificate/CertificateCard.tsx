import React from 'react';
import { CertificateItem } from '../../types';
import {
  ShieldCheck,
  Clock,
  XCircle,
  Eye,
  Pin,
  Trash2,
  Building,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface CertificateCardProps {
  certificate: CertificateItem;
  onViewDetails: (cert: CertificateItem) => void;
  onTogglePin?: (cert: CertificateItem) => void;
  onDelete?: (cert: CertificateItem) => void;
  onApprove?: (cert: CertificateItem) => void;
  onReject?: (cert: CertificateItem, reason: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onViewDetails,
  onTogglePin,
  onDelete,
  onApprove,
  onReject
}) => {
  const statusConfig = {
    verified: {
      label: 'VERIFIED',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: <ShieldCheck className="w-3.5 h-3.5" />
    },
    pending: {
      label: 'PENDING REVIEW',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    needs_review: {
      label: 'NEEDS REVIEW',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    rejected: {
      label: 'REJECTED',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      icon: <XCircle className="w-3.5 h-3.5" />
    }
  };

  const status = statusConfig[certificate.status] || statusConfig.pending;
  const categoryLabel = certificate.category || certificate.certificateType || 'Academic Credential';
  const displayId = certificate.certificateNo || certificate.certificateId;
  const regNo = certificate.studentRegNo || certificate.registerNumber;
  const dept = certificate.studentDept || certificate.department;
  const issuer = certificate.issuer || certificate.organizationOrDept || 'BIT';

  return (
    <div className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#1e3a8a] dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4">
      {/* Top row: Category Badge & Status */}
      <div className="flex items-center justify-between gap-2">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          {categoryLabel}
        </span>

        <div className="flex items-center gap-1.5">
          {onTogglePin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(certificate);
              }}
              className={`p-1.5 rounded-lg transition ${
                certificate.isPinned
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={certificate.isPinned ? 'Unpin from Vault' : 'Pin to top of Vault'}
            >
              <Pin className={`w-3.5 h-3.5 ${certificate.isPinned ? 'fill-amber-500' : ''}`} />
            </button>
          )}

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${status.bg} ${status.text} ${status.border}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>
      </div>

      {/* Middle: Title & Student details */}
      <div className="space-y-2 flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
          {certificate.title}
        </h3>

        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{certificate.studentName}</span>
            {regNo && <span className="font-mono text-[11px] text-slate-400">({regNo})</span>}
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{dept || issuer}</span>
          </div>
        </div>

        {certificate.ocrMatchScore && (
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3 h-3" /> OCR Verified ({certificate.ocrMatchScore}%)
          </div>
        )}
      </div>

      {/* Bottom: ID, Issue Date & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <span className="block text-[10px] font-mono text-slate-400 truncate max-w-[140px] font-semibold">
            {displayId}
          </span>
          <span className="text-[10px] text-slate-400">{certificate.issueDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onApprove && certificate.status === 'pending' && (
            <button
              onClick={() => onApprove(certificate)}
              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 hover:bg-emerald-200 transition"
              title="Approve & Verify"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          {onReject && certificate.status === 'pending' && (
            <button
              onClick={() => onReject(certificate, 'Rejection requested by staff verifier')}
              className="p-1.5 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 hover:bg-rose-200 transition"
              title="Reject Submission"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onViewDetails(certificate)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1e3a8a] hover:bg-blue-900 transition flex items-center gap-1 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(certificate)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="Delete Certificate"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
