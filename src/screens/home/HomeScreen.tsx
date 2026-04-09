import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatePresence, MotiView } from "moti";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { BackgroundPatterns } from "@/components/common/BackgroundPatterns";
import { FAB } from "@/components/common/FAB";
import { SegmentControl } from "@/components/common/SegmentControl";
import { useAuth } from "@/store/auth/AuthProvider";
import {
  categoryById,
  formatCurrency,
  useFinance,
} from "@/store/finance/FinanceProvider";
import { useAppTheme } from "@/theme/ThemeProvider";

type HomeScreenProps = { onToggleTheme: () => void };

export function HomeScreen({ onToggleTheme }: HomeScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { user } = useAuth();
  const { loading, total, transactions, categories } = useFinance();
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState<"Weekly" | "Monthly">("Weekly");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const appScreens = [
    { name: "Home", icon: "home-outline", route: "Home" },
    { name: "Transactions", icon: "receipt-outline", route: "Transactions" },
    { name: "Balances", icon: "wallet-outline", route: "Balances" },
    { name: "Profile", icon: "person-outline", route: "Profile" },
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { screens: [], transactions: [] };
    const q = searchQuery.toLowerCase();

    const filteredScreens = appScreens.filter((s) =>
      s.name.toLowerCase().includes(q),
    );

    const filteredTransactions = transactions.filter((t) => {
      const category = categoryById(categories, t.categoryId);
      return (
        category?.name.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      );
    });

    return { screens: filteredScreens, transactions: filteredTransactions };
  }, [searchQuery, transactions, categories]);

  const firstName = user?.fullName?.split(" ")[0] || "User";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const budget = 4200;
  const spentPct = Math.min((total.expense / budget) * 100, 100);

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
          className="mb-8 flex-row items-center justify-between"
        >
          <View>
            <Text className="text-base" style={{ color: colors.textMuted }}>
              Hey, {firstName}
            </Text>
            <Text
              className="text-3xl font-extrabold"
              style={{ color: colors.text }}
            >
              {getGreeting()}
            </Text>
          </View>

          <View className="flex-row gap-3">
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
            <Pressable
              onPress={() => setShowSearch(true)}
              className="h-12 w-12 items-center justify-center rounded-2xl border"
              style={{
                borderColor: colors.border,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
              }}
            >
              <Ionicons name="search-outline" size={22} color={colors.text} />
            </Pressable>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 100 }}
        >
          <LinearGradient
            colors={
              isDark
                ? ["#000000", "#1E1B4B"]
                : [colors.primary, colors.secondary]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[32px] overflow-hidden p-8 shadow-2xl"
            style={{ borderRadius: 32 }}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-black tracking-widest text-white/90">
                ADRBank
              </Text>
              <Ionicons
                name="wifi-outline"
                size={24}
                color="white"
                style={{ transform: [{ rotate: "90deg" }] }}
              />
            </View>

            <View className="mt-10">
              <Text className="text-sm font-bold text-white/70">
                Total Balance
              </Text>
              <Text className="mt-1 text-4xl font-black text-white">
                {formatCurrency(total.balance)}
              </Text>
            </View>

            <View className="mt-10 flex-row items-end justify-between">
              <View>
                <Text className="text-xs font-black uppercase tracking-widest text-white/50">
                  4521 •••• •••• 8521
                </Text>
                <Text className="mt-1 text-base font-black text-white uppercase">
                  {user?.fullName || "USER"}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs font-black uppercase tracking-widest text-white/50">
                  Expires
                </Text>
                <Text className="mt-1 text-base font-black text-white">
                  08/29
                </Text>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        <View className="mt-10">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Expenses
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
            className="rounded-[28px] border p-6"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Total Spent this {period.toLowerCase().replace("ly", "")}
                </Text>
                <Text
                  className="mt-1 text-3xl font-black"
                  style={{ color: colors.text }}
                >
                  {formatCurrency(total.expense)}
                </Text>
              </View>
              <ProgressRing value={spentPct} color={colors.primary} />
            </View>
          </View>
        </View>

        <View className="mt-10">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Transactions
            </Text>
            <Pressable onPress={() => navigation.navigate("Transactions")}>
              <Text
                className="text-sm font-bold"
                style={{ color: colors.primary }}
              >
                View All
              </Text>
            </Pressable>
          </View>

          {loading ? (
            <View
              className="mt-2 h-40 items-center justify-center rounded-3xl border border-dashed"
              style={{ borderColor: colors.border }}
            >
              <Text style={{ color: colors.textMuted }}>Loading...</Text>
            </View>
          ) : transactions.length === 0 ? (
            <View
              className="mt-2 h-40 items-center justify-center rounded-3xl border border-dashed"
              style={{ borderColor: colors.border }}
            >
              <Text style={{ color: colors.textMuted }}>
                No transactions yet
              </Text>
            </View>
          ) : (
            transactions.slice(0, 5).map((item, index) => {
              const category = categoryById(categories, item.categoryId);
              const isIncome = item.type === "income";
              return (
                <MotiView
                  key={item.id}
                  from={{ opacity: 0, translateX: -10 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", delay: index * 80 }}
                  className="mb-4 flex-row items-center justify-between rounded-3xl border p-4"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <View className="flex-row items-center flex-1 mr-4 gap-4">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: colors.surfaceMuted }}
                    >
                      <Ionicons
                        name={(category?.icon as any) || "receipt-outline"}
                        size={22}
                        color={colors.primary}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-base font-black tracking-tight"
                        style={{ color: colors.text }}
                      >
                        {category?.name || "General"}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="text-[10px] font-black uppercase text-gray-400"
                      >
                        {item.note ||
                          (isIncome ? "Income Received" : "Expense Paid")}
                      </Text>
                      <Text
                        className="text-[8px] font-black uppercase opacity-30"
                        style={{ color: colors.text }}
                      >
                        {item.date}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-lg font-black"
                    style={{ color: isIncome ? colors.primary : "#FF6492" }}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </Text>
                </MotiView>
              );
            })
          )}
        </View>
      </ScrollView>

      <FAB
        onPress={() => navigation.navigate("Transactions", { showAdd: true })}
      />

      <Modal
        visible={showSearch}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSearch(false)}
      >
        <View
          className="flex-1"
          style={{
            backgroundColor: isDark
              ? "rgba(0,0,0,0.95)"
              : "rgba(255,255,255,0.95)",
          }}
        >
          <View
            className="px-6 pt-16 pb-6 border-b"
            style={{ borderColor: colors.border }}
          >
            <View className="flex-row items-center gap-4">
              <Pressable
                onPress={() => setShowSearch(false)}
                className="h-10 w-10 items-center justify-center rounded-xl bg-gray-100/5"
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
              <TextInput
                autoFocus
                placeholder="Search everything..."
                placeholderTextColor={colors.textMuted}
                className="flex-1 text-xl font-bold"
                style={{ color: colors.text }}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView
            className="flex-1 px-6 pt-4"
            showsVerticalScrollIndicator={false}
          >
            <AnimatePresence>
              {!searchQuery.trim() ? (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-20 items-center"
                >
                  <Ionicons name="search" size={64} color={colors.border} />
                  <Text
                    className="mt-4 text-center font-bold opacity-30"
                    style={{ color: colors.text }}
                  >
                    Start typing to search across{"\n"}transactions and app
                    features
                  </Text>
                </MotiView>
              ) : (
                <View key="results">
                  {searchResults.screens.length > 0 && (
                    <View className="mb-8">
                      <Text
                        className="mb-4 text-xs font-black uppercase tracking-widest opacity-40"
                        style={{ color: colors.text }}
                      >
                        App Screens
                      </Text>
                      {searchResults.screens.map((screen) => (
                        <Pressable
                          key={screen.name}
                          onPress={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            navigation.navigate(screen.route);
                          }}
                          className="mb-3 flex-row items-center gap-4 rounded-2xl p-4 border"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.03)"
                              : "rgba(0,0,0,0.02)",
                          }}
                        >
                          <Ionicons
                            name={screen.icon as any}
                            size={20}
                            color={colors.primary}
                          />
                          <Text
                            className="text-base font-bold"
                            style={{ color: colors.text }}
                          >
                            {screen.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}

                  {searchResults.transactions.length > 0 && (
                    <View className="mb-8">
                      <Text
                        className="mb-4 text-xs font-black uppercase tracking-widest opacity-40"
                        style={{ color: colors.text }}
                      >
                        Transactions
                      </Text>
                      {searchResults.transactions.map((item) => {
                        const category = categoryById(
                          categories,
                          item.categoryId,
                        );
                        const isIncome = item.type === "income";
                        return (
                          <Pressable
                            key={item.id}
                            onPress={() => {
                              setShowSearch(false);
                              setSearchQuery("");
                              navigation.navigate("Transactions");
                            }}
                            className="mb-3 flex-row items-center justify-between rounded-2xl p-4 border"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(0,0,0,0.02)",
                            }}
                          >
                            <View className="flex-row items-center flex-1 mr-4 gap-4">
                              <View
                                className="h-10 w-10 items-center justify-center rounded-xl"
                                style={{ backgroundColor: colors.surfaceMuted }}
                              >
                                <Ionicons
                                  name={
                                    (category?.icon as any) || "receipt-outline"
                                  }
                                  size={20}
                                  color={colors.primary}
                                />
                              </View>
                              <View>
                                <Text
                                  className="text-base font-bold"
                                  style={{ color: colors.text }}
                                >
                                  {category?.name}
                                </Text>
                                <Text
                                  className="text-xs"
                                  style={{ color: colors.textMuted }}
                                >
                                  {item.note || "No note"}
                                </Text>
                              </View>
                            </View>
                            <Text
                              className="text-lg font-black"
                              style={{
                                color: isIncome ? colors.primary : "#FF6492",
                              }}
                            >
                              {isIncome ? "+" : "-"}
                              {formatCurrency(item.amount)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}

                  {searchResults.screens.length === 0 &&
                    searchResults.transactions.length === 0 && (
                      <View className="mt-20 items-center">
                        <Ionicons
                          name="alert-circle-outline"
                          size={48}
                          color={colors.border}
                        />
                        <Text
                          className="mt-4 font-bold opacity-30"
                          style={{ color: colors.text }}
                        >
                          No results found for "{searchQuery}"
                        </Text>
                      </View>
                    )}
                </View>
              )}
            </AnimatePresence>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function ProgressRing({ value, color }: { value: number; color: string }) {
  const size = 68;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ratio = Math.min(value / 100, 1);

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c * ratio} ${c}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View className="absolute">
        <Text className="text-xs font-black" style={{ color: color }}>
          {Math.round(value)}%
        </Text>
      </View>
    </View>
  );
}
