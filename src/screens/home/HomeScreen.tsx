import { Text, View } from 'react-native';
import { MotiView } from 'moti';

import { GlassCard } from '@/components/ui/GlassCard';

export function HomeScreen() {
  return (
    <View className="flex-1 bg-brand-bg px-5 pt-16">
      <Text className="text-3xl font-bold text-white">Finance Manager</Text>
      <Text className="mt-2 text-base text-slate-400">Modular starter setup is ready.</Text>

      <MotiView
        from={{ opacity: 0, translateY: 18 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 420 }}
        className="mt-7"
      >
        <GlassCard>
          <Text className="text-slate-400">Current Balance</Text>
          <Text className="mt-1 text-3xl font-semibold text-white">$ 0.00</Text>
          <Text className="mt-3 text-sm text-cyan-300">WebGL-style effects can be added next.</Text>
        </GlassCard>
      </MotiView>
    </View>
  );
}
