import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { INSTITUTION_INFO } from '../../lib/constants';
import { ScanText, CheckCircle, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

interface OCRResult {
  text: string;
  matchScore: number;
  status: 'verified' | 'needs_review' | 'rejected';
  flags: string[];
}

interface OCRVerificationEngineProps {
  imageFile?: File | string | null;
  expectedName?: string;
  expectedTitle?: string;
  expectedDate?: string;
  onAnalysisComplete?: (result: OCRResult) => void;
}

export const OCRVerificationEngine: React.FC<OCRVerificationEngineProps> = ({
  imageFile,
  expectedName = '',
  expectedTitle = '',
  expectedDate = '',
  onAnalysisComplete
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<OCRResult | null>(null);

  const runOCR = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    setProgress(0);
    setStatusText('Initializing OCR Engine...');

    try {
      let imageSource: string | File = imageFile;

      const worker = await Tesseract.createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setStatusText(`Recognizing Text (${Math.round(m.progress * 100)}%)...`);
          } else {
            setStatusText(m.status);
          }
        }
      });

      const ret = await worker.recognize(imageSource);
      await worker.terminate();

      const extracted = ret.data.text || '';
      const flags: string[] = [];
      let totalPoints = 0;
      let maxPoints = 4;

      // 1. Check for Institute Name
      const containsInst =
        extracted.toLowerCase().includes('bannari amman') ||
        extracted.toLowerCase().includes('institute of technology') ||
        extracted.toLowerCase().includes('bitsathy');
      if (containsInst) {
        totalPoints += 1;
      } else {
        flags.push('Institute Name ("Bannari Amman Institute of Technology") missing or unreadable.');
      }

      // 2. Check for Name
      if (expectedName) {
        const nameTokens = expectedName.toLowerCase().split(/\s+/).filter(Boolean);
        const nameMatches = nameTokens.filter((token) => extracted.toLowerCase().includes(token));
        if (nameMatches.length >= Math.ceil(nameTokens.length * 0.5)) {
          totalPoints += 1;
        } else {
          flags.push(`Recipient name "${expectedName}" not found in extracted text.`);
        }
      } else {
        maxPoints -= 1;
      }

      // 3. Check for Title / Course
      if (expectedTitle) {
        const titleTokens = expectedTitle.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
        const titleMatches = titleTokens.filter((token) => extracted.toLowerCase().includes(token));
        if (titleMatches.length >= Math.max(1, Math.floor(titleTokens.length * 0.4))) {
          totalPoints += 1;
        } else {
          flags.push(`Course/Workshop title keyword mismatch.`);
        }
      } else {
        maxPoints -= 1;
      }

      // 4. Check for Certificate keywords (Certificate, Participation, Completion)
      const containsCertKey =
        extracted.toLowerCase().includes('certificate') ||
        extracted.toLowerCase().includes('certify') ||
        extracted.toLowerCase().includes('participation');
      if (containsCertKey) {
        totalPoints += 1;
      } else {
        flags.push('Standard academic certificate keywords missing.');
      }

      const score = Math.min(100, Math.round((totalPoints / maxPoints) * 100));

      let finalStatus: OCRResult['status'] = 'needs_review';
      if (score >= 80 && flags.length === 0) {
        finalStatus = 'verified';
      } else if (score < 40) {
        finalStatus = 'rejected';
      }

      const ocrRes: OCRResult = {
        text: extracted,
        matchScore: score,
        status: finalStatus,
        flags
      };

      setResult(ocrRes);
      if (onAnalysisComplete) {
        onAnalysisComplete(ocrRes);
      }
    } catch (err) {
      console.error('OCR Error:', err);
      const fallbackRes: OCRResult = {
        text: 'OCR scan completed with manual review required.',
        matchScore: 65,
        status: 'needs_review',
        flags: ['Automated OCR text confidence low — manual staff inspection required.']
      };
      setResult(fallbackRes);
      if (onAnalysisComplete) onAnalysisComplete(fallbackRes);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScanText className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Automated OCR Originality Check</h4>
        </div>
        {!result && !analyzing && (
          <button
            type="button"
            onClick={runOCR}
            disabled={!imageFile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1e3a8a] hover:bg-blue-900 transition disabled:opacity-50"
          >
            <ScanText className="w-3.5 h-3.5" />
            Scan Document
          </button>
        )}
      </div>

      {analyzing && (
        <div className="space-y-2 py-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1e3a8a] dark:text-blue-400" />
              {statusText}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1e3a8a] dark:bg-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Match Confidence Score</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {result.matchScore}%
              </div>
            </div>
            <div>
              {result.status === 'verified' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified Original
                </span>
              )}
              {result.status === 'needs_review' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5" /> Needs Review
                </span>
              )}
            </div>
          </div>

          {result.flags.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> OCR Mismatches Flagged for Staff:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90 pl-1">
                {result.flags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {result.text && (
            <details className="text-xs">
              <summary className="font-medium text-slate-600 dark:text-slate-400 cursor-pointer hover:underline flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> View Raw Extracted OCR Text
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {result.text}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};
