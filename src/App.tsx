import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { CertificateProvider, useCertificates } from './context/CertificateContext';
import { ToastContainer } from './components/common/ToastContainer';
import { TopNavbar } from './components/layout/TopNavbar';
import { Sidebar } from './components/layout/Sidebar';
import { CertificateDetailModal } from './components/certificate/CertificateDetailModal';
import { PublicVerifyView } from './components/certificate/PublicVerifyView';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentUploadCertificate } from './pages/student/StudentUploadCertificate';
import { StudentRequestCertificate } from './pages/student/StudentRequestCertificate';
import { StudentDigiLockerVault } from './pages/student/StudentDigiLockerVault';
import { StudentVerificationStatus } from './pages/student/StudentVerificationStatus';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentSettings } from './pages/student/StudentSettings';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffPendingRequestsQueue } from './pages/staff/StaffPendingRequestsQueue';
import { StaffCertificateGenerator } from './pages/staff/StaffCertificateGenerator';
import { StaffIssuedCertificatesLedger } from './pages/staff/StaffIssuedCertificatesLedger';
import { StaffAnalyticsReports } from './pages/staff/StaffAnalyticsReports';
import { StaffNotifications } from './pages/staff/StaffNotifications';
import { StaffProfile } from './pages/staff/StaffProfile';
import { StaffSettings } from './pages/staff/StaffSettings';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUserManagement } from './pages/admin/AdminUserManagement';
import { AdminStaffRoster } from './pages/admin/AdminStaffRoster';
import { AdminTemplateBuilder } from './pages/admin/AdminTemplateBuilder';
import { AdminSystemAuditLogs } from './pages/admin/AdminSystemAuditLogs';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { getCertificateById, deleteCertificate } = useCertificates();

  const [activePath, setActivePath] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewingCertId, setViewingCertId] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [publicVerifyId, setPublicVerifyId] = useState<string | null>(null);

  // Parse window URL for direct public verification or direct paths
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/verify')) {
      const parts = path.split('/verify/');
      if (parts[1]) {
        setPublicVerifyId(decodeURIComponent(parts[1]));
      } else {
        setPublicVerifyId('');
      }
    }
  }, []);

  // Set default route depending on role when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (publicVerifyId !== null) return; // Keep public verification if accessed directly

      if (user.role === 'student' && (!activePath || !activePath.startsWith('/student'))) {
        setActivePath('/student/dashboard');
      } else if (user.role === 'staff' && (!activePath || !activePath.startsWith('/staff'))) {
        setActivePath('/staff/dashboard');
      } else if (user.role === 'admin' && (!activePath || !activePath.startsWith('/admin'))) {
        setActivePath('/admin/dashboard');
      }
    }
  }, [isAuthenticated, user?.role]);

  const handleNavigate = (path: string) => {
    if (path.startsWith('/verify')) {
      const parts = path.split('/verify/');
      setPublicVerifyId(parts[1] ? decodeURIComponent(parts[1]) : '');
    } else {
      setPublicVerifyId(null);
      setActivePath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Public Verify Page if requested
  if (publicVerifyId !== null) {
    return (
      <PublicVerifyView
        initialCertId={publicVerifyId}
        onBackToApp={() => setPublicVerifyId(null)}
      />
    );
  }

  // Render Auth Pages if not logged in
  if (!isAuthenticated) {
    if (showForgotPassword) {
      return <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />;
    }
    return (
      <LoginPage
        onNavigateToVerify={(certNo) => setPublicVerifyId(certNo || '')}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  const viewingCert = viewingCertId ? getCertificateById(viewingCertId) || null : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <TopNavbar
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        activePath={activePath}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex">
        <Sidebar
          activePath={activePath}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-hidden">
          {/* Student Routes */}
          {user?.role === 'student' && (
            <>
              {(activePath === '/student/dashboard' || activePath === '') && (
                <StudentDashboard onNavigate={handleNavigate} onViewCert={(id) => setViewingCertId(id)} />
              )}
              {activePath === '/student/upload' && (
                <StudentUploadCertificate onNavigateToVault={() => handleNavigate('/student/vault')} />
              )}
            {activePath === '/student/request' && (
  <StudentRequestCertificate onNavigateToVault={() => handleNavigate('/student/vault')} />
)}
             {activePath === '/student/vault' && (
                <StudentDigiLockerVault
                  onViewCertDetails={(id) => setViewingCertId(id)}
                  onNavigateToUpload={() => handleNavigate('/student/upload')}
                />
              )}
              {activePath === '/student/status' && (
                <StudentVerificationStatus onViewCert={(id) => setViewingCertId(id)} />
              )}
              
              {activePath === '/student/notifications' && <StudentNotifications />}
              {activePath === '/student/profile' && <StudentProfile />}
              {activePath === '/student/settings' && <StudentSettings />}
            </>
          )}

          {/* Staff Routes */}
          {user?.role === 'staff' && (
            <>
              {(activePath === '/staff/dashboard' || activePath === '') && (
                <StaffDashboard onNavigate={handleNavigate} onViewCert={(id) => setViewingCertId(id)} />
              )}
              {activePath === '/staff/pending-requests' && (
                <StaffPendingRequestsQueue onViewCert={(id) => setViewingCertId(id)} />
              )}
              {activePath === '/staff/generate' && (
                <StaffCertificateGenerator onNavigateToLedger={() => handleNavigate('/staff/issued-certificates')} />
              )}
              {activePath === '/staff/issued-certificates' && (
                <StaffIssuedCertificatesLedger onViewCert={(id) => setViewingCertId(id)} />
              )}
              {activePath === '/staff/reports' && <StaffAnalyticsReports />}
              {activePath === '/staff/notifications' && <StaffNotifications />}
              {activePath === '/staff/profile' && <StaffProfile />}
              {activePath === '/staff/settings' && <StaffSettings />}
            </>
          )}

          {/* Admin Routes */}
          {user?.role === 'admin' && (
            <>
              {(activePath === '/admin/dashboard' || activePath === '') && (
                <AdminDashboard onNavigate={handleNavigate} />
              )}
              {activePath === '/admin/users' && <AdminUserManagement />}
              {activePath === '/admin/staff' && <AdminStaffRoster />}
              {activePath === '/admin/templates' && <AdminTemplateBuilder />}
              {activePath === '/admin/activity-logs' && <AdminSystemAuditLogs />}
              {activePath === '/admin/notifications' && <StaffNotifications />}
              {activePath === '/admin/settings' && <StaffSettings />}
            </>
          )}
        </main>
      </div>

      {/* Global Certificate Detail Modal */}
      <CertificateDetailModal
        certificate={viewingCert}
        isOpen={!!viewingCertId}
        onClose={() => setViewingCertId(null)}
        onDelete={(id) => {
          deleteCertificate(id);
          setViewingCertId(null);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CertificateProvider>
            <AppContent />
            <ToastContainer />
          </CertificateProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
