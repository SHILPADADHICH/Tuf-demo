import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';

import { MainTabs } from '@/navigation/MainTabs';
import { AuthScreen } from '@/screens/auth/AuthScreen';
import { SplashScreen } from '@/screens/splash/SplashScreen';
import { useAppTheme } from '@/theme/ThemeProvider';

export function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthed, setAuthed] = useState(false);
  const { colors, isDark, toggleTheme } = useAppTheme();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const navTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        primary: colors.primary,
        notification: colors.danger,
      },
    }),
    [colors, isDark]
  );

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthed ? (
        <MainTabs onToggleTheme={toggleTheme} />
      ) : (
        <AuthScreen onContinue={() => setAuthed(true)} />
      )}
    </NavigationContainer>
  );
}
