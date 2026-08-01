import React, { useState } from 'react';
import { useCertificates } from '../../context/CertificateContext';
import { useNotifications } from '../../context/NotificationContext';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import { Award, Search, Download, Filter, RefreshCw, Trash2, Eye } from 'lucide-react';

interface StaffIssuedCertificatesLedgerProps {
  onViewCert: (certId: string) => void;
}

export const StaffIssuedCertificatesLedger: React.FC<StaffIssuedCertificatesLedgerProps> = ({ onViewCert }) => {
  const { certificates = [], deleteCertificate } = useCertificates();
  const { addToast } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCerts = certificates.filter((c) => {
    const query = searchTerm.trim().toLowerCase();
    const title = (c.title || '').toLowerCase();
    const studentName = (c.studentName || '').toLowerCase();
    const regNo = (c.studentRegNo || c.registerNumber || '').toLowerCase();
    const issuer = (c.issuer || c.organizationOrDept || '').toLowerCase();
    const certNo = (c.certificateNo || c.certificateId || '').toLowerCase();

    const matchesSearch =
      !query ||
      title.includes(query) ||
      studentName.includes(query) ||
      regNo.includes(query) ||
      issuer.includes(query) ||
      certNo.includes(query);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ['Certificate ID', 'Student Name', 'Register No', 'Title', 'Category', 'Issuer', 'Status', 'Issue Date'];
    const rows = filteredCerts.map((c) => [
      c.certificateNo || c.id,
      `"${c.studentName}"`,
      c.studentRegNo || '',
      `"${c.title}"`,
      c.category,
      `"${c.issuer}"`,
      c.status,
      c.issueDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CertifyX_Ledger_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Report Exported', 'CSV summary downloaded to your computer.', 'success');
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to revoke/delete "${title}" from the ledger?`)) {
      deleteCertificate(id);
      addToast('Certificate Revoked', `Removed ${title} from active ledger.`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-[#1e3a8a] dark:text-blue-400" />
            Issued Certificates & Verification Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Official institutional repository of verified academic credentials, certificates, and hash signatures.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export CSV Ledger
        </button>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, register number, title, or cert ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          >
            <option value="all">All Statuses ({certificates.length})</option>
            <option value="verified">Verified ({certificates.filter((c) => c.status === 'verified').length})</option>
            <option value="pending">Pending ({certificates.filter((c) => c.status === 'pending').length})</option>
            <option value="rejected">Rejected ({certificates.filter((c) => c.status === 'rejected').length})</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Workshop">Workshop</option>
            <option value="Internship">Internship</option>
            <option value="NPTEL/Coursera">NPTEL/Coursera</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Academic Excellence">Academic Excellence</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredCerts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          No certificate records found matching search filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onViewDetails={(c) => onViewCert(c.id)}
              onDelete={(c) => handleDelete(c.id, c.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
