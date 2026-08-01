import React from 'react';
import { useCertificates } from '../../context/CertificateContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, Award, CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

export const StaffAnalyticsReports: React.FC = () => {
  const { certificates = [] } = useCertificates();

  // Calculate category stats
  const categoryCounts: Record<string, number> = {};
  (certificates || []).forEach((c) => {
    const cat = c.category || c.certificateType || 'Technical';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    count: categoryCounts[cat]
  }));

  // Status stats for Pie
  const statusCounts = {
    Verified: certificates.filter((c) => c.status === 'verified').length,
    Pending: certificates.filter((c) => c.status === 'pending').length,
    Rejected: certificates.filter((c) => c.status === 'rejected').length
  };

  const statusPieData = [
    { name: 'Verified', value: statusCounts.Verified, color: '#10b981' },
    { name: 'Pending Review', value: statusCounts.Pending, color: '#f59e0b' },
    { name: 'Rejected', value: statusCounts.Rejected, color: '#f43f5e' }
  ];

  // Monthly trend mock data
  const monthlyTrendData = [
    { month: 'Jan', uploaded: 12, verified: 10 },
    { month: 'Feb', uploaded: 18, verified: 15 },
    { month: 'Mar', uploaded: 25, verified: 22 },
    { month: 'Apr', uploaded: 30, verified: 28 },
    { month: 'May', uploaded: 42, verified: 38 },
    { month: 'Jun', uploaded: 55, verified: 50 },
    { month: 'Jul', uploaded: certificates.length + 10, verified: certificates.filter((c) => c.status === 'verified').length }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#1e3a8a] dark:text-blue-400" />
          Analytics & Institutional Verification Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Visual metrics tracking certificate distribution across categories, approval ratios, and processing timeline velocity.
        </p>
      </div>

      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{certificates.length}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Ledger Items</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {Math.round((statusCounts.Verified / (certificates.length || 1)) * 100)}%
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verification Approval Rate</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">1.2 Days</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Review Turnaround</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">99.8%</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">OCR Parsing Accuracy</p>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Certificate Distribution by Category</h3>
            <span className="text-xs text-slate-400 font-mono font-semibold">Bannari Amman Inst.</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Verification Status Ratio</h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Verified ({statusCounts.Verified})
            </div>
            <div className="flex items-center gap-1 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending ({statusCounts.Pending})
            </div>
            <div className="flex items-center gap-1 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Rejected ({statusCounts.Rejected})
            </div>
          </div>
        </div>

        {/* Monthly Submission & Approval Velocity */}
        <div className="lg:col-span-12 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Submissions & Verification Growth</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comparing total submissions against approved credentials over time</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUploaded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="uploaded" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUploaded)" name="Submissions" />
                <Area type="monotone" dataKey="verified" stroke="#10b981" fillOpacity={1} fill="url(#colorVerified)" name="Verified" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
