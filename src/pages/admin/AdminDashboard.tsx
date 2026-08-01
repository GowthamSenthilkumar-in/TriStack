import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import {
  Users,
  Award,
  ShieldCheck,
  Activity,
  UserCheck,
  Building,
  Sparkles,
  ArrowRight,
  Layers,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { users = [], auditLogs = [] } = useAuth();
  const { certificates = [] } = useCertificates();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '6m'>('30d');

  const totalUsers = (users || []).length || 1;
  const studentCount = (users || []).filter((u) => u.role === 'student').length;
  const staffCount = (users || []).filter((u) => u.role === 'staff').length;
  const adminCount = (users || []).filter((u) => u.role === 'admin').length;
  const totalCerts = (certificates || []).length;

  // Calculate percentages for user role distribution
  const studentPct = Math.round((studentCount / totalUsers) * 100);
  const staffPct = Math.round((staffCount / totalUsers) * 100);
  const adminPct = Math.max(0, 100 - studentPct - staffPct);

  // Identify dominant user role
  const roleMetrics = [
    { name: 'Students', count: studentCount, percentage: studentPct, color: '#1e3a8a', darkColor: '#3b82f6' },
    { name: 'Staff Verifiers', count: staffCount, percentage: staffPct, color: '#10b981', darkColor: '#34d399' },
    { name: 'Administrators', count: adminCount, percentage: adminPct, color: '#a855f7', darkColor: '#c084fc' }
  ].sort((a, b) => b.count - a.count);

  const dominantRole = roleMetrics[0];

  // Recharts data for user role percentage circle
  const pieData = [
    { name: 'Students', value: studentCount || 1, color: '#1e3a8a' },
    { name: 'Staff', value: staffCount || 0, color: '#10b981' },
    { name: 'Admin', value: adminCount || 0, color: '#8b5cf6' }
  ];

  // Simulated animated usage analytics data based on selected range
  const usageData7d = [
    { period: 'Mon', requests: 12, verifications: 10, uploads: 8 },
    { period: 'Tue', requests: 19, verifications: 15, uploads: 12 },
    { period: 'Wed', requests: 25, verifications: 22, uploads: 18 },
    { period: 'Thu', requests: 32, verifications: 28, uploads: 24 },
    { period: 'Fri', requests: 45, verifications: 40, uploads: 35 },
    { period: 'Sat', requests: 28, verifications: 25, uploads: 20 },
    { period: 'Sun', requests: 18, verifications: 16, uploads: 14 }
  ];

  const usageData30d = [
    { period: 'Week 1', requests: 85, verifications: 72, uploads: 60 },
    { period: 'Week 2', requests: 120, verifications: 110, uploads: 95 },
    { period: 'Week 3', requests: 165, verifications: 150, uploads: 130 },
    { period: 'Week 4', requests: 210, verifications: 195, uploads: 175 }
  ];

  const usageData6m = [
    { period: 'Feb', requests: 320, verifications: 290, uploads: 240 },
    { period: 'Mar', requests: 450, verifications: 410, uploads: 360 },
    { period: 'Apr', requests: 620, verifications: 580, uploads: 490 },
    { period: 'May', requests: 780, verifications: 740, uploads: 630 },
    { period: 'Jun', requests: 920, verifications: 880, uploads: 750 },
    { period: 'Jul', requests: 1150, verifications: 1080, uploads: 920 }
  ];

  const activeUsageData = timeRange === '7d' ? usageData7d : timeRange === '30d' ? usageData30d : usageData6m;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-[#1e3a8a] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Institutional Master Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            CertifyX Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/80 max-w-2xl leading-relaxed">
            Manage user roles, monitor faculty staff verifiers, inspect security audit logs, and inspect real-time application usage analytics.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/admin/users')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-purple-950 bg-white hover:bg-purple-50 transition shadow-md inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Manage User Accounts ({totalUsers})
            </button>
            <button
              onClick={() => onNavigate('/admin/templates')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-800/60 hover:bg-purple-800 transition border border-purple-400/30 inline-flex items-center gap-2"
            >
              <Layers className="w-4 h-4" /> Certificate Template Builder
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{totalUsers}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Accounts</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-blue-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{studentCount}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Students</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{staffCount}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Faculty Staff Verifiers</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{totalCerts}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Credentials Ledger</p>
          </div>
        </div>
      </div>

      {/* Analytics Section: Usage Graph & User Role Percentage Circle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Usage Representation Graph */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400" /> Application Usage Analytics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive real-time graph of requests, verifications, and certificate uploads
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              {(['7d', '30d', '6m'] as const).map((rng) => (
                <button
                  key={rng}
                  onClick={() => setTimeRange(rng)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    timeRange === rng
                      ? 'bg-white dark:bg-slate-900 text-[#1e3a8a] dark:text-blue-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {rng === '7d' ? '7 Days' : rng === '30d' ? '30 Days' : '6 Months'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorVer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorUpl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" name="Requests" />
                <Area type="monotone" dataKey="verifications" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVer)" name="Verifications" />
                <Area type="monotone" dataKey="uploads" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorUpl)" name="Uploads" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1e3a8a]" /> Certificate Requests
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Verifications Issued
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500" /> Vault Uploads
            </div>
          </div>
        </div>

        {/* Most User Role Percentage Circle */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" /> User Role Demographics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Most active user role breakdown percentage
              </p>
            </div>

            {/* Circular Percentage Donut Chart with Center Label */}
            <div className="relative h-48 w-full my-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Percentage Display inside Circle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {dominantRole.percentage}%
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  {dominantRole.name}
                </span>
              </div>
            </div>

            {/* Most User Role Summary Highlight Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-blue-300">
                Dominant User Category
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {dominantRole.name} account holders represent <span className="text-[#1e3a8a] dark:text-blue-400">{dominantRole.percentage}%</span> of all platform users ({dominantRole.count} of {totalUsers}).
              </p>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {roleMetrics.map((role) => (
              <div key={role.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{role.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-500 dark:text-slate-400">{role.count}</span>
                  <span className="font-bold text-slate-900 dark:text-white">({role.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('/admin/users')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition shadow-sm text-left group space-y-3"
        >
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 w-fit group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">User & Role Management</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Create user accounts, assign roles (Student, Staff, Admin), toggle account active status.
          </p>
        </button>

        <button
          onClick={() => onNavigate('/admin/templates')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition shadow-sm text-left group space-y-3"
        >
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#1e3a8a] dark:text-blue-400 w-fit group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Certificate Template Customizer</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Design institutional layout themes, set seal watermarks, and adjust signature titles.
          </p>
        </button>

        <button
          onClick={() => onNavigate('/admin/activity-logs')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm text-left group space-y-3"
        >
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Security Audit Trail</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Inspect real-time system logs for user log-ins, approvals, rejections, and setting changes.
          </p>
        </button>
      </div>

      {/* System Audit Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" /> Recent Security & Audit Logs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time ledger and user activity tracking</p>
          </div>
          <button
            onClick={() => onNavigate('/admin/activity-logs')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
          >
            Full Audit Logs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 px-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{log.actorName}</span>{' '}
                  <span className="text-slate-500 dark:text-slate-400">{log.action}</span>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
