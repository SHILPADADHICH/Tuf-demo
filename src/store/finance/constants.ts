import type { Category } from '@/types/finance';

export const STORAGE_KEY = 'finance-manager-v1';

export const PRESET_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'cash-outline', color: '#10B981' },
  { id: 'freelance', name: 'Freelance', icon: 'laptop-outline', color: '#34D399' },
  { id: 'food', name: 'Food', icon: 'restaurant-outline', color: '#F59E0B' },
  { id: 'travel', name: 'Travel', icon: 'airplane-outline', color: '#60A5FA' },
  { id: 'shopping', name: 'Shopping', icon: 'bag-outline', color: '#A78BFA' },
  { id: 'bills', name: 'Bills', icon: 'receipt-outline', color: '#F87171' },
  { id: 'health', name: 'Health', icon: 'heart-outline', color: '#FB7185' },
  { id: 'other', name: 'Other', icon: 'grid-outline', color: '#9CA3AF' },
];

export const CUSTOM_COLORS = ['#22C55E', '#06B6D4', '#8B5CF6', '#F97316', '#EF4444', '#3B82F6'];
