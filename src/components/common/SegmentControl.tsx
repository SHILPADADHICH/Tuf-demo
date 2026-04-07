import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type Option<T extends string> = { label: string; value: T };

type SegmentControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentControl<T extends string>({ options, value, onChange }: SegmentControlProps<T>) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="flex-row rounded-2xl p-1" style={{ backgroundColor: isDark ? '#23252B' : '#D1D5DB' }}>
      {options.map((item) => {
        const active = item.value === value;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            className="flex-1 items-center rounded-xl py-2.5"
            style={{ backgroundColor: active ? colors.primary : 'transparent' }}
          >
            <Text
              style={{ color: active ? (isDark ? '#111827' : '#FFFFFF') : colors.textMuted }}
              className="text-base font-semibold"
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
