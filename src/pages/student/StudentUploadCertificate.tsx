import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { useNotifications } from '../../context/NotificationContext';
import { CertificateCategory } from '../../types';
import { UploadCloud, FileCheck, AlertTriangle, Sparkles, Check, RefreshCw, X } from 'lucide-react';

interface StudentUploadCertificateProps {
  onNavigateToVault: () => void;
}

export const StudentUploadCertificate: React.FC<StudentUploadCertificateProps> = ({ onNavigateToVault }) => {
  const { user } = useAuth();
  const { uploadCertificate, checkDuplicate } = useCertificates();
  const { addToast } = useNotifications();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CertificateCategory>('Workshop');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [certificateNo, setCertificateNo] = useState('');
  const [skills, setSkills] = useState<string>('React, Machine Learning, Web Development');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);

    // Trigger OCR parsing simulation
    runOcrSimulation(selectedFile.name);
  };

  const runOcrSimulation = (fileName: string) => {
    setOcrRunning(true);
    setOcrSuccess(false);

    setTimeout(() => {
      setOcrRunning(false);
      setOcrSuccess(true);

      // Extract smart field heuristics from file name or defaults
      const nameClean = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      
      let parsedTitle = 'Advanced Artificial Intelligence & Neural Networks Workshop';
      let parsedIssuer = 'Bannari Amman Institute of Technology';
      let parsedCategory: CertificateCategory = 'Workshop';

      if (nameClean.toLowerCase().includes('nptel')) {
        parsedTitle = 'NPTEL Online Certification - Data Structures and Algorithms';
        parsedIssuer = 'NPTEL / IIT Madras';
        parsedCategory = 'NPTEL/Coursera';
      } else if (nameClean.toLowerCase().includes('intern')) {
        parsedTitle = 'Full Stack Engineering Summer Internship';
        parsedIssuer = 'Tech Solutions Ltd.';
        parsedCategory = 'Internship';
      } else if (nameClean.toLowerCase().includes('hackathon')) {
        parsedTitle = 'National Level Hackathon 1st Runner Up';
        parsedIssuer = 'IIT Madras Shaastra';
        parsedCategory = 'Technical';
      }

      setTitle(parsedTitle);
      setIssuer(parsedIssuer);
      setCategory(parsedCategory);
      setCertificateNo(`BAIT-EXT-${Math.floor(1000 + Math.random() * 9000)}`);
      
      // Check duplicate
      const dup = checkDuplicate(parsedTitle, issuer);
      if (dup) {
        setDuplicateWarning(`Potential Duplicate Detected: You already uploaded "${dup.title}" issued on ${dup.issueDate}.`);
      } else {
        setDuplicateWarning(null);
      }

      addToast('OCR Extraction Complete', 'Certificate fields auto-filled via Optical Character Recognition.', 'success');
    }, 1200);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const dup = checkDuplicate(val, issuer);
    if (dup) {
      setDuplicateWarning(`Potential Duplicate Detected: "${dup.title}" exists in your records.`);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer) {
      addToast('Missing Fields', 'Please fill in the certificate title and issuing organization.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const skillArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await uploadCertificate({
        title,
        category,
        issuer,
        issueDate,
        certificateNo: certificateNo || undefined,
        fileUrl: filePreview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        skills: skillArray,
        studentName: user?.name || 'Student User',
        studentId: user?.id || 'std-1',
        studentEmail: user?.email || 'student@gmail.com',
        studentRegNo: user?.registerNumber || '7376241CS108',
        studentDept: user?.department || 'Computer Science and Engineering'
      });

      addToast('Upload Successful', 'Certificate submitted to Staff Review Queue for verification.', 'success');
      onNavigateToVault();
    } catch (err) {
      addToast('Upload Failed', 'An error occurred while saving certificate.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
          Upload External Certificate
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload certificates earned from external workshops, online courses, hackathons, or internships for official verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: File Upload Dropzone & OCR */}
        <div className="md:col-span-5 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelected(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden ${
              isDragging
                ? 'border-[#1e3a8a] bg-blue-50 dark:bg-blue-950/40'
                : file
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelected(e.target.files[0]);
                }
              }}
            />

            {filePreview ? (
              <div className="space-y-3 w-full">
                <div className="relative max-h-48 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                  {file?.type.includes('pdf') ? (
                    <div className="p-8 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold">
                      PDF Document Attached: {file.name}
                    </div>
                  ) : (
                    <img src={filePreview} alt="Certificate preview" className="w-full h-auto object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setFilePreview('');
                      setOcrSuccess(false);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{file?.name}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#1e3a8a] dark:text-blue-400 mx-auto w-fit">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Drag & Drop Certificate Image/PDF
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, or PDF up to 10MB</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#1e3a8a] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                >
                  Browse Computer
                </button>
              </div>
            )}
          </div>

          {/* OCR Processing Status Widget */}
          {ocrRunning && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-3 animate-pulse">
              <RefreshCw className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400 animate-spin" />
              <div>
                <p className="text-xs font-bold text-[#1e3a8a] dark:text-blue-300">OCR Scanner Active</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Scanning text, issuer seal, and date metadata...
                </p>
              </div>
            </div>
          )}

          {ocrSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  OCR Text Extraction Successful!
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Certificate title and organization autofilled below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Submission Form */}
        <div className="md:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
          >
            {duplicateWarning && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{duplicateWarning}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Certificate Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. AI & Deep Learning Workshop"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CertificateCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="Technical">Technical</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Internship">Internship</option>
                  <option value="NPTEL/Coursera">NPTEL / Coursera</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic Excellence">Academic Excellence</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. NPTEL / IIT Madras"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Issue Date *</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Certificate / Serial No (Optional)
                </label>
                <input
                  type="text"
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  placeholder="e.g. BAIT-2026-9812"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Skills / Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Python, Machine Learning"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-blue-900 active:bg-blue-950 shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting to Review Queue...' : 'Submit for Verification'}
                <FileCheck className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
