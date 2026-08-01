import React, { useRef } from 'react';
import { CertificateItem, CertificateRequest } from '../../types';
import { QRCodeView } from '../common/QRCodeView';
import { BitLogo } from '../common/BitLogo';
import { Download, Printer, ShieldCheck } from 'lucide-react';

interface CertificateTemplateProps {
  certificate?: Partial<CertificateItem>;
  request?: Partial<CertificateRequest>;
  previewMode?: boolean;
  onDownload?: () => void;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  certificate,
  request,
  previewMode = false,
  onDownload
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Derive display values from certificate or request object
  const certId = certificate?.certificateId || request?.certificateId || 'BAIT/CERT/2026/0108';
  const studentName = certificate?.studentName || request?.studentName || 'Student Name';
  const regNo = certificate?.registerNumber || certificate?.studentRegNo || request?.registerNumber || '7376241CS108';
  const title = certificate?.title || request?.title || 'Academic Certificate';
  const dept = certificate?.department || certificate?.studentDept || request?.department || 'Department of Computer Science and Engineering';
  const org = certificate?.organizationOrDept || request?.organizationOrDept || 'Department of Computer Science and Engineering';
  const eventDate = certificate?.eventDate || request?.eventDate || '31st July 2026';
  const issueDate = certificate?.issueDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const certType = certificate?.certificateType || request?.certificateType || 'bonafide';
  const purpose = certificate?.purpose || request?.purpose || '';
  const academicYear = certificate?.academicYear || request?.academicYear || '';
  const periodOfStudy = certificate?.periodOfStudy || request?.periodOfStudy || '';
  const conductRating = certificate?.conductRating || request?.conductRating || 'GOOD';
  const degree = certificate?.degree || request?.degree || 'B.E. Computer Science and Engineering';
  const grade = certificate?.grade || request?.grade || '';

  const typeTitles: Record<string, string> = {
    bonafide: 'BONAFIDE CERTIFICATE',
    conduct: 'CONDUCT & CHARACTER CERTIFICATE',
    course: 'CERTIFICATE OF COURSE COMPLETION',
    academic: 'CERTIFICATE OF ACADEMIC EXCELLENCE',
    workshop: 'CERTIFICATE OF PARTICIPATION',
    internship: 'CERTIFICATE OF INTERNSHIP',
    sports: 'CERTIFICATE OF SPORTS ACHIEVEMENT',
    paper: 'CERTIFICATE OF PRESENTATION'
  };

