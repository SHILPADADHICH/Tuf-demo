export type ThemeMode = 'dark' | 'light';

export const palette = {
  dark: {
    background: '#050608',
    surface: '#111215',
    surfaceMuted: '#1D2025',
    text: '#F3F4F6',
    textMuted: '#9CA3AF',
    border: 'rgba(255,255,255,0.08)',
    primary: '#FFFFFF',
    accentA: '#A8F0D7',
    accentB: '#2ED8C3',
    danger: '#EF4444',
  },
  light: {
    background: '#F3F4F6',
    surface: '#FFFFFF',
    surfaceMuted: '#E5E7EB',
    text: '#111827',
    textMuted: '#6B7280',
    border: 'rgba(17,24,39,0.1)',
    primary: '#111827',
    accentA: '#7CECC8',
    accentB: '#14B8A6',
    danger: '#DC2626',
  },
};

export type ThemeColors = (typeof palette)[ThemeMode];
