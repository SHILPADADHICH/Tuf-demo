import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

export function SplashScreen() {
  const { colors } = useAppTheme();

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
      <View className="h-64 w-64 items-center justify-center">
        <LottieView
          source={require('../../../assets/splash/moneyspash.json')}
          autoPlay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <Text className="mt-6 text-3xl font-bold" style={{ color: colors.text }}>
        PayU
      </Text>
      <Text className="mt-2 text-sm" style={{ color: colors.textMuted }}>
        Smart finance manager
      </Text>
    </View>
  );
}
