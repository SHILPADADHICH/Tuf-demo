import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { GradientOrbs } from '@/components/common/GradientOrbs';
import { categoryById, formatCurrency, useFinance } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

type HomeScreenProps = { onToggleTheme: () => void };

export function HomeScreen({ onToggleTheme }: HomeScreenProps) {
  const { colors } = useAppTheme();
  const { loading, total, transactions, categories } = useFinance();
  const budget = 4200;
  const spentPct = Math.min((total.expense / budget) * 100, 100);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <GradientOrbs />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 120 }}>
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text className="text-sm" style={{ color: colors.textMuted }}>Good morning,</Text>
            <Text className="text-3xl font-bold" style={{ color: colors.text }}>Jordan</Text>
          </View>

          <View className="flex-row gap-3">
            <Pressable onPress={onToggleTheme} className="h-12 w-12 items-center justify-center rounded-2xl border" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
              <Ionicons name="moon-outline" size={20} color={colors.text} />
            </Pressable>
            <Pressable className="h-12 w-12 items-center justify-center rounded-2xl border" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
              <Ionicons name="search-outline" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <LinearGradient colors={['#9333EA', '#3B82F6']} className="rounded-3xl p-5">
          <Text className="text-sm text-white/80">Total Balance</Text>
          <Text className="mt-1 text-4xl font-bold text-white">{formatCurrency(total.balance)}</Text>

          <View className="mt-5 flex-row gap-3">
            <MetricCard label="Income" value={formatCurrency(total.income)} icon="trending-up" tone="income" />
            <MetricCard label="Expenses" value={formatCurrency(total.expense)} icon="trending-down" tone="expense" />
          </View>
        </LinearGradient>

        <View className="mt-7 flex-row items-center justify-between">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>Recent Transactions</Text>
          <Text className="text-sm font-semibold" style={{ color: '#9333EA' }}>See all</Text>
        </View>

        <View className="mt-5 rounded-3xl border p-5" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
          <Text className="text-sm" style={{ color: colors.textMuted }}>Spending This Month</Text>
          <View className="mt-3 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>{formatCurrency(total.expense)}</Text>
              <Text className="mt-1 text-sm font-semibold" style={{ color: spentPct > 100 ? '#FF6B6B' : '#6BCF7F' }}>
                {spentPct > 100 ? `${formatCurrency(total.expense - budget)} over budget` : `${formatCurrency(budget - total.expense)} left`}
              </Text>
            </View>
            <ProgressRing value={spentPct} />
          </View>
        </View>

        {loading ? (
          <View className="mt-3 rounded-2xl border p-6" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
            <Text style={{ color: colors.textMuted }}>Loading transactions...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View className="mt-3 rounded-2xl border p-6" style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}>
            <Text className="text-center" style={{ color: colors.textMuted }}>No transactions yet.</Text>
          </View>
        ) : (
          transactions.slice(0, 5).map((item, index) => {
            const category = categoryById(categories, item.categoryId);
            const isIncome = item.type === 'income';
            return (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 8 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', delay: index * 60 }}
                className="mt-3 flex-row items-center justify-between rounded-2xl border px-4 py-3"
                style={{ borderColor: colors.border, backgroundColor: `${colors.surface}CC` }}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${category?.color ?? '#64748B'}22` }}>
                    <Ionicons name={(category?.icon as never) ?? 'grid-outline'} size={18} color={category?.color ?? '#64748B'} />
                  </View>
                  <View>
                    <Text className="text-base font-semibold" style={{ color: colors.text }}>{category?.name ?? 'Unknown'}</Text>
                    <Text className="text-xs" style={{ color: colors.textMuted }}>{item.date}</Text>
                  </View>
                </View>
                <Text className="text-base font-semibold" style={{ color: isIncome ? '#6BCF7F' : '#FF6B6B' }}>
                  {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                </Text>
              </MotiView>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function ProgressRing({ value }: { value: number }) {
  const size = 88;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ratio = Math.min(value / 100, 1);

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(148,163,184,0.25)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#9333EA"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c * ratio} ${c}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View className="absolute">
        <Text className="text-xs font-bold text-slate-300">{value.toFixed(0)}%</Text>
      </View>
    </View>
  );
}

function MetricCard({ label, value, icon, tone }: { label: string; value: string; icon: string; tone: 'income' | 'expense' }) {
  return (
    <View className="flex-1 rounded-2xl border border-white/20 bg-white/10 p-3">
      <View className="mb-1 flex-row items-center gap-2">
        <View className="h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: tone === 'income' ? 'rgba(107,207,127,0.2)' : 'rgba(255,107,107,0.2)' }}>
          <Ionicons name={icon as never} size={14} color={tone === 'income' ? '#6BCF7F' : '#FF6B6B'} />
        </View>
        <Text className="text-xs text-white/80">{label}</Text>
      </View>
      <Text className="text-base font-semibold text-white">{value}</Text>
    </View>
  );
}
