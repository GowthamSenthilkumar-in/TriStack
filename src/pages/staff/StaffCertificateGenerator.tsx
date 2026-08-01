import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { useNotifications } from '../../context/NotificationContext';
import { CertificateTemplate } from '../../components/certificate/CertificateTemplate';
import { CertificateCategory, CertificateItem } from '../../types';
import { Sparkles, Send, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface StaffCertificateGeneratorProps {
  onNavigateToLedger: () => void;
}

export const StaffCertificateGenerator: React.FC<StaffCertificateGeneratorProps> = ({ onNavigateToLedger }) => {
  const { user } = useAuth();
  const { createOfficialCertificate } = useCertificates();
  const { addToast } = useNotifications();

  // Form State
  const [studentName, setStudentName] = useState('Gowtham S');
  const [studentRegNo, setStudentRegNo] = useState('7376241CS108');
  const [studentDept, setStudentDept] = useState('Computer Science and Engineering');
  const [studentEmail, setStudentEmail] = useState('gowtham.student@bitsathy.ac.in');
  const [title, setTitle] = useState('Academic Excellence in Deep Learning & Neural Networks');
  const [category, setCategory] = useState<CertificateCategory>('Academic Excellence');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [signatureTitle, setSignatureTitle] = useState('Head of Department, CSE');
  const [templateTheme, setTemplateTheme] = useState<'classic' | 'modern' | 'gold'>('classic');
  const [submitting, setSubmitting] = useState(false);

  const mockPreviewCert: CertificateItem = {
    id: 'PREVIEW-TEMP',
    certificateId: `BAIT/GEN/${new Date().getFullYear()}/0001`,
    certificateNo: `BAIT/GEN/${new Date().getFullYear()}/0001`,
    title,
    category,
    issuer: 'Bannari Amman Institute of Technology',
    issueDate,
    status: 'verified',
    studentId: 'std-preview',
    studentName,
    studentEmail,
    studentRegNo,
    studentDept,
    verifiedBy: user?.name || 'Faculty Issuer',
    verifiedAt: new Date().toISOString(),
    ledgerHash: 'b4a908f23498a76d123e456f789a012b345c678d901e234f567a890b123c456d',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAIT-PREVIEW',
    templateTheme,
    signatureTitle,
    createdAt: new Date().toISOString()
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !title) {
      addToast('Missing Details', 'Student name and certificate title are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createOfficialCertificate({
        title,
        category,
        studentName,
        studentRegNo,
        studentDept,
        studentEmail,
        issueDate,
        issuer: 'Bannari Amman Institute of Technology',
        verifiedBy: user?.name || 'Faculty Issuer',
        templateTheme,
        signatureTitle
      });

      addToast(
        'Certificate Successfully Issued!',
        `Official Certificate ID ${created.certificateId || created.certificateNo} stored on ledger and dispatched to ${studentName}.`,
        'success'
      );
      onNavigateToLedger();
    } catch (err) {
      addToast('Issuance Error', 'Could not lock certificate to ledger.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#1e3a8a] dark:text-blue-400" />
          Institutional Certificate Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Design, generate, and officially sign institutional credentials with automated blockchain ledger hash generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleIssue}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#1e3a8a] dark:text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Official Issuance Controls
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Student Full Name *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="eg: Gowtham S"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Register No</label>
                <input
                  type="text"
                  value={studentRegNo}
                  onChange={(e) => setStudentRegNo(e.target.value)}
                  placeholder="eg: 7376251CS194"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Department</label>
                <input
                  type="text"
                  value={studentDept}
                  onChange={(e) => setStudentDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Student Email Address
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="student@bitsathy.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Certificate Award Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Conduct & Meritorious Performance"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CertificateCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Academic Excellence">Academic Excellence</option>
                  <option value="Technical">Technical</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Signatory Title / Authority
              </label>
              <input
                type="text"
                value={signatureTitle}
                onChange={(e) => setSignatureTitle(e.target.value)}
                placeholder="Head of Department, CSE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Certificate Visual Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTemplateTheme('classic')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                    templateTheme === 'classic'
                      ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Classic Navy
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTheme('gold')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                    templateTheme === 'gold'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Gold Honor
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTheme('modern')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                    templateTheme === 'modern'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Emerald Tech
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-[#1e3a8a] hover:bg-blue-900 shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? 'Encrypting & Issuing...' : 'Issue & Lock Certificate to Ledger'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#1e3a8a]" /> Live Certificate Preview
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Auto-updating
            </span>
          </div>

          <div className="p-2 sm:p-4 rounded-3xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 shadow-inner">
            <CertificateTemplate certificate={mockPreviewCert} previewMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
