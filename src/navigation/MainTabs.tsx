import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { SummaryScreen } from '@/screens/summary/SummaryScreen';
import { TransactionsScreen } from '@/screens/transactions/TransactionsScreen';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { TabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

type MainTabsProps = { onToggleTheme: () => void };

export function MainTabs({ onToggleTheme }: MainTabsProps) {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 70,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          const icon =
            route.name === 'Home'
              ? 'home-outline'
              : route.name === 'Transactions'
                ? 'swap-horizontal-outline'
                : 'bar-chart-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">{() => <HomeScreen onToggleTheme={onToggleTheme} />}</Tab.Screen>
      <Tab.Screen name="Transactions">{() => <TransactionsScreen onToggleTheme={onToggleTheme} />}</Tab.Screen>
      <Tab.Screen name="Summary">{() => <SummaryScreen onToggleTheme={onToggleTheme} />}</Tab.Screen>
    </Tab.Navigator>
  );
}