  const headerTitle = typeTitles[certType] || 'CERTIFICATE OF PARTICIPATION';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Action Toolbar */}
      {!previewMode && (
        <div className="flex items-center justify-end gap-3 w-full max-w-4xl mb-4 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-[#1e3a8a] dark:text-blue-400" /> Print Certificate
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1e3a8a] hover:bg-blue-900 shadow-md transition"
            >
              <Download className="w-4 h-4" /> Download Official PDF / Image
            </button>
          )}
        </div>
      )}

      {/* Certificate Container matching formal academic frame */}
      <div
        ref={containerRef}
        id="printable-certificate"
        className="relative w-full max-w-[920px] aspect-[1.414/1] bg-[#fffdf7] text-slate-900 shadow-2xl rounded-xl overflow-hidden border-8 border-[#1e3a8a] select-none print:shadow-none print:w-full print:max-w-none"
        style={{ fontFamily: 'Times New Roman, Georgia, serif' }}
      >
        {/* Outer Gold & Navy Ornamental Border Frame */}
        <div className="absolute inset-2 border-2 border-[#d97706] rounded-lg pointer-events-none" />
        <div className="absolute inset-4 border border-[#1e3a8a] rounded-md pointer-events-none" />

        {/* Top Left Navy Ribbon Corner & Golden Excellence Badge */}
        <div className="absolute top-0 left-0 w-44 h-44 overflow-hidden pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M 0 0 L 100 0 L 0 100 Z" fill="#1e3a8a" />
            <path d="M 0 0 L 75 0 L 0 75 Z" fill="#b45309" opacity="0.4" />
            <path d="M 0 85 L 85 0" stroke="#f59e0b" strokeWidth="2" />
          </svg>
        </div>

        {/* Top-Left Excellence Badge */}
        <div className="absolute top-6 left-6 z-10 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-white shadow-md border-2 border-amber-200 text-center p-1">
          <div className="text-[8px] font-bold tracking-tighter uppercase leading-tight">EXCELLENCE</div>
          <div className="text-[6px] tracking-tighter text-amber-100 uppercase">IN TECHNICAL</div>
          <div className="text-[6px] font-semibold text-amber-200 uppercase">EDUCATION</div>
          <div className="text-[7px] font-bold text-amber-100 mt-0.5">Since 1996</div>
        </div>

        {/* Bottom Right Navy Ribbon Corner */}
        <div className="absolute bottom-0 right-0 w-44 h-44 overflow-hidden pointer-events-none rotate-180">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M 0 0 L 100 0 L 0 100 Z" fill="#1e3a8a" />
            <path d="M 0 0 L 75 0 L 0 75 Z" fill="#b45309" opacity="0.4" />
            <path d="M 0 85 L 85 0" stroke="#f59e0b" strokeWidth="2" />
          </svg>
        </div>

        {/* Top Right QR Code & Verification ID */}
        <div className="absolute top-6 right-6 z-10 flex flex-col items-center">
          <QRCodeView value={`/verify/${encodeURIComponent(certId)}`} size={76} />
          <div className="text-[10px] font-mono font-bold text-[#1e3a8a] mt-1 tracking-wider uppercase">
            CERTIFICATE ID
          </div>
          <div className="text-[11px] font-mono font-bold text-slate-800 tracking-tight">
            {certId}
          </div>
        </div>

        {/* Certificate Main Body */}
        <div className="relative z-0 h-full flex flex-col justify-between p-10 sm:p-14 text-center">
          {/* Institution Header */}
          <div className="mt-2 flex flex-col items-center">
            <BitLogo size="md" showText={false} />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] tracking-tight uppercase mt-2 font-serif">
              BANNARI AMMAN INSTITUTE OF TECHNOLOGY
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-700 font-sans tracking-wide mt-0.5">
              (An Autonomous Institution Affiliated to Anna University, Chennai)
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-sans tracking-wider">
              Sathyamangalam, Erode - 638 401, Tamil Nadu, India
            </p>
          </div>

          {/* Certificate Title */}
          <div className="my-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wider font-serif uppercase border-b-2 border-amber-500/80 inline-block px-8 pb-1">
              {headerTitle}
            </h2>
            <div className="text-xs text-amber-700 font-semibold tracking-widest uppercase mt-2 font-sans">
              ❖ OF PARTICIPATION & ACHIEVEMENT ❖
            </div>
          </div>

          {/* Certification Text */}
          <div className="space-y-3 px-6 sm:px-12 my-2 font-sans">
            <p className="text-sm sm:text-base italic text-slate-700 font-serif">This is to certify that</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] italic font-serif tracking-wide border-b border-dashed border-slate-400 inline-block px-6 py-0.5">
              {studentName}
            </div>
            {regNo && (
              <div className="text-xs font-mono font-bold text-slate-700">
                Register No: <span className="text-[#1e3a8a]">{regNo}</span>
              </div>
            )}

            {certType === 'bonafide' && (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-2xl mx-auto pt-1">
                is a bona fide student of <strong>Bannari Amman Institute of Technology</strong>, studying in the{' '}
                <strong className="text-[#1e3a8a]">{degree || dept}</strong>
                {academicYear ? ` (${academicYear})` : ''}. This certificate is issued upon request for the purpose of{' '}
                <strong className="text-slate-900 underline decoration-amber-500 decoration-2">
                  {purpose || 'Academic & Institutional Purpose'}
                </strong>.
              </p>
            )}

            {certType === 'conduct' && (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-2xl mx-auto pt-1">
                was a student of <strong>{dept}</strong>, Bannari Amman Institute of Technology during the period{' '}
                <strong>{periodOfStudy || academicYear || '2023 - 2027'}</strong>. During this period of study, his / her conduct and character have been found to be{' '}
                <strong className="text-[#1e3a8a] text-sm sm:text-base uppercase bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                  {conductRating || 'GOOD'}
                </strong>.
              </p>
            )}

            {certType === 'course' && (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-2xl mx-auto pt-1">
                has successfully completed the course <strong className="text-slate-900 text-sm sm:text-base block sm:inline mt-1 sm:mt-0">"{title}"</strong>{' '}
                organized by the <span className="font-semibold text-[#1e3a8a]">{org}</span>, Bannari Amman Institute of Technology on{' '}
                <strong>{eventDate}</strong>
                {grade ? <span> with performance evaluation grade <strong>{grade}</strong></span> : ''}.
              </p>
            )}

            {certType === 'internship' && (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-2xl mx-auto pt-1">
                has successfully completed the industrial internship / in-plant training on <strong className="text-slate-900 text-sm sm:text-base block sm:inline mt-1 sm:mt-0">"{title}"</strong>{' '}
                at <span className="font-semibold text-[#1e3a8a]">{org}</span> completed on <strong>{eventDate}</strong>.
              </p>
            )}

            {certType === 'academic' && (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-2xl mx-auto pt-1">
                has been awarded this Certificate of Academic Excellence for <strong className="text-slate-900 text-sm sm:text-base block sm:inline mt-1 sm:mt-0">"{title}"</strong>{' '}
                in the <span className="font-semibold text-[#1e3a8a]">{dept}</span>, Bannari Amman Institute of Technology on <strong>{eventDate}</strong>.
              </p>
            )}

            {certType !== 'bonafide' && certType !== 'conduct' && certType !== 'course' && certType !== 'internship' && certType !== 'academic' && (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-2xl mx-auto pt-1">
                has successfully participated in / achieved <strong className="text-slate-900 text-sm sm:text-base block sm:inline mt-1 sm:mt-0">"{title}"</strong>{' '}
                organized by the <span className="font-semibold text-[#1e3a8a]">{org}</span>, Bannari Amman Institute of Technology on{' '}
                <strong className="font-semibold text-slate-900">{eventDate}</strong>.
              </p>
            )}
          </div>

          {/* Bottom Footer: Signatures & Gold Seal */}
          <div className="mt-6 flex items-end justify-between px-4 sm:px-8">
            {/* Left Signature: Coordinator / HOD */}
            <div className="flex flex-col items-center text-center w-48">
              <div className="h-10 flex items-end font-serif italic text-lg text-slate-800 font-bold border-b border-slate-800 w-full justify-center pb-1">
                K. Palanivel
              </div>
              <div className="text-xs font-bold text-slate-900 font-sans mt-1">Dr. K. Palanivel</div>
              <div className="text-[10px] text-slate-600 font-sans leading-tight">Coordinator</div>
              <div className="text-[10px] text-slate-600 font-sans">{dept}</div>
            </div>

            {/* Center Gold Embossed Seal */}
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-300 shadow-xl border-4 border-amber-200">
                <div className="w-16 h-16 rounded-full border border-amber-800/40 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-amber-500 to-amber-700 text-white">
                  <ShieldCheck className="w-6 h-6 text-amber-100" />
                  <span className="text-[7px] font-bold uppercase tracking-tighter text-amber-100 mt-0.5">OFFICIAL SEAL</span>
                  <span className="text-[6px] font-bold text-amber-200">BAIT • 1996</span>
                </div>
              </div>
            </div>

            {/* Right Signature: Principal */}
            <div className="flex flex-col items-center text-center w-48">
              <div className="h-10 flex items-end font-serif italic text-lg text-[#1e3a8a] font-bold border-b border-slate-800 w-full justify-center pb-1">
                C. Palanisamy
              </div>
              <div className="text-xs font-bold text-slate-900 font-sans mt-1">Dr. C. Palanisamy</div>
              <div className="text-[10px] text-slate-600 font-sans leading-tight">Principal</div>
              <div className="text-[10px] text-slate-600 font-sans">Bannari Amman Institute of Technology</div>
            </div>
          </div>

          {/* Bottom Left Date of Issue stamp */}
          <div className="absolute bottom-4 left-8 text-[11px] font-sans text-slate-600">
            <span className="font-semibold text-slate-800">Date of Issue:</span> {issueDate}
          </div>
        </div>
      </div>
    </div>
  );
};
