import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Pressable, StyleSheet } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type FABProps = {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function FAB({ onPress, icon = 'add' }: FABProps) {
  const { isDark } = useAppTheme();

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.5, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      style={styles.container}
    >
      <Pressable
        onPress={onPress}
        className="h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
        style={{ 
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 5
        }}
      >
        <Ionicons name={icon} size={28} color="#000" />
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    zIndex: 50,
  },
});
