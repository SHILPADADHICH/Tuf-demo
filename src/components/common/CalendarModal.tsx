import { useAppTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  selectedDate: string;
};

export function CalendarModal({ visible, onClose, onSelectDate, selectedDate }: CalendarModalProps) {
  const { colors, isDark } = useAppTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = [];
  const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  // Padding for first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    const d = new Date(selectedDate);
    return (
      day === d.getDate() &&
      currentMonth.getMonth() === d.getMonth() &&
      currentMonth.getFullYear() === d.getFullYear()
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF', borderColor: colors.border }]}>
          <View style={styles.header}>
            <Pressable onPress={handlePrevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </Pressable>
            <Text style={[styles.monthText, { color: colors.text }]}>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
            <Pressable onPress={handleNextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.weekdays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={i} style={[styles.weekdayText, { color: colors.textMuted }]}>{d}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, i) => (
              <View key={i} style={styles.dayCell}>
                {day && (
                  <Pressable
                    onPress={() => {
                      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      onSelectDate(d.toISOString().slice(0, 10));
                      onClose();
                    }}
                    style={[
                      styles.dayBtn,
                      isSelected(day) && { backgroundColor: colors.primary },
                      !isSelected(day) && isToday(day) && { borderColor: colors.primary, borderWidth: 1 }
                    ]}
                  >
                    <Text style={[
                      styles.dayText,
                      { color: isSelected(day) ? '#000' : colors.text },
                      isSelected(day) && { fontWeight: '900' }
                    ]}>
                      {day}
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? '#1C1C1E' : '#F1F5F9' }]}>
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    borderRadius: 32,
    borderWidth: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navBtn: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekdayText: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
  },
  closeBtn: {
    marginTop: 24,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
