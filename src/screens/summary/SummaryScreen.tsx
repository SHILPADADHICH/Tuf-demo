import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";

import { BackgroundPatterns } from "@/components/common/BackgroundPatterns";
import { SegmentControl } from "@/components/common/SegmentControl";
import { formatCurrency, useFinance } from "@/store/finance/FinanceProvider";
import { useAppTheme } from "@/theme/ThemeProvider";

type SummaryScreenProps = { onToggleTheme: () => void };

export function SummaryScreen({ onToggleTheme }: SummaryScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { monthly } = useFinance();
  const [period, setPeriod] = useState<"Weekly" | "Monthly">("Weekly");

  const spentPct = 65; // Mock

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
        <View className="mb-8 flex-row items-center justify-between">
          <Text
            className="text-3xl font-extrabold"
            style={{ color: colors.text }}
          >
            Balances
          </Text>
          <Pressable
            onPress={onToggleTheme}
            className="h-11 w-11 items-center justify-center rounded-2xl border"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            }}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={20}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View className="mb-10 items-center">
          <CreditScoreGauge score={780} colors={colors} />
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-[-20px] rounded-2xl bg-white px-4 py-2 shadow-xl"
          >
            <Text className="text-xs font-bold text-black text-center">
              Your Credit Score is excellent
            </Text>
          </MotiView>
        </View>

        <View
          className="mb-10 rounded-[32px] border p-8"
          style={{
            borderColor: colors.border,
            backgroundColor: isDark ? "#000000" : "#FFFFFF",
          }}
        >
          <Text
            className="mb-6 text-sm font-black uppercase tracking-widest opacity-40"
            style={{ color: colors.text }}
          >
            Monthly Summary
          </Text>
          <View className="flex-row justify-between mb-8">
            <View>
              <Text className="text-[10px] font-black uppercase text-emerald-500 mb-1">
                Total Income
              </Text>
              <Text
                className="text-xl font-black"
                style={{ color: colors.text }}
              >
                {formatCurrency(monthly.income)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-black uppercase text-rose-500 mb-1">
                Total Expenses
              </Text>
              <Text
                className="text-xl font-black"
                style={{ color: colors.text }}
              >
                {formatCurrency(monthly.expense)}
              </Text>
            </View>
          </View>
          <View className="h-[1px] w-full bg-white/5 mb-6" />
          <View className="flex-row items-center justify-between">
            <Text
              className="text-base font-bold"
              style={{ color: colors.textMuted }}
            >
              Remaining Balance
            </Text>
            <Text
              className="text-2xl font-black"
              style={{ color: colors.primary }}
            >
              {formatCurrency(monthly.income - monthly.expense)}
            </Text>
          </View>
        </View>

        <View className="mb-10">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Currencies
            </Text>
            <Pressable>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={colors.primary}
              />
            </Pressable>
          </View>

          <CurrencyItem
            flag="🇨🇦"
            code="CAD"
            name="Canadian Dollar"
            balance="12,500.00"
            colors={colors}
            isDark={isDark}
          />
          <CurrencyItem
            flag="🇺🇸"
            code="USD"
            name="United States Dollar"
            balance="8,120.45"
            colors={colors}
            isDark={isDark}
          />
          <CurrencyItem
            flag="🇪🇺"
            code="EUR"
            name="Euro"
            balance="4,250.00"
            colors={colors}
            isDark={isDark}
          />
        </View>

        <View>
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Activity
            </Text>
            <View style={{ width: 160 }}>
              <SegmentControl
                options={[
                  { label: "Weekly", value: "Weekly" },
                  { label: "Monthly", value: "Monthly" },
                ]}
                value={period}
                onChange={setPeriod}
              />
            </View>
          </View>

          <View
            className="rounded-[32px] border p-6"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
            }}
          >
            <View className="flex-row items-end justify-between h-48 px-1">
              {[45, 80, 55, 95, 75, 60, 90].map((h, i) => (
                <View key={i} className="items-center">
                  <View
                    className="w-4 rounded-full overflow-hidden"
                    style={{
                      height: 140,
                      justifyContent: "flex-end",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                    }}
                  >
                    <LinearGradient
                      colors={
                        i === 4
                          ? [colors.primary, colors.secondary]
                          : isDark
                            ? ["#1E293B", "#0F172A"]
                            : ["#E2E8F0", "#CBD5E1"]
                      }
                      className="w-4 rounded-full"
                      style={{ height: `${h}%` }}
                    />
                  </View>
                  <Text
                    className="mt-3 text-[10px] font-bold uppercase"
                    style={{
                      color: i === 4 ? colors.primary : colors.textMuted,
                    }}
                  >
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function CreditScoreGauge({ score, colors }: { score: number; colors: any }) {
  const size = 260;
  const stroke = 12;
  const center = size / 2;
  const r = (size - stroke * 2) / 2;

  // Semi-circle path
  const startAngle = 180;
  const endAngle = 0;
  const x1 = center + r * Math.cos((startAngle * Math.PI) / 180);
  const y1 = center + r * Math.sin((startAngle * Math.PI) / 180);
  const x2 = center + r * Math.cos((endAngle * Math.PI) / 180);
  const y2 = center + r * Math.sin((endAngle * Math.PI) / 180);

  const d = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size / 1.5}>
        <Defs>
          <SvgGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F43F5E" />
            <Stop offset="50%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#7FE3D6" />
          </SvgGradient>
        </Defs>
        <Path
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <Path
          d={d}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={stroke}
          strokeDasharray="360"
          strokeDashoffset={100}
          strokeLinecap="round"
        />
      </Svg>
      <View className="absolute mt-[-30px]">
        <Text
          className="text-sm font-black uppercase tracking-[4px] mb-1 text-center"
          style={{ color: colors.textMuted }}
        >
          Score
        </Text>
        <Text
          className="text-7xl font-black text-center"
          style={{ color: colors.text }}
        >
          {score}
        </Text>
      </View>
    </View>
  );
}

function CurrencyItem({ flag, code, name, balance, colors, isDark }: any) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="mb-4 flex-row items-center justify-between rounded-3xl border p-5"
      style={{
        borderColor: colors.border,
        backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
      }}
    >
      <View className="flex-row items-center gap-4">
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <Text className="text-2xl">{flag}</Text>
        </View>
        <View>
          <Text
            className="text-base font-bold tracking-tight"
            style={{ color: colors.text }}
          >
            {code} Account
          </Text>
          <Text
            className="text-xs font-bold"
            style={{ color: colors.textMuted }}
          >
            {name}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-lg font-black" style={{ color: colors.text }}>
          ${balance}
        </Text>
        <Pressable
          className="mt-1 px-3 py-1 rounded-full border"
          style={{
            borderColor: `${colors.primary}40`,
            backgroundColor: `${colors.primary}10`,
          }}
        >
          <Text
            className="text-[10px] font-black uppercase"
            style={{ color: colors.primary }}
          >
            Manage
          </Text>
        </Pressable>
      </View>
    </MotiView>
  );
}
