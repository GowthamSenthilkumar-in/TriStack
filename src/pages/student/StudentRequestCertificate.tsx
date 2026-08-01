import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { useNotifications } from '../../context/NotificationContext';
import { CertificateTemplate } from '../../components/certificate/CertificateTemplate';
import { CertificateType, CertificateCategory, CertificateItem } from '../../types';
import {
  FileText,
  ShieldCheck,
  Send,
  Eye,
  Download,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Trophy,
  Sparkles,
  CheckCircle2,
  Printer
} from 'lucide-react';

interface StudentRequestCertificateProps {
  onNavigateToVault: () => void;
}

export const StudentRequestCertificate: React.FC<StudentRequestCertificateProps> = ({ onNavigateToVault }) => {
  const { user } = useAuth();
  const { requestCertificate } = useCertificates();
  const { addToast } = useNotifications();

  // Active view: 'form' or 'preview'
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Certificate Type Selection
  const [certType, setCertType] = useState<CertificateType>('bonafide');

  // Student Details (Empty by default so placeholders eg: Gowtham S, eg: 7376251CS194 are visible)
  const [studentName, setStudentName] = useState('');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [degree, setDegree] = useState('');
  const [fatherName, setFatherName] = useState('');

  // Dynamic Certificate Specific Fields (Empty by default with eg placeholders)
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [periodOfStudy, setPeriodOfStudy] = useState('');
  const [conductRating, setConductRating] = useState('');
  const [organization, setOrganization] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [grade, setGrade] = useState('');

  const [loading, setLoading] = useState(false);

  // Map title placeholders dynamically based on selected certificate type
  const titlePlaceholders: Record<string, string> = {
    bonafide: 'eg: Bona Fide Student Certificate',
    conduct: 'eg: Conduct and Character Certificate',
    course: 'eg: Certificate of Course Completion in Full-Stack Web Development',
    academic: 'eg: Certificate of Academic Excellence - Class Topper',
    workshop: 'eg: One Day Workshop on AI and Machine Learning',
    internship: 'eg: Industrial Internship & In-Plant Training Certificate',
    sports: 'eg: Inter-College Sports Tournament Certificate'
  };
  const typeCodeMap: Record<string, string> = {
    bonafide: 'BON',
    conduct: 'CON',
    course: 'CRSE',
    academic: 'ACAD',
    workshop: 'WRK',
    internship: 'INT',
    sports: 'SPRT',
    paper: 'PPR'
  };

  const codePrefix = typeCodeMap[certType] || 'CERT';
  const yearStr = new Date().getFullYear();
  const randomNo = Math.floor(1000 + Math.random() * 9000);
  const uniqueCertId = `BAIT/${codePrefix}/${yearStr}/${randomNo}`;

  // Map CertificateType to Category
  const categoryMap: Record<string, CertificateCategory> = {
    bonafide: 'Bonafide',
    conduct: 'Conduct',
    course: 'Academic Excellence',
    academic: 'Academic Excellence',
    workshop: 'Workshop',
    internship: 'Internship',
    sports: 'Sports'
  };

  // Draft object for Live Certificate Template Preview
  const previewCert: Partial<CertificateItem> = {
    certificateId: uniqueCertId,
    studentName: studentName || user?.name || 'Student Name',
    studentRegNo: studentRegNo || user?.registerNumber || '7376241CS108',
    studentDept: studentDept || user?.department || 'Computer Science and Engineering',
    registerNumber: studentRegNo,
    department: studentDept,
    title,
    certificateType: certType,
    category: categoryMap[certType] || 'Technical',
    organizationOrDept: organization,
    eventDate,
    issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    purpose,
    academicYear,
    periodOfStudy,
    conductRating,
    degree,
    grade,
    fatherName,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(uniqueCertId)}`
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !title) {
      addToast('Missing Required Fields', 'Please complete student name and certificate title.', 'error');
      return;
    }

    setLoading(true);
    try {
      await requestCertificate({
        title,
        certificateType: certType,
        category: categoryMap[certType] || 'Technical',
        purpose,
        description: `Requested ${certType.toUpperCase()} certificate for ${studentName} (${studentRegNo}). Purpose: ${purpose}`,
        studentName,
        studentId: user?.id || 'std-1',
        studentEmail: user?.email || 'student@gmail.com',
        registerNumber: studentRegNo,
        department: studentDept,
        organizationOrDept: organization,
        eventDate,
        academicYear,
        periodOfStudy,
        conductRating,
        degree,
        grade,
        fatherName,
        certificateId: uniqueCertId
      });

      addToast(
        'Request Dispatched Successfully!',
        `Your request for ${certType.toUpperCase()} Certificate (ID: ${uniqueCertId}) has been sent to Staff Queue.`,
        'success'
      );
      onNavigateToVault();
    } catch (err) {
      addToast('Error Submitting Request', 'Could not process request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPreview = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#1e3a8a] dark:text-blue-400" />
            Request Institutional Certificate
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select certificate type, fill student & event parameters, preview template with unique QR code, and submit request.
          </p>
        </div>

        {/* Tab Switcher: Form vs Live Preview */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-white dark:bg-slate-900 text-[#1e3a8a] dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> 1. Certificate Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-[#1e3a8a] dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" /> 2. Live Template Preview
          </button>
        </div>
      </div>

      {/* Select Certificate Type Options */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Select Required Certificate Type *
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {[
            { id: 'bonafide', label: 'Bonafide', icon: GraduationCap, color: 'text-blue-600 bg-blue-50 border-blue-200' },
            { id: 'conduct', label: 'Conduct', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { id: 'course', label: 'Course', icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-200' },
            { id: 'academic', label: 'Academic', icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { id: 'workshop', label: 'Workshop', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
            { id: 'internship', label: 'Internship', icon: Briefcase, color: 'text-teal-600 bg-teal-50 border-teal-200' },
            { id: 'sports', label: 'Sports', icon: Trophy, color: 'text-rose-600 bg-rose-50 border-rose-200' }
          ].map((type) => {
            const IconComp = type.icon;
            const isSelected = certType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setCertType(type.id as CertificateType)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col items-center justify-center text-center gap-2 ${
                  isSelected
                    ? 'border-[#1e3a8a] bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-[#1e3a8a]'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    isSelected ? 'bg-[#1e3a8a] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${isSelected ? 'text-[#1e3a8a] dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Logged-in Student Identity Information */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Student Identity Details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pre-filled based on your logged-in portal account details ({user?.email || 'authenticated user'}).
                </p>
              </div>

              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-blue-100 text-[#1e3a8a] dark:bg-blue-950 dark:text-blue-300">
                REGISTERED STUDENT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="eg: Gowtham S"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Register Number *
                </label>
                <input
                  type="text"
                  value={studentRegNo}
                  onChange={(e) => setStudentRegNo(e.target.value)}
                  placeholder="eg: 7376251CS194"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Department *
                </label>
                <input
                  type="text"
                  value={studentDept}
                  onChange={(e) => setStudentDept(e.target.value)}
                  placeholder="eg: Computer Science and Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Degree / Programme
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="eg: B.E. Computer Science and Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Father's Name (optional)
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="eg: Senthil kumar R"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Certificate Parameters */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400" />
                Certificate Parameters ({certType.toUpperCase()})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specific details to be formatted into the official certificate body.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Certificate Header Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={titlePlaceholders[certType] || 'eg: Bona Fide Student Certificate'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              {/* Dynamic inputs based on certificate type */}
              {certType === 'bonafide' && (
                <>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Purpose of Bonafide Certificate
                    </label>
                    <input
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="eg: Applying for Passport Application / Bank Loan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Current Academic Year & Semester
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="eg: 2025 - 2026 (VI Semester)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>
                </>
              )}

              {certType === 'conduct' && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Period of Study at BIT
                    </label>
                    <input
                      type="text"
                      value={periodOfStudy}
                      onChange={(e) => setPeriodOfStudy(e.target.value)}
                      placeholder="eg: August 2023 to May 2027"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Conduct & Character Rating
                    </label>
                    <input
                      type="text"
                      value={conductRating}
                      onChange={(e) => setConductRating(e.target.value)}
                      placeholder="eg: GOOD & EXEMPLARY"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>
                </>
              )}

              {certType === 'course' && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Evaluation Grade / Score
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="eg: Grade A+ / CGPA 9.2"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Organizing Department / Platform
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="eg: Department of CSE / NPTEL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>
                </>
              )}

              {certType === 'internship' && (
                <>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Industry / Company Name
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="eg: Zoho Corporation Pvt. Ltd."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Event / Completion Date
                </label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="eg: 31st July 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Unique Certificate ID (Auto-Generated)
                </label>
                <input
                  type="text"
                  value={uniqueCertId}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-[#1e3a8a] dark:text-blue-300 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs text-[#1e3a8a] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 transition flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> Preview Template with QR Code
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#1e3a8a] hover:bg-blue-900 shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Submit Request to Staff Queue'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Preview Tab: Real-Time Live Certificate Template */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Live Certificate Template Preview
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-300">
                  Includes unique Certificate ID (<span className="font-mono font-bold">{uniqueCertId}</span>) and scannable QR Code.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownloadPreview}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1e3a8a] hover:bg-blue-900 transition flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" /> Download / Print Preview
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 transition"
              >
                Edit Parameters
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 shadow-2xl flex justify-center">
            <CertificateTemplate certificate={previewCert} previewMode={false} onDownload={handleDownloadPreview} />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-blue-900 shadow-xl transition flex items-center gap-2"
            >
              {loading ? 'Submitting Request...' : 'Confirm & Dispatch Request to Staff Queue'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
