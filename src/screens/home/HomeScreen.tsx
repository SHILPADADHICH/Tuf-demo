import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ScrollView, Text, View } from 'react-native';

import { AppHeader } from '@/components/common/AppHeader';
import { categoryById, formatCurrency, useFinance } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

type HomeScreenProps = { onToggleTheme: () => void };

export function HomeScreen({ onToggleTheme }: HomeScreenProps) {
  const { colors } = useAppTheme();
  const { loading, total, monthly, transactions, categories } = useFinance();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader onToggleTheme={onToggleTheme} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 450 }}
        >
          <LinearGradient
            colors={['#3B82F6', '#7C3AED', '#0EA5E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-5"
          >
            <Text className="text-sm text-white/80">Remaining Balance</Text>
            <Text className="mt-1 text-3xl font-bold text-white">{formatCurrency(total.balance)}</Text>
            <View className="mt-5 flex-row justify-between">
              <View>
                <Text className="text-xs text-white/80">Income</Text>
                <Text className="text-lg font-semibold text-white">{formatCurrency(total.income)}</Text>
              </View>
              <View>
                <Text className="text-xs text-white/80">Expense</Text>
                <Text className="text-lg font-semibold text-white">{formatCurrency(total.expense)}</Text>
              </View>
              <View>
                <Text className="text-xs text-white/80">This Month</Text>
                <Text className="text-lg font-semibold text-white">{formatCurrency(monthly.balance)}</Text>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl border px-3 py-3" style={{ borderColor: colors.border }}>
            <Text className="text-xs" style={{ color: colors.textMuted }}>
              This Month Income
            </Text>
            <Text className="mt-1 text-base font-semibold text-emerald-400">{formatCurrency(monthly.income)}</Text>
          </View>
          <View className="flex-1 rounded-2xl border px-3 py-3" style={{ borderColor: colors.border }}>
            <Text className="text-xs" style={{ color: colors.textMuted }}>
              This Month Expense
            </Text>
            <Text className="mt-1 text-base font-semibold text-rose-400">{formatCurrency(monthly.expense)}</Text>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-2xl font-semibold" style={{ color: colors.text }}>
            Recent Transactions
          </Text>

          {loading ? (
            <View className="mt-3 rounded-2xl border px-4 py-8" style={{ borderColor: colors.border }}>
              <Text className="text-center text-base" style={{ color: colors.textMuted }}>
                Loading your transactions...
              </Text>
            </View>
          ) : transactions.length === 0 ? (
            <View className="mt-3 rounded-2xl border px-4 py-8" style={{ borderColor: colors.border }}>
              <Text className="text-center text-base" style={{ color: colors.textMuted }}>
                No transactions yet. Add one from the Transactions tab.
              </Text>
            </View>
          ) : (
            transactions.slice(0, 5).map((item) => {
              const category = categoryById(categories, item.categoryId);
              const isIncome = item.type === 'income';
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
                      {item.date}  {item.note ? `• ${item.note}` : ''}
                    </Text>
                  </View>

                  <Text className="text-base font-semibold" style={{ color: isIncome ? '#22C55E' : '#EF4444' }}>
                    {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
