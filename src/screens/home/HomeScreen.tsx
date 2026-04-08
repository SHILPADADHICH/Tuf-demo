import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { 
  Dimensions, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  FlatList
} from 'react-native';
import { useFinance, formatCurrency, categoryById } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

const { width } = Dimensions.get('window');

type HomeScreenProps = { onToggleTheme: () => void };

export function HomeScreen({ onToggleTheme }: HomeScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { transactions, total, categories, monthly } = useFinance();

  // Mock data for quick actions
  const quickActions = [
    { id: 'add', icon: 'add-outline', label: 'Add', color: '#6366F1' },
    { id: 'send', icon: 'arrow-forward-outline', label: 'Send', color: '#6366F1' },
    { id: 'request', icon: 'arrow-back-outline', label: 'Request', color: '#6366F1' },
    { id: 'history', icon: 'time-outline', label: 'History', color: '#6366F1' },
  ];

  const recentTransactions = transactions.slice(0, 4);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 mb-8">
          <View>
            <Text className="text-sm font-medium" style={{ color: colors.textMuted }}>Good morning</Text>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>Arjun Sharma</Text>
          </View>
          <View 
            className="h-12 w-12 rounded-full items-center justify-center" 
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-bold text-lg">AS</Text>
          </View>
        </View>

        {/* Balance Card */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={isDark ? ['#4F46E5', '#1E1B4B'] : ['#6366F1', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[32px] p-6 shadow-lg"
          >
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">Total Balance</Text>
            <Text className="text-white text-4xl font-bold mb-8">
              ₹1,84,520
            </Text>

            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <View className="h-8 w-8 rounded-full items-center justify-center bg-white/20 mr-3">
                  <Ionicons name="arrow-down-outline" size={16} color="white" />
                </View>
                <View>
                  <Text className="text-white/60 text-[10px] font-bold uppercase">Income</Text>
                  <Text className="text-white text-base font-bold">₹62,000</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="h-8 w-8 rounded-full items-center justify-center bg-white/20 mr-3">
                  <Ionicons name="arrow-up-outline" size={16} color="white" />
                </View>
                <View>
                  <Text className="text-white/60 text-[10px] font-bold uppercase">Expenses</Text>
                  <Text className="text-white text-base font-bold">₹23,480</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between px-6 mb-8">
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} className="items-center">
              <View 
                className="h-16 w-16 rounded-[24px] items-center justify-center mb-2"
                style={{ 
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 4
                }}
              >
                <Ionicons name={action.icon as any} size={24} color={colors.textMuted} />
              </View>
              <Text className="text-xs font-medium" style={{ color: colors.textMuted }}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>Transactions</Text>
            <TouchableOpacity>
              <Text className="text-sm font-bold" style={{ color: colors.primary }}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx, idx) => (
              <TransactionItem key={tx.id} item={tx} index={idx} colors={colors} categories={categories} />
            ))
          ) : (
            <View className="p-8 items-center bg-surface rounded-3xl" style={{ backgroundColor: colors.surface }}>
              <Ionicons name="receipt-outline" size={40} color={colors.textMuted} />
              <Text className="mt-2 text-sm font-medium" style={{ color: colors.textMuted }}>No transactions yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button helper (optional) */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 h-16 w-16 rounded-full items-center justify-center shadow-2xl"
        style={{ backgroundColor: colors.primary, elevation: 10 }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

function TransactionItem({ item, index, colors, categories }: any) {
  const category = categoryById(categories, item.categoryId);
  const isIncome = item.type === 'income';

  return (
    <MotiView 
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100 }}
      className="flex-row items-center p-4 rounded-3xl mb-3"
      style={{ backgroundColor: colors.surface }}
    >
      <View 
        className="h-12 w-12 rounded-2xl items-center justify-center mr-4"
        style={{ backgroundColor: category?.color || colors.primary + '20' }}
      >
        <Ionicons name={(category?.icon || 'card-outline') as any} size={22} color="white" />
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-bold" style={{ color: colors.text }}>{item.title}</Text>
        <Text className="text-xs font-medium" style={{ color: colors.textMuted }}>
          {category?.name || 'Uncategorized'} • {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>

      <Text className={`text-base font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </MotiView>
  );
}
