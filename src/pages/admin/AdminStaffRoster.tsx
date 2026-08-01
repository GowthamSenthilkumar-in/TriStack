import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Shield, CheckCircle2, Building, Mail } from 'lucide-react';

export const AdminStaffRoster: React.FC = () => {
  const { users = [] } = useAuth();
  const staffMembers = (users || []).filter((u) => u.role === 'staff');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Faculty Staff Roster & Approver Network
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Faculty members authorized to review student submissions and sign digital certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-lg flex items-center justify-center shrink-0">
              {staff.name.charAt(0)}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{staff.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Faculty Verifier
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{staff.email}</p>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{staff.department}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full Approval Privileges Active
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
