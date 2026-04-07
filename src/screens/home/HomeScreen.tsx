import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useFinance, formatCurrency, categoryById } from '@/store/finance/FinanceProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

const { width } = Dimensions.get('window');

type HomeScreenProps = { onToggleTheme: () => void };

export function HomeScreen({ onToggleTheme }: HomeScreenProps) {
  const { colors, isDark } = useAppTheme();
  const { loading, total, monthly, transactions, categories } = useFinance();

  const budget = 3000;
  const progressPercent = Math.min((monthly.expense / budget) * 100, 100);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between px-6 mb-8">
          <View>
            <Text className="text-base text-gray-500 font-medium">Welcome back,</Text>
            <Text className="text-3xl font-extrabold" style={{ color: colors.text }}>Alex Johnson</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <HeaderButton icon="search-outline" />
            <HeaderButton icon="notifications-outline" badge={3} />
          </View>
        </View>

        {/* High-Fidelity Balance Card */}
        <View className="px-5 mb-8">
          <LinearGradient
            colors={['#7C3AED', '#3B82F6', '#0EA5E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[40px] p-8 shadow-2xl"
          >
            <Text className="text-white/80 text-sm font-semibold mb-2">Total Balance</Text>
            <Text className="text-white text-5xl font-black mb-8">
              {formatCurrency(total.balance)}
            </Text>

            <View className="flex-row gap-4">
              <BalanceSubCard 
                label="Income" 
                amount={total.income} 
                icon="arrow-up-thin" 
                iconBg="rgba(255,255,255,0.15)"
                iconColor="#4ADE80"
              />
              <BalanceSubCard 
                label="Expenses" 
                amount={total.expense} 
                icon="arrow-down-thin" 
                iconBg="rgba(255,255,255,0.15)"
                iconColor="#F87171"
              />
            </View>
          </LinearGradient>
        </View>

        {/* Spending Card with Circular Progress */}
        <View className="px-5">
          <View 
            className="rounded-[40px] p-8"
            style={{ 
              backgroundColor: isDark ? '#111418' : '#FFFFFF',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 20,
              elevation: 4
            }}
          >
            <View className="flex-row justify-between mb-8">
              <View>
                <Text className="text-gray-500 text-sm font-bold mb-1">Spending This Month</Text>
                <Text className="text-3xl font-black" style={{ color: colors.text }}>
                  {formatCurrency(monthly.expense)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-500 text-sm font-bold mb-1">Budget</Text>
                <Text className="text-3xl font-black" style={{ color: colors.text }}>
                  {formatCurrency(budget)}
                </Text>
              </View>
            </View>

            <View className="items-center justify-center">
              <CircularProgress percentage={progressPercent} />
              <View className="absolute items-center">
                <Text className="text-4xl font-black" style={{ color: colors.text }}>{Math.round(progressPercent)}%</Text>
                <Text className="text-xs font-bold text-gray-500 uppercase">Used</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function HeaderButton({ icon, badge }: { icon: any, badge?: number }) {
  const { colors, isDark } = useAppTheme();
  return (
    <View 
      className="h-14 w-14 items-center justify-center rounded-2xl border"
      style={{ 
        backgroundColor: isDark ? '#1F242B' : '#F9FAFB',
        borderColor: colors.border
      }}
    >
      <Ionicons name={icon} size={24} color={colors.text} />
      {badge ? (
        <View className="absolute -right-1 -top-1 h-6 w-6 items-center justify-center rounded-full bg-rose-500 border-2" style={{ borderColor: 'white' }}>
          <Text className="text-[10px] font-black text-white">{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

function BalanceSubCard({ label, amount, icon, iconBg, iconColor }: any) {
  return (
    <View 
      className="flex-1 p-5 rounded-[30px]"
      style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
    >
      <View 
        className="h-10 w-10 items-center justify-center rounded-full mb-3"
        style={{ backgroundColor: iconBg }}
      >
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      </View>
      <Text className="text-white/70 text-xs font-bold mb-2">{label}</Text>
      <Text className="text-white text-xl font-black">{formatCurrency(amount)}</Text>
    </View>
  );
}

function CircularProgress({ percentage }: { percentage: number }) {
  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#F3F4F6"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#4F46E5"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="none"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}
