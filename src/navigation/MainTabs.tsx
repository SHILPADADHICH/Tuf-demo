import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { SummaryScreen } from '@/screens/summary/SummaryScreen';
import { TransactionsScreen } from '@/screens/transactions/TransactionsScreen';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { TabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

type MainTabsProps = { onToggleTheme: () => void };

export function MainTabs({ onToggleTheme }: MainTabsProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#111418' : '#FFFFFF',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 15,
          elevation: 10,
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: isDark ? '#4B5563' : '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          let icon = '';
          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'Transactions') icon = focused ? 'list' : 'list-outline';
          else if (route.name === 'Analytics') icon = focused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'Profile') icon = focused ? 'person' : 'person-outline';

          return (
            <View 
              className="h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: focused ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}
            >
              <Ionicons name={icon as any} size={24} color={focused ? '#6366F1' : color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home">{() => <HomeScreen onToggleTheme={onToggleTheme} />}</Tab.Screen>
      <Tab.Screen name="Transactions">{() => <TransactionsScreen onToggleTheme={onToggleTheme} />}</Tab.Screen>
      <Tab.Screen name="Analytics">{() => <SummaryScreen onToggleTheme={onToggleTheme} />}</Tab.Screen>
      <Tab.Screen name="Profile">
        {() => (
          <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
            <Text className="text-xl font-bold" style={{ color: colors.text }}>Profile Screen</Text>
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
