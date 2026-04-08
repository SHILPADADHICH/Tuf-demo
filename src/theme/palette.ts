export type ThemeMode = 'dark' | 'light';

export const palette = {
  dark: {
    background: '#0D0F16',
    surface: '#1A1D27',
    surfaceMuted: '#242835',
    text: '#FFFFFF',
    textMuted: '#94A3B8',
    border: 'rgba(255,255,255,0.08)',
    primary: '#6259FF',
    accentA: '#6366F1',
    accentB: '#A855F7',
    danger: '#FF5C5C',
    success: '#00D1A1',
  },
  light: {
    background: '#F8F9FF',
    surface: '#FFFFFF',
    surfaceMuted: '#F1F5F9',
    text: '#0F172A',
    textMuted: '#64748B',
    border: 'rgba(0,0,0,0.05)',
    primary: '#6259FF',
    accentA: '#6366F1',
    accentB: '#A855F7',
    danger: '#EF4444',
    success: '#10B981',
  },
};

export type ThemeColors = (typeof palette)[ThemeMode];
