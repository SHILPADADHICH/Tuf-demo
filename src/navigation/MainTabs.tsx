import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
          backgroundColor: isDark ? 'rgba(19,20,31,0.92)' : 'rgba(255,255,255,0.95)',
          borderTopWidth: 0,
          height: 88,
          paddingBottom: 24,
          paddingTop: 10,
          position: 'absolute',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: 24,
          elevation: 24,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 1,
        },
        tabBarIcon: ({ color, focused }) => {
          let icon = '';
          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'Transactions') icon = focused ? 'layers' : 'layers-outline';
          else if (route.name === 'Analytics') icon = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Profile') icon = focused ? 'person' : 'person-outline';

          if (!focused) {
            return (
              <View className="h-10 w-10 items-center justify-center rounded-2xl">
                <Ionicons name={icon as any} size={21} color={color} />
              </View>
            );
          }

          return (
            <View className="items-center">
              <LinearGradient
                colors={['#9333EA', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-10 w-10 items-center justify-center rounded-2xl"
              >
                <Ionicons name={icon as any} size={21} color="#FFFFFF" />
              </LinearGradient>
              <View className="mt-1 h-1 w-1 rounded-full bg-purple-500" />
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
