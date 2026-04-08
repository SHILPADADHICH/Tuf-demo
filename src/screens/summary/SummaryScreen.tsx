import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ScrollView, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { GradientOrbs } from '@/components/common/GradientOrbs';
import { formatCurrency, useFinance } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

type SummaryScreenProps = { onToggleTheme: () => void };

export function SummaryScreen({ onToggleTheme }: SummaryScreenProps) {
  const { colors } = useAppTheme();
  const { loading, monthly } = useFinance();

  const total = monthly.income + monthly.expense;
  const incomeRatio = total ? monthly.income / total : 0;
  const expenseRatio = total ? monthly.expense / total : 0;
  const trendData = [
    { month: 'Jan', income: 3200, expenses: 2700 },
    { month: 'Feb', income: 3600, expenses: 2900 },
    { month: 'Mar', income: 4100, expenses: 3100 },
    { month: 'Apr', income: monthly.income || 3500, expenses: monthly.expense || 2200 },
  ];
  const topCategories = [
    { name: 'Food', amount: monthly.expense * 0.35, color: '#FF6B6B' },
    { name: 'Transport', amount: monthly.expense * 0.22, color: '#4ECDC4' },
    { name: 'Shopping', amount: monthly.expense * 0.18, color: '#FFD93D' },
  ];
  const maxCat = Math.max(1, ...topCategories.map((c) => c.amount));

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <GradientOrbs />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 110 }}>
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>Analytics</Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center rounded-2xl border px-3 py-2" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
              <Ionicons name="calendar-outline" size={15} color={colors.text} />
              <Text className="ml-2 text-xs" style={{ color: colors.text }}>April 2026</Text>
            </View>
            <Ionicons name="moon-outline" size={20} color={colors.text} onPress={onToggleTheme} />
          </View>
        </View>

        <View className="mb-4 flex-row gap-3">
          <LinearGradient colors={['#16A34A', '#22C55E']} className="flex-1 rounded-2xl p-4">
            <Text className="text-xs text-white/80">Income</Text>
            <Text className="mt-1 text-xl font-bold text-white">{formatCurrency(monthly.income)}</Text>
          </LinearGradient>
          <LinearGradient colors={['#DC2626', '#F43F5E']} className="flex-1 rounded-2xl p-4">
            <Text className="text-xs text-white/80">Expenses</Text>
            <Text className="mt-1 text-xl font-bold text-white">{formatCurrency(monthly.expense)}</Text>
          </LinearGradient>
        </View>

        <View className="rounded-3xl border p-5" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
          <Text className="mb-4 text-lg font-semibold" style={{ color: colors.text }}>Income vs Expenses</Text>
          {loading ? (
            <Text style={{ color: colors.textMuted }}>Loading chart...</Text>
          ) : total === 0 ? (
            <Text style={{ color: colors.textMuted }}>Add some transactions to see analytics.</Text>
          ) : (
            <View className="items-center">
              <Donut incomeRatio={incomeRatio} expenseRatio={expenseRatio} />
              <View className="mt-4 w-full">
                <Legend color="#6BCF7F" label="Income" value={formatCurrency(monthly.income)} />
                <Legend color="#FF6B6B" label="Expenses" value={formatCurrency(monthly.expense)} />
              </View>
            </View>
          )}
        </View>

        <MotiView from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500 }} className="mt-5 rounded-3xl border p-5" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
          <Text className="text-lg font-semibold" style={{ color: colors.text }}>Balance</Text>
          <Text className="mt-1 text-2xl font-bold" style={{ color: monthly.balance >= 0 ? '#6BCF7F' : '#FF6B6B' }}>
            {formatCurrency(monthly.balance)}
          </Text>
        </MotiView>

        <View className="mt-5 rounded-3xl border p-5" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
          <Text className="mb-4 text-lg font-semibold" style={{ color: colors.text }}>Monthly Trend</Text>
          <View className="flex-row items-end justify-between">
            {trendData.map((item) => (
              <View key={item.month} className="items-center">
                <View className="h-24 w-4 justify-end rounded-full bg-slate-700/30">
                  <View className="rounded-full bg-emerald-400" style={{ height: Math.max(8, (item.income / 4500) * 96) }} />
                </View>
                <View className="mt-1 h-24 w-4 justify-end rounded-full bg-slate-700/30">
                  <View className="rounded-full bg-rose-400" style={{ height: Math.max(8, (item.expenses / 4500) * 96) }} />
                </View>
                <Text className="mt-2 text-xs" style={{ color: colors.textMuted }}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-5 rounded-3xl border p-5" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
          <Text className="mb-4 text-lg font-semibold" style={{ color: colors.text }}>Top Spending Categories</Text>
          {topCategories.map((category) => (
            <View key={category.name} className="mb-3">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-sm" style={{ color: colors.text }}>{category.name}</Text>
                <Text className="text-sm font-semibold" style={{ color: colors.text }}>{formatCurrency(category.amount)}</Text>
              </View>
              <View className="h-2 rounded-full bg-slate-700/30">
                <View className="h-2 rounded-full" style={{ width: `${(category.amount / maxCat) * 100}%`, backgroundColor: category.color }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Donut({ incomeRatio, expenseRatio }: { incomeRatio: number; expenseRatio: number }) {
  const size = 170;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke="#1F2937" strokeWidth={stroke} fill="none" />
      <Circle cx={size / 2} cy={size / 2} r={r} stroke="#6BCF7F" strokeWidth={stroke} fill="none" strokeDasharray={`${c * incomeRatio} ${c}`} strokeLinecap="round" rotation="-90" origin={`${size / 2}, ${size / 2}`} />
      <Circle cx={size / 2} cy={size / 2} r={r} stroke="#FF6B6B" strokeWidth={stroke} fill="none" strokeDasharray={`${c * expenseRatio} ${c}`} strokeDashoffset={-c * incomeRatio} strokeLinecap="round" rotation="-90" origin={`${size / 2}, ${size / 2}`} />
    </Svg>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View className="mt-2 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <Text className="ml-2 text-sm text-slate-300">{label}</Text>
      </View>
      <Text className="text-sm text-slate-300">{value}</Text>
    </View>
  );
}
