import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { 
  ScrollView, 
  Text, 
  View, 
  Switch, 
  TouchableOpacity 
} from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

type ProfileScreenProps = { onToggleTheme: () => void };

export function ProfileScreen({ onToggleTheme }: ProfileScreenProps) {
  const { colors, isDark } = useAppTheme();
  const [notifications, setNotifications] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Profile</Text>

        {/* Profile Card */}
        <LinearGradient
          colors={isDark ? ['#4F46E5', '#1E1B4B'] : ['#6366F1', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[32px] p-6 mb-8 flex-row items-center"
        >
          <View 
            className="h-16 w-16 rounded-full bg-white/20 items-center justify-center mr-6 border-2 border-white/30"
          >
            <Text className="text-white text-2xl font-bold">AS</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">Arjun Sharma</Text>
            <Text className="text-white/70 text-xs mb-2">arjun.sharma@gmail.com</Text>
            <View className="bg-white/20 self-start px-3 py-1 rounded-full border border-white/30">
              <Text className="text-white text-[10px] font-bold">Premium Member</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View className="flex-row justify-between mb-8">
          <StatCard label="Net Worth" value="₹1.84L" colors={colors} />
          <StatCard label="Savings Rate" value="62%" highlight colors={colors} />
        </View>

        {/* Settings List */}
        <View className="rounded-[32px] p-4" style={{ backgroundColor: colors.surface }}>
          <SettingItem 
            icon="moon-outline" 
            label="Dark Mode" 
            value={isDark} 
            onValueChange={onToggleTheme}
            type="toggle"
            colors={colors}
          />
          <SettingItem 
            icon="notifications-outline" 
            label="Notifications" 
            value={notifications} 
            onValueChange={setNotifications}
            type="toggle"
            colors={colors}
          />
          <SettingItem 
            icon="wallet-outline" 
            label="Monthly Budget" 
            rightText="₹32,000"
            colors={colors}
          />
          <SettingItem 
            icon="lock-closed-outline" 
            label="Privacy & Security" 
            colors={colors}
          />
          <SettingItem 
            icon="download-outline" 
            label="Export Data" 
            colors={colors}
          />
          <SettingItem 
            icon="log-out-outline" 
            label="Sign Out" 
            labelStyle={{ color: colors.danger }}
            colors={colors}
            hideBorder
          />
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, highlight, colors }: any) {
  return (
    <View 
      className="flex-1 rounded-3xl p-5 mx-1"
      style={{ backgroundColor: colors.surface }}
    >
      <Text className="text-[10px] font-bold uppercase mb-1" style={{ color: colors.textMuted }}>{label}</Text>
      <Text className="text-lg font-bold" style={{ color: highlight ? colors.success : colors.text }}>{value}</Text>
    </View>
  );
}

function SettingItem({ 
  icon, 
  label, 
  value, 
  onValueChange, 
  type = 'link', 
  rightText,
  labelStyle,
  colors,
  hideBorder
}: any) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      className={`flex-row items-center py-4 px-2 ${!hideBorder ? 'border-b' : ''}`}
      style={{ borderBottomColor: colors.border }}
    >
      <View className="h-10 w-10 rounded-2xl bg-slate-100 items-center justify-center mr-4" style={{ backgroundColor: colors.surfaceMuted }}>
        <Ionicons name={icon} size={20} color={labelStyle?.color || colors.primary} />
      </View>
      
      <Text className="flex-1 text-sm font-bold" style={labelStyle || { color: colors.text }}>{label}</Text>
      
      {type === 'toggle' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
        />
      ) : (
        <View className="flex-row items-center">
          {rightText && (
            <Text className="text-xs font-bold mr-2" style={{ color: colors.textMuted }}>{rightText}</Text>
          )}
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
}
