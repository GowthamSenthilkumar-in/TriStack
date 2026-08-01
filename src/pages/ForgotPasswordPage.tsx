import React, { useState } from 'react';
import { BitLogo } from '../components/common/BitLogo';
import { ArrowLeft, Mail, CheckCircle2, KeyRound } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-md mx-auto w-full my-auto space-y-6">
        <div className="text-center space-y-3">
          <BitLogo size="md" showText={false} className="mx-auto" />
          <h1 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">Reset Password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your institutional email address to receive a secure password reset link.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Reset Link Dispatched</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instructions to reset your password have been sent to{' '}
                  <strong className="text-slate-900 dark:text-white font-mono">{email}</strong>.
                </p>
              </div>
              <button
                onClick={onBackToLogin}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#1e3a8a] hover:bg-blue-900 transition"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#1e3a8a] hover:bg-blue-900 transition disabled:opacity-50"
              >
                {loading ? 'Sending Request...' : 'Send Password Reset Link'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </button>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-400 dark:text-slate-500 py-4">
        © 2026 Bannari Amman Institute of Technology
      </footer>
    </div>
  );
};
