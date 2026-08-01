import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BitLogo } from '../../components/common/BitLogo';
import { User, Mail, Shield, BookOpen, Hash, Building, Award } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-[#1e3a8a] dark:text-blue-400" />
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Institutional identity and academic registration details.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-[#1e3a8a] text-white font-serif font-bold text-3xl flex items-center justify-center shadow-lg">
            {user?.name.charAt(0) || 'S'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-100 text-[#1e3a8a] dark:bg-blue-950/60 dark:text-blue-300">
              <Shield className="w-3.5 h-3.5" /> Student Account
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Hash className="w-3.5 h-3.5" /> Register Number
            </span>
            <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">
              {user?.registerNumber || '7376241CS108'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Department
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {user?.department || 'Computer Science and Engineering'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Institution
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Bannari Amman Institute of Technology
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Academic Year / Batch
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">2023 - 2027 (Final Year)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
