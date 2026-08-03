'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'movteens-admin-theme';

export type AdminTheme = 'light' | 'dark';

type AdminThemeContextValue = {
  theme: AdminTheme;
  isDark: boolean;
  toggleTheme: () => void;
};

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return ctx;
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <AdminThemeContext.Provider
      value={{ theme, isDark: theme === 'dark', toggleTheme }}
    >
      <div
        className={cn(
          'min-h-screen bg-background text-foreground',
          (!mounted || theme === 'dark') && 'dark',
        )}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}
