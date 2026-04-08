import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MotiView } from "moti";
import { View } from "react-native";

import { HomeScreen } from "@/screens/home/HomeScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { SummaryScreen } from "@/screens/summary/SummaryScreen";
import { TransactionsScreen } from "@/screens/transactions/TransactionsScreen";
import { useAppTheme } from "@/theme/ThemeProvider";
import type { TabParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<TabParamList>();

type MainTabsProps = { onToggleTheme: () => void; onLogout: () => void };

export function MainTabs({ onToggleTheme, onLogout }: MainTabsProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark
            ? "rgba(0,0,0,0.95)"
            : "rgba(255,255,255,0.95)",
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 30,
          paddingTop: 12,
          position: "absolute",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.5 : 0.1,
          shadowRadius: 20,
          elevation: 20,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? "#4B5563" : "#94A3B8",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "900",
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ color, focused }) => {
          let icon = "";
          if (route.name === "Home") icon = focused ? "home" : "home-outline";
          else if (route.name === "Transactions")
            icon = focused ? "receipt" : "receipt-outline";
          else if (route.name === "Balances")
            icon = focused ? "wallet" : "wallet-outline";
          else if (route.name === "Profile")
            icon = focused ? "person" : "person-outline";

          return (
            <View className="items-center justify-center">
              {focused && (
                <MotiView
                  from={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute h-10 w-10 rounded-2xl"
                  style={{ backgroundColor: `${colors.primary}15` }}
                />
              )}
              <Ionicons name={icon as any} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} onToggleTheme={onToggleTheme} />}
      </Tab.Screen>
      <Tab.Screen name="Transactions">
        {(props) => (
          <TransactionsScreen {...props} onToggleTheme={onToggleTheme} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Balances">
        {(props) => <SummaryScreen {...props} onToggleTheme={onToggleTheme} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileScreen
            {...props}
            onToggleTheme={onToggleTheme}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
