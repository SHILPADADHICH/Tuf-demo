import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { MotiView, MotiText } from 'moti';
import { useAppTheme } from '@/theme/ThemeProvider';
import { palette } from '@/theme/palette';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const { mode } = useAppTheme();
  const animation = useRef<LottieView>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [lottieFinished, setLottieFinished] = useState(false);
  const [textFinished, setTextFinished] = useState(false);

  const backgroundColor = palette[mode].background;
  const textColor = palette[mode].primary;

  useEffect(() => {
    // Small delay on mount to ensure initial frame is ready
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    // Only signal finish when both Lottie (3s) and full text sequence have concluded
    if (lottieFinished && textFinished) {
      onFinish();
    }
  }, [lottieFinished, textFinished, onFinish]);

  useEffect(() => {
    // Branding entrance sequence takes exactly 2.5 seconds
    const timer = setTimeout(() => {
      setTextFinished(true);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return <View style={[styles.container, { backgroundColor }]} />;

  const brand = "PayU";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <LottieView
          ref={animation}
          autoPlay
          loop={false}
          source={require('../../../assets/splash/moneyspash.json')}
          style={styles.lottie}
          onAnimationFinish={() => {
            setLottieFinished(true);
          }}
        />
        <View style={styles.textContainer}>
          <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: 15 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              duration: 2000, // Very slow and premium entrance
              delay: 100,
            }}
            style={styles.brandContainer}
          >
            <Text style={[styles.brandText, { color: textColor }]}>{brand}</Text>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              duration: 1500,
              delay: 800, // Appears shortly after name starts
            }}
          >
            <Text style={[styles.tagline, { color: palette[mode].textMuted }]}>
              Send money globally with the real exchange rate
            </Text>
          </MotiView>

          <MotiView 
            from={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ 
              type: 'timing', 
              duration: 1200, 
              delay: 1400 
            }}
            style={[styles.indicator, { backgroundColor: palette[mode].accentB }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: width * 0.65,
    height: width * 0.65,
  },
  textContainer: {
    marginTop: -10,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  brandContainer: {
    flexDirection: 'row',
  },
  brandText: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    opacity: 0.9,
  },
  indicator: {
    height: 3,
    width: 60,
    borderRadius: 2,
    marginTop: 20,
  },
});
