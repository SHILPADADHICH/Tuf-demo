import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ScrollView, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { formatCurrency, useFinance } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

const { width } = Dimensions.get('window');

type SummaryScreenProps = { onToggleTheme: () => void };

export function SummaryScreen({ onToggleTheme }: SummaryScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { monthly } = useFinance();

  const spendingCategories = [
    { id: '1', name: 'Food', percent: 31, amount: '₹8.7k', color: '#6366F1' },
    { id: '2', name: 'Transport', percent: 11, amount: '₹4.4k', color: '#00D1A1' },
    { id: '3', name: 'Health', percent: 17, amount: '₹3.1k', color: '#F59E0B' },
    { id: '4', name: 'Other', percent: 41, amount: '₹7.3k', color: '#94A3B8' },
  ];

  const barData = [
    { month: 'Nov', height: 40 },
    { month: 'Dec', height: 60 },
    { month: 'Jan', height: 80 },
    { month: 'Feb', height: 50 },
    { month: 'Mar', height: 70 },
    { month: 'Apr', height: 90, active: true },
  ];

  const budget = 23480;
  const target = 30000;
  const budgetPercent = (budget / target) * 100;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>Analytics</Text>
        <Text className="text-sm font-medium mb-8" style={{ color: colors.textMuted }}>Your financial health</Text>

        {/* Month Selector */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity className="p-2">
            <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <Text className="text-base font-bold" style={{ color: colors.text }}>April 2026</Text>
          <TouchableOpacity className="p-2">
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Spending Breakdown Card */}
        <View 
          className="rounded-[32px] p-6 mb-8"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: colors.textMuted }}>
            Spending Breakdown
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="items-center justify-center">
              <DonutChart categories={spendingCategories} />
              <View className="absolute items-center">
                <Text className="text-xl font-bold" style={{ color: colors.text }}>₹23k</Text>
                <Text className="text-[10px] uppercase font-bold" style={{ color: colors.textMuted }}>Spent</Text>
              </View>
            </View>

            <View className="flex-1 ml-8">
              {spendingCategories.map((cat) => (
                <View key={cat.id} className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
                    <View>
                      <Text className="text-xs font-bold" style={{ color: colors.text }}>{cat.name}</Text>
                      <Text className="text-[10px]" style={{ color: colors.textMuted }}>{cat.percent}%</Text>
                    </View>
                  </View>
                  <Text className="text-xs font-bold" style={{ color: colors.text }}>{cat.amount}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 6-Month Spending */}
        <View 
          className="rounded-[32px] p-6 mb-8"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: colors.textMuted }}>
            6-Month Spending
          </Text>

          <View className="flex-row items-end justify-between h-32 px-2">
            {barData.map((data, index) => (
              <View key={index} className="items-center">
                <View 
                  className="w-8 rounded-lg"
                  style={{ 
                    height: data.height, 
                    backgroundColor: data.active ? colors.primary : colors.surfaceMuted 
                  }}
                />
                <Text className="text-[10px] font-bold mt-2" style={{ color: colors.textMuted }}>
                  {data.month}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Budget Card */}
        <View 
          className="rounded-[32px] p-6"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row items-center mb-6">
            <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-4">
              <View className="h-6 w-6 rounded-full border-2 border-primary items-center justify-center">
                <View className="h-1 w-1 rounded-full bg-primary" />
              </View>
            </View>
            <View>
              <Text className="text-xs font-bold" style={{ color: colors.textMuted }}>Monthly Budget</Text>
              <Text className="text-lg font-bold" style={{ color: colors.text }}>₹23,480</Text>
              <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                ₹6,520 remaining of ₹{target / 1000}k
              </Text>
            </View>
          </View>

          <View className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceMuted }}>
            <View 
              className="h-full rounded-full" 
              style={{ backgroundColor: colors.primary, width: `${budgetPercent}%` }} 
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function DonutChart({ categories }: { categories: any[] }) {
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  
  let currentOffset = 0;

  return (
    <Svg width={size} height={size}>
      {categories.map((cat, i) => {
        const strokeDasharray = `${(cat.percent / 100) * c} ${c}`;
        const strokeDashoffset = -currentOffset;
        currentOffset += (cat.percent / 100) * c;
        
        return (
          <Circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={cat.color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        );
      })}
    </Svg>
  );
}
