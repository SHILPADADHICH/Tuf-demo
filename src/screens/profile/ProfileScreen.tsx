import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { GradientOrbs } from '@/components/common/GradientOrbs';
import { useAppTheme } from '@/theme/ThemeProvider';

type ProfileScreenProps = { onToggleTheme: () => void };

export function ProfileScreen({ onToggleTheme }: ProfileScreenProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <GradientOrbs />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 110 }}>
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>Profile</Text>
          <Ionicons name="moon-outline" size={21} color={colors.text} onPress={onToggleTheme} />
        </View>

        <LinearGradient colors={['#9333EA', '#3B82F6']} className="mb-6 rounded-3xl p-5">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/20">
              <Ionicons name="person" size={30} color="#fff" />
            </View>
            <View>
              <Text className="text-xl font-bold text-white">Jordan Riley</Text>
              <Text className="text-sm text-white/80">jordan.riley@gmail.com</Text>
              <Text className="mt-1 text-xs text-white/60">Member since Mar 2024</Text>
            </View>
          </View>
        </LinearGradient>

        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing' }} className="rounded-3xl border p-3" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
          <Row icon="moon" label="Dark Mode" right={<Switch value={isDark} onValueChange={onToggleTheme} trackColor={{ true: '#9333EA', false: '#64748B' }} />} colors={colors} />
          <Row icon="notifications" label="Notifications" right={<Ionicons name="chevron-forward" size={16} color={colors.textMuted} />} colors={colors} />
          <Row icon="lock-closed" label="Security" right={<Ionicons name="chevron-forward" size={16} color={colors.textMuted} />} colors={colors} />
          <Row icon="help-circle" label="Help & Support" right={<Ionicons name="chevron-forward" size={16} color={colors.textMuted} />} colors={colors} />
          <Pressable className="mt-2 rounded-2xl border border-red-500/30 px-4 py-3">
            <Text className="font-semibold text-red-400">Logout</Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </View>
  );
}

function Row({ icon, label, right, colors }: { icon: string; label: string; right: ReactNode; colors: any }) {
  return (
    <View className="flex-row items-center justify-between border-b px-2 py-3" style={{ borderBottomColor: colors.border }}>
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${colors.primary}22` }}>
          <Ionicons name={`${icon}-outline` as never} size={18} color={colors.primary} />
        </View>
        <Text className="font-medium" style={{ color: colors.text }}>{label}</Text>
      </View>
      {right}
    </View>
  );
}
