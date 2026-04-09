import { Ionicons } from "@expo/vector-icons";
import { AnimatePresence, MotiView } from "moti";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { BackgroundPatterns } from "@/components/common/BackgroundPatterns";
import { CalendarModal } from "@/components/common/CalendarModal";
import {
  categoryById,
  filterByType,
  formatCurrency,
  useFinance,
} from "@/store/finance/FinanceProvider";
import { useAppTheme } from "@/theme/ThemeProvider";
import type { TransactionInput } from "@/types/finance";

type TransactionsScreenProps = {
  onToggleTheme: () => void;
  route?: any;
  navigation?: any;
};
type FilterType = "all" | "income" | "expense";
type FieldErrors = Partial<Record<"amount" | "categoryId" | "date", string>>;

const today = () => new Date().toISOString().slice(0, 10);

export function TransactionsScreen({
  onToggleTheme,
  route,
  navigation,
}: TransactionsScreenProps) {
  const { colors, isDark } = useAppTheme();
  const {
    loading,
    categories,
    transactions,
    addCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();
  const [filter, setFilter] = useState<FilterType>("all");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [form, setForm] = useState<TransactionInput>({
    type: "expense",
    amount: "",
    categoryId: "food",
    date: today(),
    note: "",
  });

  const onEdit = (t: any) => {
    setForm({
      type: t.type,
      amount: t.amount.toString(),
      categoryId: t.categoryId,
      date: t.date,
      note: t.note || "",
    });
    setEditingId(t.id);
    setShowAdd(true);
  };

  const onCancel = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm({
      type: "expense",
      amount: "",
      categoryId: "food",
      date: today(),
      note: "",
    });
    setErrors({});
  };

  const onDelete = () => {
    if (editingId) {
      deleteTransaction(editingId);
      onCancel();
    }
  };

  useEffect(() => {
    if (route?.params?.showAdd) {
      setShowAdd(true);
      // Clear the param after showing so it doesn't pop up again on back
      navigation?.setParams({ showAdd: undefined });
    }
  }, [route?.params?.showAdd]);

  const list = useMemo(() => {
    if (filter === "all") return transactions;
    return filterByType(transactions, filter);
  }, [filter, transactions]);

  const submit = () => {
    const nextErrors: FieldErrors = {};
    const amount = Number(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0)
      nextErrors.amount = "Invalid amount";
    if (!form.categoryId) nextErrors.categoryId = "Required";
    if (!form.date) nextErrors.date = "Required";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    if (editingId) {
      updateTransaction(editingId, {
        amount,
        categoryId: form.categoryId,
        date: form.date,
        note: form.note.trim(),
        type: form.type,
      });
    } else {
      addTransaction({
        amount,
        categoryId: form.categoryId,
        date: form.date,
        note: form.note.trim(),
        type: form.type,
      });
    }
    onCancel();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <BackgroundPatterns />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 56,
            paddingBottom: 150,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 flex-row items-center justify-between">
            <Text
              className="text-3xl font-extrabold"
              style={{ color: colors.text }}
            >
              Activity
            </Text>
            <Pressable
              onPress={() => (showAdd ? onCancel() : setShowAdd(true))}
              className="h-12 w-12 items-center justify-center rounded-2xl border"
              style={{
                borderColor: showAdd ? colors.primary : colors.border,
                backgroundColor: showAdd
                  ? `${colors.primary}10`
                  : "rgba(255,255,255,0.03)",
              }}
            >
              <Ionicons
                name={showAdd ? "close" : "add"}
                size={24}
                color={showAdd ? colors.primary : colors.text}
              />
            </Pressable>
          </View>

          <AnimatePresence>
            {showAdd && (
              <MotiView
                from={{ opacity: 0, scale: 0.95, translateY: -20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.95, translateY: -20 }}
                className="mb-8"
              >
                <View
                  className="rounded-[32px] border p-6"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                  }}
                >
                  <Text
                    className="text-xl font-bold mb-6"
                    style={{ color: colors.text }}
                  >
                    {editingId ? "Edit Transaction" : "New Transaction"}
                  </Text>

                  <View className="flex-row rounded-2xl bg-white/5 p-1 mb-6">
                    {(["expense", "income"] as const).map((t) => {
                      const active = form.type === t;
                      return (
                        <Pressable
                          key={t}
                          onPress={() => setForm((p) => ({ ...p, type: t }))}
                          className="flex-1 rounded-xl py-3"
                          style={{
                            backgroundColor: active
                              ? colors.primary
                              : "transparent",
                          }}
                        >
                          <Text
                            className="text-center text-xs font-black uppercase"
                            style={{
                              color: active ? "#000" : colors.textMuted,
                            }}
                          >
                            {t}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View className="mb-6">
                    <Field
                      label="Amount"
                      value={form.amount}
                      onChangeText={(v: string) =>
                        setForm((p) => ({
                          ...p,
                          amount: v.replace(/[^0-9.]/g, ""),
                        }))
                      }
                      placeholder="0.00"
                      error={errors.amount}
                      colors={colors}
                      keyboardType="numeric"
                    />
                  </View>

                  <View className="mb-8">
                    <Text
                      className="mb-3 text-xs font-bold uppercase tracking-widest opacity-40"
                      style={{ color: colors.text }}
                    >
                      Transaction Date
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View className="flex-row gap-3">
                        {(() => {
                          const todayStr = today();
                          const yesterdayStr = new Date(Date.now() - 86400000)
                            .toISOString()
                            .slice(0, 10);
                          const tomorrowStr = new Date(Date.now() + 86400000)
                            .toISOString()
                            .slice(0, 10);

                          const presets = [
                            { label: "Today", date: todayStr },
                            { label: "Yesterday", date: yesterdayStr },
                            { label: "Tomorrow", date: tomorrowStr },
                          ];

                          return (
                            <>
                              <Pressable
                                onPress={() => setShowCalendar(true)}
                                className="flex-row items-center rounded-2xl border px-6 py-4"
                                style={{
                                  borderColor: colors.primary,
                                  backgroundColor: `${colors.primary}10`,
                                  minWidth: 140,
                                }}
                              >
                                <Ionicons
                                  name="calendar"
                                  size={18}
                                  color={colors.primary}
                                />
                                <View className="ml-3">
                                  <Text
                                    className="text-[10px] font-black uppercase"
                                    style={{ color: colors.primary }}
                                  >
                                    Choose Date
                                  </Text>
                                  <Text
                                    className="mt-0.5 text-[10px] font-bold opacity-60"
                                    style={{ color: colors.text }}
                                  >
                                    {form.date}
                                  </Text>
                                </View>
                              </Pressable>

                              {presets.map((d, i) => {
                                const active = form.date === d.date;
                                return (
                                  <Pressable
                                    key={i}
                                    onPress={() =>
                                      setForm((p) => ({ ...p, date: d.date }))
                                    }
                                    className="items-center justify-center rounded-2xl border px-6 py-4"
                                    style={{
                                      borderColor: active
                                        ? colors.primary
                                        : colors.border,
                                      backgroundColor: active
                                        ? `${colors.primary}20`
                                        : "transparent",
                                      minWidth: 100,
                                    }}
                                  >
                                    <Text
                                      className="text-[10px] font-black uppercase"
                                      style={{
                                        color: active
                                          ? colors.primary
                                          : colors.textMuted,
                                      }}
                                    >
                                      {d.label}
                                    </Text>
                                    <Text
                                      className="mt-1 text-[10px] font-bold opacity-40"
                                      style={{ color: colors.text }}
                                    >
                                      {d.date}
                                    </Text>
                                  </Pressable>
                                );
                              })}
                            </>
                          );
                        })()}
                      </View>
                    </ScrollView>
                  </View>

                  <View className="mb-6">
                    <Text
                      className="mb-3 text-xs font-bold uppercase tracking-widest opacity-50"
                      style={{ color: colors.text }}
                    >
                      Category
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View className="flex-row gap-3">
                        {categories.map((category) => {
                          const active = form.categoryId === category.id;
                          return (
                            <Pressable
                              key={category.id}
                              onPress={() =>
                                setForm((p) => ({
                                  ...p,
                                  categoryId: category.id,
                                }))
                              }
                              className="flex-row items-center rounded-2xl border px-5 h-12"
                              style={{
                                borderColor: active
                                  ? colors.primary
                                  : colors.border,
                                backgroundColor: active
                                  ? `${colors.primary}20`
                                  : "transparent",
                              }}
                            >
                              <Ionicons
                                name={category.icon as any}
                                size={16}
                                color={
                                  active ? colors.primary : colors.textMuted
                                }
                              />
                              <Text
                                className="ml-2 text-xs font-bold"
                                style={{
                                  color: active
                                    ? colors.text
                                    : colors.textMuted,
                                }}
                              >
                                {category.name}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>

                  <Field
                    label="Note"
                    value={form.note}
                    onChangeText={(v: string) =>
                      setForm((p) => ({ ...p, note: v }))
                    }
                    placeholder="What was this for?"
                    colors={colors}
                  />

                  <Pressable
                    onPress={submit}
                    className="mt-6 h-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-base font-black text-black uppercase tracking-widest">
                      {editingId ? "Save Changes" : "Complete Transaction"}
                    </Text>
                  </Pressable>

                  {editingId && (
                    <Pressable
                      onPress={onDelete}
                      className="mt-4 h-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5"
                    >
                      <Text
                        className="text-xs font-black uppercase tracking-[4px]"
                        style={{ color: colors.danger }}
                      >
                        Delete Transaction
                      </Text>
                    </Pressable>
                  )}
                </View>
              </MotiView>
            )}
          </AnimatePresence>

          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              History
            </Text>
            <View
              className="flex-row rounded-2xl bg-white/5 p-1"
              style={{ width: "60%" }}
            >
              {(["all", "income", "expense"] as const).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setFilter(t)}
                  className="flex-1 rounded-xl py-2"
                  style={{
                    backgroundColor:
                      filter === t ? colors.primary : "transparent",
                  }}
                >
                  <Text
                    className="text-center text-[10px] font-black"
                    style={{ color: filter === t ? "#000" : colors.textMuted }}
                  >
                    {t.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {loading ? (
            <View className="h-40 items-center justify-center">
              <Text style={{ color: colors.textMuted }}>Loading...</Text>
            </View>
          ) : list.length === 0 ? (
            <View
              className="h-60 items-center justify-center rounded-[32px] border border-dashed"
              style={{ borderColor: colors.border }}
            >
              <Ionicons
                name="receipt-outline"
                size={48}
                color={colors.border}
              />
              <Text
                className="mt-4 text-sm font-medium"
                style={{ color: colors.textMuted }}
              >
                Your financial history starts here
              </Text>
            </View>
          ) : (
            list.map((item, idx) => {
              const category = categoryById(categories, item.categoryId);
              const income = item.type === "income";
              return (
                <Pressable key={item.id} onPress={() => onEdit(item)}>
                  <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "timing", delay: idx * 50 }}
                    className="mb-4 flex-row items-center justify-between rounded-[28px] border p-5"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: isDark ? "#121212" : "#FFFFFF",
                    }}
                  >
                    <View className="flex-row items-center flex-1 mr-4 gap-4">
                      <View
                        className="h-12 w-12 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: isDark ? "#1C1C1E" : "#F1F5F9",
                        }}
                      >
                        <Ionicons
                          name={(category?.icon as any) || "receipt-outline"}
                          size={20}
                          color={isDark ? colors.primary : "#000"}
                        />
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-base font-bold uppercase tracking-tight"
                          style={{ color: colors.text }}
                        >
                          {category?.name || "General"}
                        </Text>
                        {item.note && (
                          <Text
                            numberOfLines={1}
                            className="text-xs font-medium"
                            style={{ color: colors.textMuted }}
                          >
                            {item.note}
                          </Text>
                        )}
                        <Text
                          className="text-[10px] font-bold uppercase opacity-40"
                          style={{ color: colors.text }}
                        >
                          {item.date}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="text-lg font-black"
                      style={{ color: income ? colors.primary : "#FF6492" }}
                    >
                      {income ? "+" : "-"}
                      {formatCurrency(item.amount)}
                    </Text>
                  </MotiView>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <CalendarModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={form.date}
        onSelectDate={(d) => setForm((p) => ({ ...p, date: d }))}
      />
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  colors,
  keyboardType,
  editable = true,
  onPress,
}: any) {
  return (
    <Pressable onPress={onPress} className="mb-4 flex-1">
      <Text
        className="mb-2 text-xs font-bold uppercase tracking-widest"
        style={{ color: colors.textMuted }}
      >
        {label}
      </Text>
      <View
        className="h-14 justify-center rounded-2xl border px-4"
        style={{
          borderColor: error ? "#FF6492" : colors.border,
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(155, 161, 166, 0.4)"
          style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}
          keyboardType={keyboardType}
          editable={editable}
          pointerEvents={onPress ? "none" : "auto"}
        />
      </View>
      {error ? (
        <Text className="mt-1 text-[10px] font-bold text-rose-400 uppercase ml-1">
          {error}
        </Text>
      ) : null}
    </Pressable>
  );
}
