import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity, Search, Shield, Filter, Clock } from 'lucide-react';

export const AdminSystemAuditLogs: React.FC = () => {
  const { auditLogs = [] } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = (auditLogs || []).filter((log) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    const actor = (log.actorName || log.userName || '').toLowerCase();
    const action = (log.action || '').toLowerCase();
    const details = (log.details || '').toLowerCase();

    return actor.includes(query) || action.includes(query) || details.includes(query);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          System Security & Ledger Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Immutable audit trail capturing administrative activities, certificate approvals, user logins, and ledger operations.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter audit log entries by user, action, or details..."
          className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
        />
      </div>

      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No audit log records match search filter.</div>
        ) : (
          filtered.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {log.actorName}{' '}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">[{log.action}]</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{log.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono shrink-0 self-end sm:self-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
