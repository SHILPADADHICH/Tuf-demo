export type ThemeMode = "dark" | "light";

export const palette = {
  dark: {
    background: "#000000",
    surface: "#0F172A",
    surfaceMuted: "#1E293B",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "rgba(255,255,255,0.08)",
    primary: "#818CF8", // Indigo 400
    secondary: "#A78BFA", // Violet 400
    accentA: "#818CF8",
    accentB: "#A78BFA",
    danger: "#F43F5E",
    success: "#34D399",
  },
  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceMuted: "#F1F5F9",
    text: "#0F172A",
    textMuted: "#64748B",
    border: "rgba(15,23,42,0.08)",
    primary: "#4F46E5", // Indigo 600
    secondary: "#7C3AED", // Violet 600
    accentA: "#4F46E5",
    accentB: "#7C3AED",
    danger: "#E11D48",
    success: "#059669",
  },
};

export type ThemeColors = typeof palette.dark;
