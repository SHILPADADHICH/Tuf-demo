import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type AppHeaderProps = {
  name?: string;
  onToggleTheme: () => void;
};

export function AppHeader({ name = 'PayU', onToggleTheme }: AppHeaderProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      className="flex-row items-center justify-between border-b px-5 py-4"
      style={{ borderBottomColor: colors.border }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: isDark ? '#F3F4F6' : '#111827' }}
        >
          <Text style={{ color: isDark ? '#111827' : '#F3F4F6' }} className="text-base font-bold">
            P
          </Text>
        </View>
        <Text className="text-2xl font-semibold" style={{ color: colors.text }}>
          {name}
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        <Pressable onPress={onToggleTheme}>
          <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={colors.text} />
        </Pressable>
        <Ionicons name="search-outline" size={20} color={colors.text} />
        <View>
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
          <View className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full bg-red-500">
            <Text className="text-xs font-semibold text-white">2</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
