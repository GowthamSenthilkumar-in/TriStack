import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import { CertificateCategory } from '../../types';
import { Vault, Search, Filter, RefreshCw, UploadCloud, ShieldCheck } from 'lucide-react';

interface StudentDigiLockerVaultProps {
  onNavigateToUpload: () => void;
  onViewCertDetails: (certId: string) => void;
}

export const StudentDigiLockerVault: React.FC<StudentDigiLockerVaultProps> = ({
  onNavigateToUpload,
  onViewCertDetails
}) => {
  const { user } = useAuth();
  const { certificates = [] } = useCertificates();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const userEmail = (user?.email || '').toLowerCase();
  const userId = user?.id;

  const myCerts = certificates.filter(
    (c) =>
      (c.studentEmail && userEmail && c.studentEmail.toLowerCase() === userEmail) ||
      (userId && c.studentId === userId)
  );

  const filteredCerts = myCerts.filter((c) => {
    const query = searchTerm.trim().toLowerCase();
    const title = (c.title || '').toLowerCase();
    const issuer = (c.issuer || c.organizationOrDept || '').toLowerCase();
    const certNo = (c.certificateNo || c.certificateId || '').toLowerCase();

    const matchesSearch =
      !query ||
      title.includes(query) ||
      issuer.includes(query) ||
      certNo.includes(query);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <Vault className="w-6 h-6 text-[#1e3a8a] dark:text-blue-400" />
            DigiLocker Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Encrypted personal repository for all institutional and external credentials.
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1e3a8a] hover:bg-blue-900 transition shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" /> Upload New Certificate
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, issuer, or certificate ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
          >
            <option value="all">All Statuses ({myCerts.length})</option>
            <option value="verified">Verified ({myCerts.filter((c) => c.status === 'verified').length})</option>
            <option value="pending">Pending ({myCerts.filter((c) => c.status === 'pending').length})</option>
            <option value="rejected">Rejected ({myCerts.filter((c) => c.status === 'rejected').length})</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
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

      {/* Certificate Cards Grid */}
      {filteredCerts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Vault className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">No certificates found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No certificate records matched your current filter or search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onViewDetails={(c) => onViewCertDetails(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
