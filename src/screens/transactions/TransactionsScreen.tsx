import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { categoryById, formatCurrency, useFinance } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { TransactionInput } from '@/types/finance';

const { width } = Dimensions.get('window');

type TransactionsScreenProps = { onToggleTheme: () => void };

export function TransactionsScreen({ onToggleTheme }: TransactionsScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { categories, addTransaction } = useFinance();
  
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('2,400');
  const [categoryId, setCategoryId] = useState('food');
  const [date, setDate] = useState('Apr 08, 2026');
  const [account, setAccount] = useState('HDFC Savings');
  const [note, setNote] = useState('');

  const handleSave = () => {
    addTransaction({
      amount: parseFloat(amount.replace(/,/g, '')),
      categoryId,
      date: new Date().toISOString(),
      note,
      type,
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Balance Card Section */}
        <View className="pt-16 px-6 pb-12 overflow-hidden">
          <LinearGradient
            colors={isDark ? ['#1A1C2E', '#0D0F16'] : ['#E0E7FF', '#F1F5F9']}
            className="rounded-[40px] p-8"
          >
            <Text className="text-center text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
              Total Balance
            </Text>
            <Text className="text-center text-4xl font-bold" style={{ color: colors.text }}>
              ₹1,84,520
            </Text>
          </LinearGradient>
        </View>

        {/* New Transaction Form */}
        <View 
          className="flex-1 rounded-t-[48px] px-6 pt-8 -mt-8"
          style={{ backgroundColor: isDark ? '#1A1D27' : '#FFFFFF', minHeight: 600 }}
        >
          {/* Handle bar */}
          <View className="w-12 h-1 rounded-full bg-slate-400/30 self-center mb-8" />
          
          <Text className="text-2xl font-bold mb-6" style={{ color: colors.text }}>New Transaction</Text>

          {/* Type Toggle */}
          <View className="flex-row bg-slate-100 p-1.5 rounded-3xl mb-8" style={{ backgroundColor: colors.surfaceMuted }}>
            <TouchableOpacity 
              onPress={() => setType('income')}
              className={`flex-1 py-3 items-center rounded-2xl ${type === 'income' ? 'bg-white shadow-sm' : ''}`}
            >
              <Text className={`text-sm font-bold ${type === 'income' ? 'text-black' : 'text-slate-500'}`}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setType('expense')}
              className={`flex-1 py-3 items-center rounded-2xl ${type === 'expense' ? 'bg-indigo-600 shadow-md' : ''}`}
              style={type === 'expense' ? { backgroundColor: colors.primary } : {}}
            >
              <Text className={`text-sm font-bold ${type === 'expense' ? 'text-white' : 'text-slate-500'}`}>Expense</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Display */}
          <View className="items-center mb-8">
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold mr-2" style={{ color: colors.text }}>₹</Text>
              <TextInput 
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="text-4xl font-bold"
                style={{ color: colors.text }}
              />
            </View>
          </View>

          {/* Category Icons Row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-6 px-6">
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => setCategoryId(cat.id)}
                className="items-center mr-6"
              >
                <View 
                  className="h-14 w-14 rounded-2xl items-center justify-center mb-2"
                  style={{ 
                    backgroundColor: categoryId === cat.id ? colors.primary : colors.surfaceMuted,
                    shadowColor: colors.primary,
                    shadowOpacity: categoryId === cat.id ? 0.3 : 0,
                    shadowRadius: 10,
                  }}
                >
                  <Ionicons 
                    name={cat.icon as any} 
                    size={24} 
                    color={categoryId === cat.id ? 'white' : colors.textMuted} 
                  />
                </View>
                <Text className="text-[10px] font-bold" style={{ color: categoryId === cat.id ? colors.text : colors.textMuted }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Meta Data Grid */}
          <View className="flex-row mb-6 gap-4">
            <View className="flex-1">
              <Text className="text-[10px] font-bold uppercase mb-2" style={{ color: colors.textMuted }}>Date</Text>
              <TouchableOpacity 
                className="p-4 rounded-2xl flex-row items-center justify-between"
                style={{ backgroundColor: colors.surfaceMuted }}
              >
                <Text className="text-xs font-bold" style={{ color: colors.text }}>{date}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold uppercase mb-2" style={{ color: colors.textMuted }}>Account</Text>
              <TouchableOpacity 
                className="p-4 rounded-2xl flex-row items-center justify-between"
                style={{ backgroundColor: colors.surfaceMuted }}
              >
                <Text className="text-xs font-bold" style={{ color: colors.text }}>{account}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Note Input */}
          <View className="mb-8">
            <Text className="text-[10px] font-bold uppercase mb-2" style={{ color: colors.textMuted }}>Note</Text>
            <TextInput 
              placeholder="Add a note..."
              placeholderTextColor={colors.textMuted}
              value={note}
              onChangeText={setNote}
              className="p-4 rounded-2xl text-xs font-bold"
              style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleSave}
            className="rounded-[24px] py-5 items-center shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-base font-bold">Save Transaction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
