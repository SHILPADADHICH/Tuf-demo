import { LinearGradient } from 'expo-linear-gradient';
import { View, type ViewProps } from 'react-native';

export function GlassCard(props: ViewProps) {
  return (
    <LinearGradient
      colors={['rgba(124,58,237,0.35)', 'rgba(6,182,212,0.18)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl p-[1px]"
    >
      <View
        {...props}
        className={`rounded-3xl bg-brand-card/90 p-5 ${props.className ?? ''}`}
      />
    </LinearGradient>
  );
}
