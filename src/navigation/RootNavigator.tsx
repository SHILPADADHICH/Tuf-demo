import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { SummaryScreen } from '@/screens/summary/SummaryScreen';
import { TransactionsScreen } from '@/screens/transactions/TransactionsScreen';

const Tab = createBottomTabNavigator();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0B1220',
    card: '#111827',
    text: '#E5E7EB',
    border: 'rgba(148,163,184,0.2)',
    primary: '#7C3AED',
    notification: '#06B6D4',
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={appTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#111827',
            borderTopColor: 'rgba(148,163,184,0.2)',
          },
          tabBarActiveTintColor: '#7C3AED',
          tabBarInactiveTintColor: '#94A3B8',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="Summary" component={SummaryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
