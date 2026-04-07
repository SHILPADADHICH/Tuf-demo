import '../../global.css';

import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { MotiView, AnimatePresence } from 'moti';

import { RootNavigator } from '@/navigation/RootNavigator';
import { FinanceProvider } from '@/store/finance/FinanceProvider';
import { AppThemeProvider, useAppTheme } from '@/theme/ThemeProvider';
import { AnimatedSplashScreen } from '@/components/common/AnimatedSplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might cause some errors */
});

function AppContent() {
  const { isDark, mode } = useAppTheme();
  const [splashFinished, setSplashFinished] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simulate loading data, fonts, etc.
    async function prepare() {
      try {
        // Pre-load anything here if needed
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      // This tells the splash screen to hide immediately!
      // But we will overlay our AnimatedSplashScreen on top.
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
      
      <AnimatePresence>
        {!splashFinished && (
          <MotiView
            from={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'timing',
              duration: 600,
            }}
            style={StyleSheet.absoluteFill}
          >
            <AnimatedSplashScreen onFinish={() => setSplashFinished(true)} />
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <FinanceProvider>
            <AppContent />
          </FinanceProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
