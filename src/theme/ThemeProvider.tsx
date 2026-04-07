import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { palette, type ThemeColors, type ThemeMode } from './palette';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  const value = useMemo(
    () => ({
      mode,
      colors: palette[mode],
      isDark: mode === 'dark',
      toggleTheme: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used inside AppThemeProvider');
  return ctx;
}
