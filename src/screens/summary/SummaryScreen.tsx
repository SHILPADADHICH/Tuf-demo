import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ScrollView, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppHeader } from '@/components/common/AppHeader';
import { formatCurrency, useFinance } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

type SummaryScreenProps = { onToggleTheme: () => void };

export function SummaryScreen({ onToggleTheme }: SummaryScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { loading, monthly } = useFinance();

  const totalFlow = monthly.income + monthly.expense;
  const incomeRatio = totalFlow > 0 ? monthly.income / totalFlow : 0;
  const expenseRatio = totalFlow > 0 ? monthly.expense / totalFlow : 0;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader onToggleTheme={onToggleTheme} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          Monthly Summary
        </Text>
        <Text className="mt-1 text-base" style={{ color: colors.textMuted }}>
          Income, expenses, and remaining balance overview.
        </Text>
        <Text className="mt-1 text-xs uppercase tracking-wide" style={{ color: colors.textMuted }}>
          {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </Text>

        <LinearGradient
          colors={isDark ? ['#111827', '#0B1220'] : ['#FFFFFF', '#EEF2FF']}
          className="mt-5 rounded-3xl border p-5"
          style={{ borderColor: colors.border }}
        >
          <View className="flex-row justify-between">
            <Metric label="Income" value={formatCurrency(monthly.income)} color="#22C55E" />
            <Metric label="Expenses" value={formatCurrency(monthly.expense)} color="#EF4444" />
            <Metric label="Balance" value={formatCurrency(monthly.balance)} color="#60A5FA" />
          </View>
        </LinearGradient>

        {loading ? (
          <View className="mt-5 items-center rounded-3xl border py-10" style={{ borderColor: colors.border }}>
            <Text style={{ color: colors.textMuted }}>Loading monthly analytics...</Text>
          </View>
        ) : totalFlow === 0 ? (
          <View className="mt-5 items-center rounded-3xl border px-6 py-10" style={{ borderColor: colors.border }}>
            <Text className="text-base font-semibold" style={{ color: colors.text }}>
              Nothing to summarize yet
            </Text>
            <Text className="mt-1 text-center text-sm" style={{ color: colors.textMuted }}>
              Add income or expense entries from the Transactions tab to see charts here.
            </Text>
          </View>
        ) : (
          <MotiView
            from={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 450 }}
            className="mt-5 items-center rounded-3xl border py-6"
            style={{ borderColor: colors.border }}
          >
            <DonutChart incomeRatio={incomeRatio} expenseRatio={expenseRatio} />
            <View className="mt-5 w-full px-5">
              <Legend name="Income" color="#22C55E" value={formatCurrency(monthly.income)} />
              <Legend name="Expenses" color="#EF4444" value={formatCurrency(monthly.expense)} />
            </View>
          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}

function DonutChart({ incomeRatio, expenseRatio }: { incomeRatio: number; expenseRatio: number }) {
  const size = 170;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#1F2937" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#22C55E"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c * incomeRatio} ${c}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#EF4444"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c * expenseRatio} ${c}`}
          strokeDashoffset={-c * incomeRatio}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View className="absolute items-center">
        <Text className="text-xs text-slate-400">This Month</Text>
      </View>
    </View>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View>
      <Text className="text-xs" style={{ color: '#94A3B8' }}>
        {label}
      </Text>
      <Text className="mt-1 text-base font-semibold" style={{ color }}>
        {value}
      </Text>
    </View>
  );
}

function Legend({ name, color, value }: { name: string; color: string; value: string }) {
  return (
    <View className="mt-2 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <Text className="ml-2 text-sm text-slate-300">{name}</Text>
      </View>
      <Text className="text-sm text-slate-300">{value}</Text>
    </View>
  );
}
