import React, { useState, useEffect } from 'react';
import { CertificateItem } from '../../types';
import { CertificateTemplate } from './CertificateTemplate';
import { BitLogo } from '../common/BitLogo';
import { ShieldCheck, AlertCircle, ArrowLeft, Search, CheckCircle2, Lock } from 'lucide-react';

interface PublicVerifyViewProps {
  initialCertId?: string;
  onBackToApp?: () => void;
}

export const PublicVerifyView: React.FC<PublicVerifyViewProps> = ({ initialCertId = '', onBackToApp }) => {
  const [certIdInput, setCertIdInput] = useState(initialCertId);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    certificate?: CertificateItem;
    message: string;
  } | null>(null);

  const fetchVerification = async (targetId: string) => {
    if (!targetId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(targetId.trim())}`);
      const data = await res.json();
      setVerificationResult({
        isValid: data.isValid,
        certificate: data.certificate,
        message: data.message
      });
    } catch (e) {
      setVerificationResult({
        isValid: false,
        message: 'Unable to connect to Bannari Amman Institute of Technology verification portal.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCertId) {
      fetchVerification(initialCertId);
    }
  }, [initialCertId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVerification(certIdInput);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <BitLogo size="sm" showText={false} />
            <div>
              <h1 className="font-serif font-bold text-[#1e3a8a] dark:text-blue-400 text-lg leading-tight">
                CertifyX Public Verification Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bannari Amman Institute of Technology Official Certificate Ledger
              </p>
            </div>
          </div>

          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          )}
        </div>

        {/* Verification Search Bar */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Verify Certificate Authenticity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter a unique Certificate ID (e.g. BAIT/AIW/2026/0742) to inspect official record on institutional blockchain ledger.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                placeholder="e.g. BAIT/AIW/2026/0742"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] uppercase"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-blue-900 shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Searching Ledger...' : 'Verify Now'}
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {verificationResult && (
          <div className="space-y-6">
            {verificationResult.isValid && verificationResult.certificate ? (
              <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border-2 border-emerald-500 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-emerald-500 text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-lg">
                      AUTHENTIC & VERIFIED CERTIFICATE
                    </h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-400">{verificationResult.message}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <CertificateTemplate certificate={verificationResult.certificate} previewMode={false} />
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border-2 border-rose-500 shadow-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-rose-500 text-white">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-900 dark:text-rose-300 text-lg">VERIFICATION UNCONFIRMED</h3>
                    <p className="text-sm text-rose-800 dark:text-rose-400 mt-0.5">{verificationResult.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
        © 2026 Bannari Amman Institute of Technology • Digital Certificate Vault & Verification System
      </footer>
    </div>
  );
};
