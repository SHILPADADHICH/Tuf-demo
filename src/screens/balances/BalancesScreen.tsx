import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';

import { AppHeader } from '@/components/common/AppHeader';
import { useAppTheme } from '@/theme/ThemeProvider';

type BalancesScreenProps = { onToggleTheme: () => void };

export function BalancesScreen({ onToggleTheme }: BalancesScreenProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader onToggleTheme={onToggleTheme} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110 }}>
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          Your Balances
        </Text>
        <Text className="mt-1 text-lg" style={{ color: colors.textMuted }}>
          Manage your multi-currency accounts
        </Text>

        <View className="mt-8 items-center justify-center">
          <View className="h-56 w-56 items-center justify-center rounded-full border-[10px] border-cyan-400/80">
            <Text className="text-6xl font-semibold" style={{ color: colors.text }}>
              660
            </Text>
          </View>
          <Text className="mt-4 text-2xl font-semibold" style={{ color: colors.text }}>
            Your Credit Score is average
          </Text>
          <Text className="text-base" style={{ color: colors.textMuted }}>
            Last check on 21 Apr
          </Text>
        </View>

        <Text className="mb-3 mt-8 text-2xl font-semibold" style={{ color: colors.text }}>
          Available Currencies
        </Text>

        <LinearGradient
          colors={isDark ? ['#252930', '#0E1015'] : ['#FFFFFF', '#F3F4F6']}
          className="rounded-3xl border p-4"
          style={{ borderColor: colors.border }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-semibold" style={{ color: colors.text }}>
                CAD
              </Text>
              <Text className="text-base" style={{ color: colors.textMuted }}>
                Canadian Dollar
              </Text>
            </View>

            <View className="rounded-xl px-4 py-2" style={{ backgroundColor: isDark ? '#23252B' : '#E5E7EB' }}>
              <Text className="text-base font-semibold" style={{ color: colors.text }}>
                + Enable
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View className="mt-7">
          <View className="h-36 flex-row items-end justify-between">
            {[90, 35, 65, 95, 88, 42].map((h, index) => (
              <LinearGradient
                key={`${h}-${index}`}
                colors={['#A8F0D7', '#2ED8C3']}
                className="w-10 rounded-t-xl"
                style={{ height: h }}
              />
            ))}
          </View>
          <Text className="mt-4 text-base" style={{ color: colors.textMuted }}>
            Current margin: April spendings
            <Text style={{ color: '#7C3AED' }}>  $350.00 / $640.00</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
