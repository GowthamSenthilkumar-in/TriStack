import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ThemeToggleButtons } from '../common/ThemeToggleButtons';
import { BitLogo } from '../common/BitLogo';
import { CertifyXLogo } from '../common/CertifyXLogo';
import { Bell, LogOut, Check, CheckCheck, Menu, UserCheck, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar, activePath = '', onNavigate }) => {
  const { user, logout } = useAuth();
  const { notifications = [], unreadCount = 0, markAsRead, markAllAsRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const roleColors: Record<string, string> = {
    student: 'bg-blue-100 text-[#1e3a8a] dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    staff: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Sidebar Toggle + Logo Branding */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <BitLogo size="sm" showText={false} />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div className="flex items-center">
            <CertifyXLogo size="sm" showText={true} />
          </div>
        </div>
      </div>

      {/* Right: Theme Options, Role Badge, Notifications, User Profile & Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Theme Controls */}
        <div className="hidden md:block">
          <ThemeToggleButtons layout="compact" />
        </div>

        {/* User Role Badge (Strictly display only! No role switching allowed after login) */}
        {user && (
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
              roleColors[user.role]
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {user.role}
          </div>
        )}

        {/* Notifications Center Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Popover Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-40"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#1e3a8a] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.actionLink && onNavigate) onNavigate(n.actionLink);
                          setNotifOpen(false);
                        }}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40 transition ${
                          !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !n.read ? 'bg-[#1e3a8a] dark:bg-blue-400' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-xs text-slate-900 dark:text-white">{n.title}</h5>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Info & Role Avatar & Logout Button */}
        {user && (
          <div className="flex items-center gap-2.5 sm:gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            {/* User Avatar Logo by First Letter of Name */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold font-serif text-sm shadow-sm border ${
                user.role === 'student'
                  ? 'bg-blue-600 text-white border-blue-400'
                  : user.role === 'staff'
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-purple-600 text-white border-purple-400'
              }`}
              title={`${user.name} (${user.role.toUpperCase()})`}
            >
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {user.email}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition"
              title="Sign out of CertifyX"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
