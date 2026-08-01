import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UploadCloud,
  FilePlus,
  Vault,
  ShieldCheck,
  Bell,
  User,
  Settings,
  ClipboardList,
  Sparkles,
  Award,
  BarChart3,
  Users,
  FileText,
  Activity,
  Layers
} from 'lucide-react';

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
  collapsed?: boolean;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePath, onNavigate, collapsed = false }) => {
  const { role } = useAuth();

  const studentNav: NavItem[] = [
    { label: 'Student Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Upload Certificate', path: '/student/upload', icon: <UploadCloud className="w-4 h-4" /> },
    { label: 'Request Certificate', path: '/student/request', icon: <FilePlus className="w-4 h-4" /> },
    { label: 'DigiLocker Vault', path: '/student/vault', icon: <Vault className="w-4 h-4" /> },
    { label: 'Verification Status', path: '/student/status', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Notifications', path: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Student Profile', path: '/student/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', path: '/student/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const staffNav: NavItem[] = [
    { label: 'Staff Dashboard', path: '/staff/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Pending Requests Queue', path: '/staff/pending-requests', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Certificate Generation', path: '/staff/generate', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Issued Certificates Ledger', path: '/staff/issued-certificates', icon: <Award className="w-4 h-4" /> },
    { label: 'Notifications', path: '/staff/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Analytics Reports', path: '/staff/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Staff Profile', path: '/staff/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', path: '/staff/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const adminNav: NavItem[] = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'User Management', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Staff Roster', path: '/admin/staff', icon: <Users className="w-4 h-4" /> },
    { label: 'Template Builder', path: '/admin/templates', icon: <Layers className="w-4 h-4" /> },
    { label: 'System Audit Logs', path: '/admin/activity-logs', icon: <Activity className="w-4 h-4" /> },
    { label: 'System Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'System Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const items = role === 'student' ? studentNav : role === 'staff' ? staffNav : adminNav;

  return (
    <aside
      className={`fixed lg:sticky top-16 z-20 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between p-3 overflow-y-auto ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {role?.toUpperCase()} MENU
          </div>
        )}

        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/10 dark:bg-blue-600 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={item.label}
              >
                <div className="shrink-0">{item.icon}</div>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {!collapsed && (
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-bold text-[#1e3a8a] dark:text-blue-300">Bannari Amman Institute</div>
          <div>Official Academic Vault v2.6</div>
        </div>
      )}
    </aside>
  );
};
