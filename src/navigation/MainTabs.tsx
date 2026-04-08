import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { SummaryScreen } from '@/screens/summary/SummaryScreen';
import { TransactionsScreen } from '@/screens/transactions/TransactionsScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
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
          backgroundColor: isDark ? '#0D0F16' : '#FFFFFF',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
          position: 'absolute',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 20,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          let icon = '';
          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'Transactions') icon = focused ? 'layers' : 'layers-outline';
          else if (route.name === 'Analytics') icon = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Profile') icon = focused ? 'person' : 'person-outline';

          return (
            <View 
              className="h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: focused ? colors.primary + '15' : 'transparent' }}
            >
              <Ionicons name={icon as any} size={22} color={focused ? colors.primary : color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home">
        {() => <HomeScreen onToggleTheme={onToggleTheme} />}
      </Tab.Screen>
      <Tab.Screen name="Transactions">
        {() => <TransactionsScreen onToggleTheme={onToggleTheme} />}
      </Tab.Screen>
      <Tab.Screen name="Analytics">
        {() => <SummaryScreen onToggleTheme={onToggleTheme} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <ProfileScreen onToggleTheme={onToggleTheme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
