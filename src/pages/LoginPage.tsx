import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { BitLogo } from '../components/common/BitLogo';
import { ThemeToggleButtons } from '../components/common/ThemeToggleButtons';
import { Role } from '../types';
import { Lock, Mail, ArrowRight, ShieldCheck, User, Key, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onForgotPasswordClick?: () => void;
  onVerifyPortalClick?: () => void;
  onForgotPassword?: () => void;
  onNavigateToVerify?: (certNo?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onForgotPasswordClick,
  onVerifyPortalClick,
  onForgotPassword,
  onNavigateToVerify
}) => {
  const handleForgotPassword = () => {
    if (onForgotPassword) onForgotPassword();
    else if (onForgotPasswordClick) onForgotPasswordClick();
  };

  const handleVerifyPortal = (certNo?: string) => {
    if (onNavigateToVerify) onNavigateToVerify(certNo);
    else if (onVerifyPortalClick) onVerifyPortalClick();
  };
  const { login, register, loginWithGoogle } = useAuth();
  const { addToast } = useNotifications();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [registerNumber, setRegisterNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Google Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleRole, setGoogleRole] = useState<Role>('student');
  const [googleDept, setGoogleDept] = useState('Computer Science and Engineering');
  const [googleReg, setGoogleReg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup') {
      if (!email || !name || !password) {
        setErrorMsg('Please enter name, email, and password.');
        return;
      }
      setLoading(true);
      setErrorMsg('');
      const res = await register({
        email,
        password,
        name,
        role,
        department,
        registerNumber: role === 'student' ? registerNumber : undefined
      });
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed.');
      } else {
        addToast('Account Created!', `Welcome to CertifyX Portal, ${name}!`, 'success');
      }
      return;
    }

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Invalid credentials');
    } else {
      addToast('Welcome Back!', 'Successfully authenticated to CertifyX Portal.', 'success');
    }
  };

  const handleQuickCredential = (userEmail: string, userPass: string) => {
    setAuthMode('login');
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMsg('');
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginWithGoogle({
      email: googleEmail,
      name: googleName,
      role: googleRole,
      department: googleDept,
      registerNumber: googleRole === 'student' ? googleReg : undefined
    });
    setLoading(false);
    setShowGoogleModal(false);

    if (res.success) {
      addToast('Google Sign-in Successful', `Welcome ${googleName} (${googleRole.toUpperCase()})`, 'success');
    } else {
      addToast('Google Sign-in Error', res.error || 'Failed to authenticate', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <BitLogo size="sm" showText={false} />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-[#1e3a8a] dark:text-blue-400 text-lg">CertifyX</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Digital Certificate Vault
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onVerifyPortalClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1e3a8a] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 transition border border-blue-200 dark:border-blue-800"
          >
            <ShieldCheck className="w-4 h-4" /> Public Verification Portal
          </button>
          <ThemeToggleButtons layout="compact" />
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8 z-10 items-center">
        {/* Left Column: Institutional Info */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Official Institutional Portal
          </div>

          <BitLogo size="lg" showText={true} className="mx-auto lg:mx-0" />

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0 font-sans">
            Securely issue, store, verify, and share academic digital certificates. Powered by OCR automated originality verification and DigiLocker-style ledger architecture.
          </p>

          {/* Quick Demo Credentials Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 max-w-md mx-auto lg:mx-0">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Default Test Credentials</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">Click to Autofill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickCredential('student@gmail.com', '12345')}
                className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 transition text-left space-y-0.5"
              >
                <div className="text-xs font-bold text-[#1e3a8a] dark:text-blue-300">Student</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">12345</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickCredential('staff@gmail.com', '12345')}
                className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 transition text-left space-y-0.5"
              >
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Staff</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">12345</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickCredential('admin@gmail.com', '12345')}
                className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100 transition text-left space-y-0.5"
              >
                <div className="text-xs font-bold text-purple-800 dark:text-purple-300">Admin</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">12345</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Login Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            
            {/* Mode Switcher: Sign In vs Sign Up */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-[#1e3a8a] dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-[#1e3a8a] dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign Up (Create Account)
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {authMode === 'login' ? 'Sign In to CertifyX' : 'Create New Account'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {authMode === 'login'
                  ? 'Access your student vault, staff review queue, or administrative tools.'
                  : 'Enter your profile details. Your dashboard will display your filled name.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="eg: Gowtham S"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Account Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff / Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {role === 'student' ? 'Register Number' : 'Staff ID'}
                      </label>
                      <input
                        type="text"
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        placeholder={role === 'student' ? 'eg: 7376251CS194' : 'STF-402'}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Computer Science and Engineering"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authMode === 'login' ? 'student@gmail.com' : 'user@domain.com'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-[#1e3a8a] dark:text-blue-400 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-blue-900 active:bg-blue-950 shadow-lg shadow-blue-900/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : authMode === 'login' ? 'Sign In to Portal' : 'Create Account & Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or Continue With
              </span>
            </div>

            {/* Google Signup / Signin Option */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.26v3.15C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.2.01 10.05.01 12c0 1.95.45 3.8 1.25 5.39l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Sign in with Google Account</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Google Signup Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#1e3a8a] dark:text-blue-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Google Sign-In Account Setup</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your institutional role for Google OAuth integration.
                </p>
              </div>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Google Email</label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoogleRole('student')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      googleRole === 'student'
                        ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] dark:bg-blue-950/40 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoogleRole('staff')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      googleRole === 'staff'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Staff / Faculty
                  </button>
                </div>
              </div>

              {googleRole === 'student' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Register Number</label>
                  <input
                    type="text"
                    value={googleReg}
                    onChange={(e) => setGoogleReg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white"
                    placeholder="eg: 7376251CS194"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1e3a8a] hover:bg-blue-900 shadow-md"
                >
                  Confirm & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center text-xs text-slate-400 dark:text-slate-500 py-4 z-10 border-t border-slate-200/60 dark:border-slate-800/60">
        © 2026 Bannari Amman Institute of Technology • CertifyX Digital Ledger Portal
      </footer>
    </div>
  );
};
