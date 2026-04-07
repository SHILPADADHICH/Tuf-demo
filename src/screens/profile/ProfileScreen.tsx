import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppHeader } from '@/components/common/AppHeader';
import { SegmentControl } from '@/components/common/SegmentControl';
import { useAppTheme } from '@/theme/ThemeProvider';

type ProfileScreenProps = { onToggleTheme: () => void };

export function ProfileScreen({ onToggleTheme }: ProfileScreenProps) {
  const { colors, isDark } = useAppTheme();
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader onToggleTheme={onToggleTheme} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110 }}>
          <View className="mb-5 flex-row items-center gap-3">
            <View
              className="h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: isDark ? '#F3F4F6' : '#111827' }}
            >
              <Text style={{ color: isDark ? '#111827' : '#F3F4F6' }} className="font-bold">
                P
              </Text>
            </View>
            <Text className="text-3xl font-semibold" style={{ color: colors.text }}>
              Alex Yu
            </Text>
          </View>

          <SegmentControl
            options={[
              { label: 'Preview', value: 'preview' },
              { label: 'Edit', value: 'edit' },
            ]}
            value={mode}
            onChange={setMode}
          />

          {mode === 'preview' ? (
            <View className="mt-7 gap-5">
              <Text className="text-xl" style={{ color: colors.textMuted }}>
                Total spendings: <Text style={{ color: colors.text, fontWeight: '700' }}>$2,000</Text>
              </Text>
              <Text className="text-xl" style={{ color: colors.textMuted }}>
                Email: <Text style={{ color: colors.text, fontWeight: '700' }}>alex@gmail.com</Text>
              </Text>
              <Text className="text-xl" style={{ color: colors.textMuted }}>
                Balance: <Text style={{ color: colors.text, fontWeight: '700' }}>$20,000</Text>
              </Text>
            </View>
          ) : (
            <View className="mt-5">
              <Input label="Full Name" placeholder="Enter your full name" />
              <Input label="Email" placeholder="Enter your email" />
              <Input label="Password" placeholder="Create a password" />
              <Input label="Confirm Password" placeholder="Confirm your password" />

              <Pressable className="mt-6 rounded-xl py-3.5" style={{ backgroundColor: colors.primary }}>
                <Text className="text-center text-lg font-semibold" style={{ color: isDark ? '#111827' : '#FFFFFF' }}>
                  Update Details
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

type InputProps = { label: string; placeholder: string };

function Input({ label, placeholder }: InputProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="mt-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.text }}>
        {label}
      </Text>
      <View
        className="h-12 rounded-xl border px-3"
        style={{ borderColor: colors.border, backgroundColor: isDark ? '#161A20' : '#F8FAFC' }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={{ color: colors.text, flex: 1, fontSize: 16 }}
        />
      </View>
    </View>
  );
}
