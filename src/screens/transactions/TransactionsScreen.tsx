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

import { AppHeader } from '@/components/common/AppHeader';
import { SegmentControl } from '@/components/common/SegmentControl';
import { categoryById, filterByType, formatCurrency, useFinance } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { TransactionInput } from '@/types/finance';

type TransactionsScreenProps = { onToggleTheme: () => void };
type FieldErrors = Partial<Record<'amount' | 'categoryId' | 'date', string>>;

const today = () => new Date().toISOString().slice(0, 10);

export function TransactionsScreen({ onToggleTheme }: TransactionsScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { loading, categories, transactions, addCategory, addTransaction } = useFinance();
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<TransactionInput>({
    type: 'expense',
    amount: '',
    categoryId: 'food',
    date: today(),
    note: '',
  });

  const list = useMemo(() => filterByType(transactions, form.type), [form.type, transactions]);
  const canSave = form.amount.trim().length > 0 && form.categoryId.length > 0 && form.date.length > 0;

  const onSubmit = () => {
    const nextErrors: FieldErrors = {};
    const amount = Number(form.amount);

    if (!form.amount || Number.isNaN(amount) || amount <= 0) nextErrors.amount = 'Amount should be greater than 0';
    if (!form.categoryId) nextErrors.categoryId = 'Please select a category';
    if (!form.date || Number.isNaN(new Date(form.date).getTime())) nextErrors.date = 'Date format should be YYYY-MM-DD';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    addTransaction({
      amount,
      categoryId: form.categoryId,
      date: form.date,
      note: form.note.trim(),
      type: form.type,
    });

    setErrors({});
    setForm((prev) => ({ ...prev, amount: '', note: '' }));
  };

  const onAddCustomCategory = () => {
    const id = addCategory(customCategory);
    if (!id) return;

    setCustomCategory('');
    setForm((prev) => ({ ...prev, categoryId: id }));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader onToggleTheme={onToggleTheme} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
          <LinearGradient
            colors={isDark ? ['#111827', '#0B1220'] : ['#FFFFFF', '#EEF2FF']}
            className="rounded-3xl border p-4"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-xl font-semibold" style={{ color: colors.text }}>
              Add Transaction
            </Text>

            <View className="mt-3">
              <SegmentControl
                options={[
                  { label: 'Expense', value: 'expense' },
                  { label: 'Income', value: 'income' },
                ]}
                value={form.type}
                onChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
              />
            </View>

            <Input
              label="Amount"
              placeholder="e.g. 1200"
              value={form.amount}
              onChangeText={(text) => setForm((prev) => ({ ...prev, amount: text }))}
              error={errors.amount}
            />

            <Input
              label="Date (YYYY-MM-DD)"
              placeholder="2026-04-07"
              value={form.date}
              onChangeText={(text) => setForm((prev) => ({ ...prev, date: text }))}
              error={errors.date}
            />
            <Text className="mt-1 text-xs" style={{ color: colors.textMuted }}>
              Tip: use format YYYY-MM-DD for best compatibility.
            </Text>

            <Input
              label="Note"
              placeholder="Optional note"
              value={form.note}
              onChangeText={(text) => setForm((prev) => ({ ...prev, note: text }))}
            />

            <Text className="mb-2 mt-4 text-sm font-medium" style={{ color: colors.text }}>
              Category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => {
                const active = form.categoryId === category.id;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setForm((prev) => ({ ...prev, categoryId: category.id }))}
                    className="flex-row items-center rounded-full border px-3 py-2"
                    style={{
                      borderColor: active ? category.color : colors.border,
                      backgroundColor: active ? `${category.color}22` : 'transparent',
                    }}
                  >
                    <Ionicons name={category.icon as never} size={14} color={category.color} />
                    <Text className="ml-1 text-xs font-medium" style={{ color: colors.text }}>
                      {category.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.categoryId ? (
              <Text className="mt-1 text-xs" style={{ color: '#EF4444' }}>
                {errors.categoryId}
              </Text>
            ) : null}

            <View className="mt-4 flex-row gap-2">
              <View
                className="h-11 flex-1 justify-center rounded-xl border px-3"
                style={{ borderColor: colors.border, backgroundColor: isDark ? '#161A20' : '#F8FAFC' }}
              >
                <TextInput
                  placeholder="Add custom category"
                  placeholderTextColor={colors.textMuted}
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  style={{ color: colors.text, fontSize: 14 }}
                />
              </View>
              <Pressable
                onPress={onAddCustomCategory}
                className="rounded-xl px-4"
                style={{
                  backgroundColor: customCategory.trim() ? colors.primary : isDark ? '#334155' : '#CBD5E1',
                  justifyContent: 'center',
                }}
                disabled={!customCategory.trim()}
              >
                <Text style={{ color: isDark ? '#111827' : '#FFFFFF', fontWeight: '600' }}>Add</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={onSubmit}
              className="mt-5 rounded-xl py-3.5"
              style={{ backgroundColor: canSave ? colors.primary : isDark ? '#334155' : '#CBD5E1' }}
              disabled={!canSave}
            >
              <Text className="text-center text-base font-semibold" style={{ color: isDark ? '#111827' : '#FFFFFF' }}>
                Save Transaction
              </Text>
            </Pressable>
          </LinearGradient>

          <View className="mt-6">
            <Text className="text-xl font-semibold" style={{ color: colors.text }}>
              {form.type === 'income' ? 'Income' : 'Expense'} History
            </Text>

            {loading ? (
              <View className="mt-3 rounded-2xl border px-4 py-6" style={{ borderColor: colors.border }}>
                <Text className="text-center text-sm" style={{ color: colors.textMuted }}>
                  Loading transaction history...
                </Text>
              </View>
            ) : list.length === 0 ? (
              <View className="mt-3 rounded-2xl border px-4 py-6" style={{ borderColor: colors.border }}>
                <Text className="text-center text-sm" style={{ color: colors.textMuted }}>
                  Smart empty state: no {form.type} transactions yet.
                </Text>
              </View>
            ) : (
              list.map((item) => {
                const category = categoryById(categories, item.categoryId);
                return (
                  <View
                    key={item.id}
                    className="mt-3 flex-row items-center justify-between rounded-2xl border px-4 py-3"
                    style={{ borderColor: colors.border }}
                  >
                    <View>
                      <Text className="text-base font-semibold" style={{ color: colors.text }}>
                        {category?.name ?? 'Unknown'}
                      </Text>
                      <Text className="text-xs" style={{ color: colors.textMuted }}>
                        {item.date} {item.note ? `- ${item.note}` : ''}
                      </Text>
                    </View>
                    <Text className="text-base font-semibold" style={{ color: form.type === 'income' ? '#22C55E' : '#EF4444' }}>
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

type InputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
};

function Input({ label, placeholder, value, onChangeText, error }: InputProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View className="mt-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.text }}>
        {label}
      </Text>
      <View
        className="h-11 justify-center rounded-xl border px-3"
        style={{ borderColor: error ? '#EF4444' : colors.border, backgroundColor: isDark ? '#161A20' : '#F8FAFC' }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          style={{ color: colors.text, fontSize: 14 }}
        />
      </View>
      {error ? (
        <Text className="mt-1 text-xs" style={{ color: '#EF4444' }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
