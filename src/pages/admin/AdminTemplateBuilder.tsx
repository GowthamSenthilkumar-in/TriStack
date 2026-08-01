import React, { useState } from 'react';
import { CertificateTemplate } from '../../components/certificate/CertificateTemplate';
import { useNotifications } from '../../context/NotificationContext';
import { CertificateItem } from '../../types';
import { Layers, Save, Sparkles, Check } from 'lucide-react';

export const AdminTemplateBuilder: React.FC = () => {
  const { addToast } = useNotifications();

  const [institutionName, setInstitutionName] = useState('Bannari Amman Institute of Technology');
  const [subHeading, setSubHeading] = useState('An Autonomous Institution • Affiliated to Anna University');
  const [signatureTitle, setSignatureTitle] = useState('Principal & Head of Academic Council');
  const [theme, setTheme] = useState<'classic' | 'gold' | 'modern'>('classic');

  const sampleCert: CertificateItem = {
    id: 'TEMPLATE-PREVIEW',
    certificateId: 'BAIT/TMP/2026/0001',
    certificateNo: 'BAIT/TMP/2026/0001',
    title: 'Certificate of Meritorious Academic Excellence & Innovation',
    category: 'Academic Excellence',
    issuer: institutionName,
    issueDate: new Date().toISOString().split('T')[0],
    status: 'verified',
    studentId: 'std-sample',
    studentName: 'Gowtham S',
    studentRegNo: '7376241CS108',
    studentDept: 'Computer Science and Engineering',
    studentEmail: 'gowtham.student@bitsathy.ac.in',
    verifiedBy: 'Academic Council',
    verifiedAt: new Date().toISOString(),
    ledgerHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAIT-TEMPLATE-PREVIEW',
    templateTheme: theme,
    signatureTitle,
    createdAt: new Date().toISOString()
  };

  const handleSave = () => {
    addToast('Template Saved', 'Master certificate template configuration updated successfully.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Institutional Certificate Template Builder
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Customize official typography, crest seals, layout accents, and signatory defaults for generated credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Design & Branding Settings
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Institution Header Title
            </label>
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Sub-heading Accreditation
            </label>
            <input
              type="text"
              value={subHeading}
              onChange={(e) => setSubHeading(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Default Signatory Authority
            </label>
            <input
              type="text"
              value={signatureTitle}
              onChange={(e) => setSignatureTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Visual Theme Palette
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('classic')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                  theme === 'classic'
                    ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                Classic Navy
              </button>
              <button
                type="button"
                onClick={() => setTheme('gold')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                  theme === 'gold'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                Gold Honor
              </button>
              <button
                type="button"
                onClick={() => setTheme('modern')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border ${
                  theme === 'modern'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                Emerald Tech
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-md transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Default Template
          </button>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Master Template Visual Render
          </span>
          <div className="p-2 sm:p-4 rounded-3xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800">
            <CertificateTemplate certificate={sampleCert} previewMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
