import { Text, View } from 'react-native';

export function SummaryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-brand-bg">
      <Text className="text-lg font-semibold text-white">Monthly Summary</Text>
      <Text className="mt-2 text-slate-400">Charts and analytics go here</Text>
    </View>
  );
}
