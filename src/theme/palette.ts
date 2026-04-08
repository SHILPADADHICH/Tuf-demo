export type ThemeMode = 'dark' | 'light';

export const palette = {
  dark: {
    background: '#0A0B14',
    surface: '#13141F',
    surfaceMuted: '#1E2230',
    text: '#FFFFFF',
    textMuted: '#8B8D98',
    border: 'rgba(255,255,255,0.10)',
    primary: '#9333EA',
    accentA: '#9333EA',
    accentB: '#3B82F6',
    danger: '#FF6B6B',
    success: '#6BCF7F',
  },
  light: {
    background: '#F8F9FD',
    surface: '#FFFFFF',
    surfaceMuted: '#F3F3F5',
    text: '#0F172A',
    textMuted: '#717182',
    border: 'rgba(0,0,0,0.10)',
    primary: '#9333EA',
    accentA: '#9333EA',
    accentB: '#3B82F6',
    danger: '#FF6B6B',
    success: '#6BCF7F',
  },
};

export type ThemeColors = (typeof palette)[ThemeMode];
