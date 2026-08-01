import React from 'react';
import { ThemeToggleButtons } from '../../components/common/ThemeToggleButtons';
import { Settings, Moon, Bell, Lock, Shield } from 'lucide-react';

export const StudentSettings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#1e3a8a] dark:text-blue-400" />
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Customize portal appearance, notification preferences, and account security.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Theme Preferences */}
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Appearance & Theme Mode</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Switch between Light, Dark, or System automatic themes.
          </p>
          <div className="pt-2">
            <ThemeToggleButtons layout="full" />
          </div>
        </div>

        {/* Security Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Institutional Encryption & Privacy</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            CertifyX credentials are digitally signed using SHA-256 cryptographic hashes and indexed on the Bannari Amman Institute of Technology private ledger.
          </p>
        </div>
      </div>
    </div>
  );
};
