import React, { useState } from 'react';
import { CertificateItem } from '../../types';
import { CertificateTemplate } from './CertificateTemplate';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Copy,
  Check,
  Share2,
  Trash2,
  Download,
  ShieldCheck,
  Calendar,
  Building2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CertificateDetailModalProps {
  certificate: CertificateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (certId: string) => void;
}

export const CertificateDetailModal: React.FC<CertificateDetailModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onDelete
}) => {
  const { addToast } = useNotifications();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!isOpen || !certificate) return null;

  const publicVerifyUrl = `${window.location.origin}/verify/${encodeURIComponent(certificate.certificateId)}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate.certificateId);
    setCopied(true);
    addToast('Copied to Clipboard', `Certificate ID "${certificate.certificateId}" copied.`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(publicVerifyUrl);
    addToast('Link Copied', 'Public verification link copied to clipboard.', 'success');
  };

  const handleShareWhatsapp = () => {
    const text = `Check out my verified digital certificate from Bannari Amman Institute of Technology: ${certificate.title} (ID: ${certificate.certificateId})\nVerify online: ${publicVerifyUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareGmail = () => {
    const subject = `Verified Digital Certificate - ${certificate.title}`;
    const body = `Hello,\n\nHere is my verified digital certificate issued by Bannari Amman Institute of Technology.\n\nCertificate Title: ${certificate.title}\nCertificate ID: ${certificate.certificateId}\nStudent Name: ${certificate.studentName}\n\nVerify authenticity online at: ${publicVerifyUrl}\n\nRegards,\n${user?.name || certificate.studentName}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Verified Certificate - ${certificate.title}`,
          text: `Verified digital certificate issued by Bannari Amman Institute of Technology (ID: ${certificate.certificateId})`,
          url: publicVerifyUrl
        })
        .catch(() => {});
    } else {
      handleCopyShareLink();
    }
  };

  const handleDownload = () => {
    addToast('Preparing Download', 'Generating official printable document...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#1e3a8a] dark:text-blue-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-tight">
                  {certificate.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono font-bold text-[#1e3a8a] dark:text-blue-400">
                    ID: {certificate.certificateId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Copy Certificate ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    certificate.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : certificate.status === 'needs_review'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {certificate.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Issued {certificate.issueDate}
                </span>
              </div>

              {/* Share & Download Buttons */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShareOpen(!shareOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>

                  {/* Share Menu Popup */}
                  {shareOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-20 space-y-1">
                      <button
                        onClick={() => {
                          handleShareWhatsapp();
                          setShareOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Share via WhatsApp
                      </button>
                      <button
                        onClick={() => {
                          handleShareGmail();
                          setShareOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-rose-500" /> Share via Gmail
                      </button>
                      <button
                        onClick={() => {
                          handleCopyShareLink();
                          setShareOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-500" /> Copy Share Link
                      </button>
                      <button
                        onClick={() => {
                          handleNativeShare();
                          setShareOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <Share2 className="w-3.5 h-3.5 text-purple-500" /> System Share
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1e3a8a] hover:bg-blue-900 shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>

                {onDelete && (
                  <button
                    onClick={() => onDelete(certificate.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>

            {/* High Definition Preview Component */}
            <div className="p-2 sm:p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <CertificateTemplate certificate={certificate} previewMode={true} />
            </div>

            {/* Certificate Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recipient Name
                </span>
                <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{certificate.studentName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Reg No: {certificate.registerNumber}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Department / Body
                </span>
                <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-blue-400 shrink-0" />
                  {certificate.department}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Verification URL
                </span>
                <div className="font-mono text-xs text-[#1e3a8a] dark:text-blue-400 truncate mt-0.5">
                  {publicVerifyUrl}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
