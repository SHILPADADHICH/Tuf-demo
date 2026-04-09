import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatePresence, MotiView } from "moti";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { SegmentControl } from "@/components/common/SegmentControl";
import { useAuth } from "@/store/auth/AuthProvider";
import { useAppTheme } from "@/theme/ThemeProvider";

type AuthScreenProps = { onContinue?: () => void };
type Mode = "signin" | "signup";
type Field = "fullName" | "email" | "password" | "confirmPassword";
type Errors = Partial<Record<Field, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthScreen({ onContinue }: AuthScreenProps) {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = mode === "signin" ? "Sign In" : "Create Account";

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;

    if (mode === "signin") {
      return email.trim().length > 0 && password.trim().length > 0;
    }

    return (
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      confirmPassword.trim().length > 0
    );
  }, [confirmPassword, email, fullName, mode, password, isSubmitting]);

  const validate = () => {
    const next: Errors = {};

    if (mode === "signup" && fullName.trim().length < 2) {
      next.fullName = "Full name should be at least 2 characters";
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (password.length < 6) {
      next.password = "Password should be at least 6 characters";
    }

    if (mode === "signup" && password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(email.trim().toLowerCase(), password);
      } else {
        await signUp({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        });
      }
      onContinue?.();
    } catch (error: any) {
      setErrors({
        email: mode === "signin" ? "Invalid email or password" : error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSwitchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800 }}
          className="mb-8 items-center"
        >
          <Pressable
            className="absolute right-0 top-0 h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            }}
            onPress={toggleTheme}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={20}
              color={colors.text}
            />
          </Pressable>

          <Text
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: colors.text }}
          >
            Welcome to PayU
          </Text>
          <Text
            className="mt-2 text-center text-base"
            style={{ color: colors.textMuted, maxWidth: "80%" }}
          >
            Save money and track your expenses
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.95, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800, delay: 200 }}
        >
          <LinearGradient
            colors={isDark ? ["#1A1D23", "#111418"] : ["#FFFFFF", "#F9FAFB"]}
            className="overflow-hidden rounded-[32px] border p-6"
            style={{
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isDark ? 0.3 : 0.05,
              shadowRadius: 20,
              elevation: 5,
            }}
          >
            <View className="mb-6">
              <Text
                className="text-2xl font-bold"
                style={{ color: colors.text }}
              >
                {mode === "signin" ? "Sign In" : "Register"}
              </Text>
              <Text
                className="mt-1 text-sm"
                style={{ color: colors.textMuted }}
              >
                {mode === "signin"
                  ? "Welcome back! Please enter your details"
                  : "Join the global financial network"}
              </Text>
            </View>

            <SegmentControl
              options={[
                { label: "Sign In", value: "signin" },
                { label: "Sign Up", value: "signup" },
              ]}
              value={mode}
              onChange={(value) => onSwitchMode(value as Mode)}
            />

            <View className="mt-4">
              <AnimatePresence>
                {mode === "signup" && (
                  <MotiView
                    key="name"
                    from={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 80, marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ type: "timing", duration: 300 }}
                  >
                    <Input
                      label="Full Name"
                      icon="person-outline"
                      placeholder="Enter your name"
                      value={fullName}
                      onChangeText={(text) => {
                        setFullName(text);
                        if (errors.fullName)
                          setErrors((prev) => ({
                            ...prev,
                            fullName: undefined,
                          }));
                      }}
                      error={errors.fullName}
                    />
                  </MotiView>
                )}
              </AnimatePresence>

              <Input
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
              />

              <Input
                label="Password"
                icon="lock-closed-outline"
                placeholder="Enter your password"
                secure
                showSecureText={showPassword}
                onToggleSecure={() => setShowPassword((prev) => !prev)}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
              />

              {mode === "signup" && (
                <Input
                  label="Confirm Password"
                  icon="shield-checkmark-outline"
                  placeholder="Confirm your password"
                  secure
                  showSecureText={showConfirmPassword}
                  onToggleSecure={() => setShowConfirmPassword((prev) => !prev)}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                  }}
                  error={errors.confirmPassword}
                />
              )}

              {mode === "signin" && (
                <Pressable className="mb-6 mt-2 self-end">
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colors.accentB }}
                  >
                    Forgot password?
                  </Text>
                </Pressable>
              )}

              <MotiView
                animate={{ scale: canSubmit ? 1 : 0.98 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <Pressable
                  onPress={onSubmit}
                  disabled={!canSubmit}
                  className="mt-2 overflow-hidden rounded-2xl"
                  style={Platform.select({
                    ios: {
                      shadowColor: canSubmit ? colors.accentB : "transparent",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    },
                  })}
                >
                  <LinearGradient
                    colors={
                      canSubmit
                        ? [colors.primary, "#1F2937"]
                        : isDark
                          ? ["#334155", "#1E293B"]
                          : ["#E2E8F0", "#CBD5E1"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="items-center justify-center py-4"
                  >
                    <Text
                      className="text-lg font-bold"
                      style={{
                        color: canSubmit ? "#FFFFFF" : colors.textMuted,
                      }}
                    >
                      {isSubmitting ? "Processing..." : title}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </MotiView>
            </View>
          </LinearGradient>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type InputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
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
  icon,
  error,
  secure = false,
  showSecureText = false,
  onToggleSecure,
}: InputProps) {
  const { colors, isDark } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text
        className="mb-1.5 ml-1 text-xs font-bold uppercase tracking-wider"
        style={{ color: colors.textMuted }}
      >
        {label}
      </Text>
      <MotiView
        animate={{
          borderColor: error
            ? "#EF4444"
            : isFocused
              ? colors.accentB
              : colors.border,
          backgroundColor: isDark
            ? isFocused
              ? "#1F242B"
              : "#161A20"
            : isFocused
              ? "#FFFFFF"
              : "#F8FAFC",
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ type: "timing", duration: 200 }}
        className="h-14 flex-row items-center rounded-2xl border px-4 shadow-sm"
        style={{
          shadowColor: isFocused ? colors.accentB : "transparent",
          shadowOpacity: 0.05,
          shadowRadius: 10,
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={
            error ? "#EF4444" : isFocused ? colors.accentB : colors.textMuted
          }
          style={{ marginRight: 12 }}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
          secureTextEntry={secure && !showSecureText}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          selectionColor={colors.accentB}
          style={{
            color: colors.text,
            flex: 1,
            fontSize: 16,
            fontWeight: "500",
          }}
        />
        {secure ? (
          <Pressable onPress={onToggleSecure} hitSlop={12} className="p-1">
            <Ionicons
              name={showSecureText ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </MotiView>
      {error ? (
        <MotiView
          from={{ opacity: 0, translateX: -10 }}
          animate={{ opacity: 1, translateX: 0 }}
          className="ml-1 mt-1"
        >
          <Text className="text-xs font-medium" style={{ color: "#EF4444" }}>
            {error}
          </Text>
        </MotiView>
      ) : null}
    </View>
  );
}
