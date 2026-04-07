export type ThemeMode = 'dark' | 'light';

export const palette = {
  dark: {
    background: '#040404',
    surface: '#121212',
    surfaceMuted: '#1E1E1E',
    text: '#FFFFFF',
    textMuted: '#999999',
    border: 'rgba(255,255,255,0.1)',
    primary: '#FFFFFF',
    accentA: '#FFFFFF',
    accentB: '#FFFFFF',
    danger: '#FF3B3B',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceMuted: '#E0E0E0',
    text: '#000000',
    textMuted: '#666666',
    border: 'rgba(0,0,0,0.1)',
    primary: '#000000',
    accentA: '#000000',
    accentB: '#000000',
    danger: '#DC2626',
  },
};

export type ThemeColors = (typeof palette)[ThemeMode];
