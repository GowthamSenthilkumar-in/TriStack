import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

interface ThemeToggleButtonsProps {
  layout?: 'compact' | 'full';
}

export const ThemeToggleButtons: React.FC<ThemeToggleButtonsProps> = ({ layout = 'compact' }) => {
  const { theme, setTheme } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'system', label: 'System', icon: <Laptop className="w-4 h-4" /> },
    { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> }
  ];

  if (layout === 'compact') {
    return (
      <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        {options.map((opt) => {
          const isActive = theme === opt.mode;
          return (
            <button
              key={opt.mode}
              onClick={() => setTheme(opt.mode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-[#1e3a8a] dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={`Switch to ${opt.label} theme`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map((opt) => {
        const isActive = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            onClick={() => setTheme(opt.mode)}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
              isActive
                ? 'border-[#1e3a8a] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-[#1e3a8a] dark:text-blue-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  isActive
                    ? 'bg-[#1e3a8a] text-white dark:bg-blue-500 dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {opt.icon}
              </div>
              <div>
                <div className="font-semibold text-sm">{opt.label} Mode</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {opt.mode === 'system'
                    ? 'Adapts to OS preference'
                    : opt.mode === 'light'
                    ? 'High-contrast bright UI'
                    : 'Comfortable dark theme'}
                </div>
              </div>
            </div>
            {isActive && <Check className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};
