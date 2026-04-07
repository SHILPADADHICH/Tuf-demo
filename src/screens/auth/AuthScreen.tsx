import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SegmentControl } from '@/components/common/SegmentControl';
import { useAppTheme } from '@/theme/ThemeProvider';

type AuthScreenProps = { onContinue: () => void };
type Mode = 'signin' | 'signup';
type Field = 'fullName' | 'email' | 'password' | 'confirmPassword';
type Errors = Partial<Record<Field, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthScreen({ onContinue }: AuthScreenProps) {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const [mode, setMode] = useState<Mode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const title = mode === 'signin' ? 'Sign In' : 'Create Account';

  const canSubmit = useMemo(() => {
    if (mode === 'signin') {
      return email.trim().length > 0 && password.trim().length > 0;
    }

    return (
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      confirmPassword.trim().length > 0
    );
  }, [confirmPassword, email, fullName, mode, password]);

  const validate = () => {
    const next: Errors = {};

    if (mode === 'signup' && fullName.trim().length < 2) {
      next.fullName = 'Full name should be at least 2 characters';
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'Enter a valid email address';
    }

    if (password.length < 6) {
      next.password = 'Password should be at least 6 characters';
    }

    if (mode === 'signup' && password !== confirmPassword) {
      next.confirmPassword = 'Passwords do not match';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    onContinue();
  };

  const onSwitchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 24 }}>
        <View className="mb-7 items-center">
          <Pressable className="absolute right-2 top-1" onPress={toggleTheme}>
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={colors.text} />
          </Pressable>

          <View
            className="mb-4 h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: isDark ? '#F3F4F6' : '#111827' }}
          >
            <Text className="text-xl font-bold" style={{ color: isDark ? '#111827' : '#F3F4F6' }}>
              P
            </Text>
          </View>
          <Text className="text-4xl font-bold" style={{ color: colors.text }}>
            Welcome to PayU
          </Text>
          <Text className="mt-2 text-center text-base" style={{ color: colors.textMuted }}>
            Send money globally with the real exchange rate
          </Text>
        </View>

        <LinearGradient
          colors={isDark ? ['#15181D', '#0E1116'] : ['#FFFFFF', '#F6F7FA']}
          className="rounded-3xl border p-5"
          style={{ borderColor: colors.border }}
        >
          <Text className="text-3xl font-semibold" style={{ color: colors.text }}>
            Get started
          </Text>
          <Text className="mb-4 mt-1 text-base" style={{ color: colors.textMuted }}>
            Sign in to your account or create a new one
          </Text>

          <SegmentControl
            options={[
              { label: 'Sign In', value: 'signin' },
              { label: 'Sign Up', value: 'signup' },
            ]}
            value={mode}
            onChange={(value) => onSwitchMode(value as Mode)}
          />

          {mode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              error={errors.fullName}
            />
          )}

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
            secure
            showSecureText={showPassword}
            onToggleSecure={() => setShowPassword((prev) => !prev)}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
          />

          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secure
              showSecureText={showConfirmPassword}
              onToggleSecure={() => setShowConfirmPassword((prev) => !prev)}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
            />
          )}

          {mode === 'signin' && (
            <Text className="mb-4 mt-3 text-right text-sm" style={{ color: colors.text }}>
              Forgot password?
            </Text>
          )}

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            className="rounded-xl py-3.5 active:opacity-90"
            style={{ backgroundColor: canSubmit ? colors.primary : isDark ? '#334155' : '#CBD5E1' }}
          >
            <Text className="text-center text-lg font-semibold" style={{ color: isDark ? '#111827' : '#FFFFFF' }}>
              {title}
            </Text>
          </Pressable>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type InputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secure?: boolean;
  showSecureText?: boolean;
  onToggleSecure?: () => void;
};

function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secure = false,
  showSecureText = false,
  onToggleSecure,
}: InputProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="mt-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.text }}>
        {label}
      </Text>
      <View
        className="h-12 flex-row items-center rounded-xl border px-3"
        style={{ borderColor: error ? '#EF4444' : colors.border, backgroundColor: isDark ? '#161A20' : '#F8FAFC' }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secure && !showSecureText}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          style={{ color: colors.text, flex: 1, fontSize: 16 }}
        />
        {secure ? (
          <Pressable onPress={onToggleSecure} hitSlop={8}>
            <Ionicons name={showSecureText ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1 text-xs" style={{ color: '#EF4444' }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
