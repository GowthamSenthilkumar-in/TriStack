import React from 'react';
import { ThemeToggleButtons } from '../../components/common/ThemeToggleButtons';
import { Settings, Moon, Shield } from 'lucide-react';

export const StaffSettings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Faculty Workstation Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure interface theme, notification preferences, and verification ledger options.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Appearance & Theme Mode</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Switch between Light, Dark, or System automatic themes.
          </p>
          <div className="pt-2">
            <ThemeToggleButtons layout="full" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Ledger Digital Signature Protocol</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All approvals issued under your faculty account automatically stamp a unique SHA-256 verification string and attach an institutional QR code pointing to the public verification portal.
          </p>
        </div>
      </div>
    </div>
  );
};
