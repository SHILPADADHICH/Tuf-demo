import { Ionicons } from "@expo/vector-icons";
import { AnimatePresence, MotiView } from "moti";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { BackgroundPatterns } from "@/components/common/BackgroundPatterns";
import { SegmentControl } from "@/components/common/SegmentControl";
import { useAuth } from "@/store/auth/AuthProvider";
import { useAppTheme } from "@/theme/ThemeProvider";

type ProfileScreenProps = { onToggleTheme: () => void; onLogout: () => void };

export function ProfileScreen({ onToggleTheme, onLogout }: ProfileScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { user } = useAuth();
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");
  const [profile, setProfile] = useState({
    name: user?.fullName || "User",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName,
        email: user.email,
      });
    }
  }, [user]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <BackgroundPatterns />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 64,
          paddingBottom: 160,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mb-10 flex-row items-center justify-between"
        >
          <Text className="text-3xl font-black" style={{ color: colors.text }}>
            Profile
          </Text>
          <Pressable
            onPress={onToggleTheme}
            className="h-12 w-12 items-center justify-center rounded-2xl border"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            }}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={22}
              color={colors.text}
            />
          </Pressable>
        </MotiView>

        <View className="items-center mb-10">
          <View className="h-28 w-28 items-center justify-center rounded-full border-4 border-white/5 bg-white/10 shadow-xl">
            <Text className="text-4xl font-black text-white">
              {profile.name
                ? profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            className="mt-4 text-2xl font-black text-center"
            style={{ color: colors.text }}
          >
            {profile.name}
          </Text>
        </View>

        <View className="mb-10 items-center">
          <View style={{ width: 220 }}>
            <SegmentControl
              options={[
                { label: "Preview", value: "Preview" },
                { label: "Edit", value: "Edit" },
              ]}
              value={mode}
              onChange={setMode}
            />
          </View>
        </View>

        <AnimatePresence exitBeforeEnter>
          {mode === "Preview" ? (
            <MotiView
              key="preview"
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-[32px] border p-8"
              style={{
                borderColor: colors.border,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.01)",
              }}
            >
              <StatRow label="Spending" value="$42,500.00" colors={colors} />
              <StatRow label="Email" value={profile.email} colors={colors} />
              <StatRow label="Balance" value="$12,500.00" colors={colors} />

              <View className="my-6 h-[1px] w-full bg-white/5" />

              <Pressable
                onPress={onLogout}
                className="h-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 active:opacity-70"
              >
                <Text
                  className="text-sm font-black uppercase tracking-[4px]"
                  style={{ color: colors.danger }}
                >
                  Logout
                </Text>
              </Pressable>
            </MotiView>
          ) : (
            <MotiView
              key="edit"
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-[32px] border p-8"
              style={{
                borderColor: colors.border,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.01)",
              }}
            >
              <Text
                className="mb-6 text-xl font-bold"
                style={{ color: colors.text }}
              >
                Edit Profile
              </Text>

              <View className="mb-6">
                <Text
                  className="mb-2 text-[10px] font-black uppercase tracking-widest opacity-40"
                  style={{ color: colors.text }}
                >
                  Full Name
                </Text>
                <View
                  className="h-14 justify-center rounded-2xl border px-4"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <TextInput
                    value={profile.name}
                    onChangeText={(v) => setProfile((p) => ({ ...p, name: v }))}
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  />
                </View>
              </View>

              <View className="mb-8">
                <Text
                  className="mb-2 text-[10px] font-black uppercase tracking-widest opacity-40"
                  style={{ color: colors.text }}
                >
                  Email Address
                </Text>
                <View
                  className="h-14 justify-center rounded-2xl border px-4"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <TextInput
                    value={profile.email}
                    onChangeText={(v) =>
                      setProfile((p) => ({ ...p, email: v }))
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  />
                </View>
              </View>

              <Pressable
                onPress={() => setMode("Preview")}
                className="h-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: colors.primary }}
              >
                <Text
                  className="text-sm font-black uppercase tracking-[2px]"
                  style={{ color: "#000" }}
                >
                  Save Changes
                </Text>
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>
    </View>
  );
}

function StatRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <Text
        className="text-sm font-black uppercase tracking-widest opacity-40"
        style={{ color: colors.text }}
      >
        {label}
      </Text>
      <Text className="text-base font-black" style={{ color: colors.text }}>
        {value}
      </Text>
    </View>
  );
}
