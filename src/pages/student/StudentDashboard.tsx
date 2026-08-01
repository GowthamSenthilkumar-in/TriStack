import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import {
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  UploadCloud,
  FilePlus,
  Vault,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
  onViewCert: (certId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onViewCert }) => {
  const { user } = useAuth();
  const { certificates = [] } = useCertificates();

  // Filter student's certificates
  const userEmail = (user?.email || '').toLowerCase();
  const userId = user?.id;

  const studentCerts = certificates.filter(
    (c) =>
      (c.studentEmail && userEmail && c.studentEmail.toLowerCase() === userEmail) ||
      (userId && c.studentId === userId)
  );

  const totalCerts = studentCerts.length;
  const verifiedCerts = studentCerts.filter((c) => c.status === 'verified').length;
  const pendingCerts = studentCerts.filter((c) => c.status === 'pending').length;
  const rejectedCerts = studentCerts.filter((c) => c.status === 'rejected').length;

  const recentCerts = [...studentCerts].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1e3a8a] to-blue-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to CertifyX Student Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Greetings, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
            Register No: <span className="font-mono font-bold text-white">{user?.registerNumber || '7376241CS108'}</span> • Department of {user?.department || 'Computer Science and Engineering'}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/student/upload')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#1e3a8a] bg-white hover:bg-blue-50 transition shadow-md inline-flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" /> Upload New Certificate
            </button>
            <button
              onClick={() => onNavigate('/student/vault')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-800/60 hover:bg-blue-800 transition border border-blue-400/30 inline-flex items-center gap-2"
            >
              <Vault className="w-4 h-4" /> Open DigiLocker Vault
            </button>
          </div>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{totalCerts}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Credentials</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{verifiedCerts}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Credentials</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{pendingCerts}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Under Review</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{rejectedCerts}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Action Needed</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('/student/upload')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#1e3a8a] dark:hover:border-blue-500 shadow-sm transition text-left group space-y-2"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#1e3a8a] dark:text-blue-400 w-fit group-hover:scale-110 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Upload External Certificate</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Upload workshop or course completion certificates with OCR extraction.
          </p>
        </button>

        <button
          onClick={() => onNavigate('/student/request')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition text-left group space-y-2"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit group-hover:scale-110 transition-transform">
            <FilePlus className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Request Official Institutional Certificate</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Submit request for course completion, conduct, or honor certificates.
          </p>
        </button>

        <button
          onClick={() => onNavigate('/student/vault')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 shadow-sm transition text-left group space-y-2"
        >
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 w-fit group-hover:scale-110 transition-transform">
            <Vault className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Access DigiLocker Vault</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            View, download PDF/PNG, or copy public share links of your verified credentials.
          </p>
        </button>
      </div>

      {/* Recent Certificates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">Recent Certificates</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your latest uploaded and issued academic achievements.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/student/vault')}
            className="text-xs font-bold text-[#1e3a8a] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            View All ({totalCerts}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentCerts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No certificates found</p>
            <p className="text-xs text-slate-400">Upload your first certificate or submit a request to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCerts.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onViewDetails={(c) => onViewCert(c.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
