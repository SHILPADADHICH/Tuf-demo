import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { GradientOrbs } from '@/components/common/GradientOrbs';
import { categoryById, filterByType, formatCurrency, useFinance } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { TransactionInput } from '@/types/finance';

type TransactionsScreenProps = { onToggleTheme: () => void };
type FilterType = 'all' | 'income' | 'expense';
type FieldErrors = Partial<Record<'amount' | 'categoryId' | 'date', string>>;

const today = () => new Date().toISOString().slice(0, 10);

export function TransactionsScreen({ onToggleTheme }: TransactionsScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { loading, categories, transactions, addCategory, addTransaction } = useFinance();
  const [filter, setFilter] = useState<FilterType>('all');
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<TransactionInput>({ type: 'expense', amount: '', categoryId: 'food', date: today(), note: '' });

  const list = useMemo(() => {
    if (filter === 'all') return transactions;
    return filterByType(transactions, filter);
  }, [filter, transactions]);

  const submit = () => {
    const nextErrors: FieldErrors = {};
    const amount = Number(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0) nextErrors.amount = 'Amount should be greater than 0';
    if (!form.categoryId) nextErrors.categoryId = 'Please select a category';
    if (!form.date || Number.isNaN(new Date(form.date).getTime())) nextErrors.date = 'Date format should be YYYY-MM-DD';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    addTransaction({ amount, categoryId: form.categoryId, date: form.date, note: form.note.trim(), type: form.type });
    setErrors({});
    setForm((prev) => ({ ...prev, amount: '', note: '' }));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <GradientOrbs />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 120 }}>
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-3xl font-bold" style={{ color: colors.text }}>Transactions</Text>
            <View className="flex-row gap-3">
              <Pressable onPress={onToggleTheme} className="h-11 w-11 items-center justify-center rounded-2xl border" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
                <Ionicons name="moon-outline" size={19} color={colors.text} />
              </Pressable>
              <Pressable className="h-11 w-11 items-center justify-center rounded-2xl border" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
                <Ionicons name="options-outline" size={19} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <LinearGradient colors={isDark ? ['#161824', '#0E1018'] : ['#FFFFFF', '#EEF2FF']} className="rounded-3xl border p-4" style={{ borderColor: colors.border }}>
            <Text className="text-lg font-semibold" style={{ color: colors.text }}>Add Transaction</Text>
            <View className="mt-3 flex-row rounded-2xl p-1" style={{ backgroundColor: isDark ? '#232633' : '#E2E8F0' }}>
              {(['expense', 'income'] as const).map((t) => {
                const active = form.type === t;
                return (
                  <Pressable key={t} onPress={() => setForm((p) => ({ ...p, type: t }))} className="flex-1 rounded-xl py-2.5" style={{ backgroundColor: active ? '#7C3AED' : 'transparent' }}>
                    <Text className="text-center text-sm font-semibold" style={{ color: active ? '#fff' : colors.textMuted }}>{t[0].toUpperCase() + t.slice(1)}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Field label="Amount" value={form.amount} onChangeText={(v) => setForm((p) => ({ ...p, amount: v }))} placeholder="e.g. 1200" error={errors.amount} />
            <Field label="Date (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm((p) => ({ ...p, date: v }))} placeholder="2026-04-08" error={errors.date} />
            <Field label="Note" value={form.note} onChangeText={(v) => setForm((p) => ({ ...p, note: v }))} placeholder="Optional note" />

            <Text className="mb-2 mt-4 text-sm font-medium" style={{ color: colors.text }}>Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => {
                const active = form.categoryId === category.id;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setForm((p) => ({ ...p, categoryId: category.id }))}
                    className="flex-row items-center rounded-full border px-3 py-2"
                    style={{ borderColor: active ? category.color : colors.border, backgroundColor: active ? `${category.color}20` : `${colors.surface}99` }}
                  >
                    <Ionicons name={category.icon as never} size={13} color={category.color} />
                    <Text className="ml-1 text-xs font-medium" style={{ color: colors.text }}>{category.name}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="mt-4 flex-row gap-2">
              <View className="h-11 flex-1 justify-center rounded-xl border px-3" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
                <TextInput value={customCategory} onChangeText={setCustomCategory} placeholder="Custom category" placeholderTextColor={colors.textMuted} style={{ color: colors.text }} />
              </View>
              <Pressable
                disabled={!customCategory.trim()}
                onPress={() => {
                  const id = addCategory(customCategory);
                  if (id) {
                    setForm((p) => ({ ...p, categoryId: id }));
                    setCustomCategory('');
                  }
                }}
                className="rounded-xl px-4"
                style={{ justifyContent: 'center', backgroundColor: customCategory.trim() ? '#7C3AED' : isDark ? '#334155' : '#CBD5E1' }}
              >
                <Text className="font-semibold text-white">Add</Text>
              </Pressable>
            </View>

            <Pressable onPress={submit} className="mt-5 rounded-xl py-3.5" style={{ backgroundColor: '#7C3AED' }}>
              <Text className="text-center text-base font-semibold text-white">Save Transaction</Text>
            </Pressable>
          </LinearGradient>

          <View className="mt-6">
            <View className="mb-2 flex-row rounded-2xl p-1" style={{ backgroundColor: isDark ? '#1E2230' : '#E2E8F0' }}>
              {(['all', 'income', 'expense'] as const).map((t) => (
                <Pressable key={t} onPress={() => setFilter(t)} className="flex-1 rounded-xl py-2" style={{ backgroundColor: filter === t ? '#7C3AED' : 'transparent' }}>
                  <Text className="text-center text-xs font-semibold" style={{ color: filter === t ? '#fff' : colors.textMuted }}>{t.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>

            {loading ? (
              <View className="mt-3 rounded-2xl border p-5" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
                <Text style={{ color: colors.textMuted }}>Loading history...</Text>
              </View>
            ) : list.length === 0 ? (
              <View className="mt-3 rounded-2xl border p-8" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
                <Text className="text-center text-sm" style={{ color: colors.textMuted }}>Nothing here yet</Text>
              </View>
            ) : (
              list.map((item, idx) => {
                const category = categoryById(categories, item.categoryId);
                const income = item.type === 'income';
                return (
                  <MotiView key={item.id} from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: idx * 40 }} className="mt-3 flex-row items-center justify-between rounded-2xl border px-4 py-3" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${category?.color ?? '#64748B'}22` }}>
                        <Ionicons name={(category?.icon as never) ?? 'grid-outline'} size={16} color={category?.color ?? '#64748B'} />
                      </View>
                      <View>
                        <Text className="text-base font-semibold" style={{ color: colors.text }}>{category?.name ?? 'Unknown'}</Text>
                        <Text className="text-xs" style={{ color: colors.textMuted }}>{item.date}</Text>
                      </View>
                    </View>
                    <Text className="text-base font-semibold" style={{ color: income ? '#6BCF7F' : '#FF6B6B' }}>{income ? '+' : '-'}{formatCurrency(item.amount)}</Text>
                  </MotiView>
                );
              })
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, error }: { label: string; value: string; onChangeText: (v: string) => void; placeholder: string; error?: string }) {
  const { colors, isDark } = useAppTheme();
  return (
    <View className="mt-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.text }}>{label}</Text>
      <View className="h-11 justify-center rounded-xl border px-3" style={{ borderColor: error ? '#FF6B6B' : colors.border, backgroundColor: isDark ? '#171A24' : '#F8FAFC' }}>
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textMuted} style={{ color: colors.text }} />
      </View>
      {error ? <Text className="mt-1 text-xs text-rose-400">{error}</Text> : null}
    </View>
  );
}
