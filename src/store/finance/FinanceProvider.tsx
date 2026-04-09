import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  CUSTOM_COLORS,
  PRESET_CATEGORIES,
  STORAGE_KEY,
} from "@/store/finance/constants";
import type { Category, Transaction, TransactionType } from "@/types/finance";

type Summary = {
  income: number;
  expense: number;
  balance: number;
};

type FinanceContextType = {
  loading: boolean;
  transactions: Transaction[];
  categories: Category[];
  monthly: Summary;
  total: Summary;
  addCategory: (name: string) => string | null;
  addTransaction: (payload: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (id: string, payload: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
};

type PersistedData = {
  transactions: Transaction[];
  categories: Category[];
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

function summaryFromTransactions(items: Transaction[]) {
  const income = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expense = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  return { income, expense, balance: income - expense };
}

export function FinanceProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(PRESET_CATEGORIES);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as PersistedData;
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.categories?.length) setCategories(parsed.categories);
      } catch {
        // ignore storage parse errors and fallback to defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (loading) return;

    const payload: PersistedData = { transactions, categories };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [categories, loading, transactions]);

  const monthly = useMemo(() => {
    const now = new Date();
    const monthItems = transactions.filter((item) => {
      const d = new Date(item.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });

    return summaryFromTransactions(monthItems);
  }, [transactions]);

  const total = useMemo(
    () => summaryFromTransactions(transactions),
    [transactions],
  );

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const id = `custom-${Date.now()}`;
    const color =
      CUSTOM_COLORS[Math.floor(Math.random() * CUSTOM_COLORS.length)];
    const category: Category = {
      id,
      name: trimmed,
      icon: "pricetag-outline",
      color,
      isCustom: true,
    };

    setCategories((prev) => [category, ...prev]);
    return id;
  };

  const addTransaction = (payload: Omit<Transaction, "id" | "createdAt">) => {
    const transaction: Transaction = {
      ...payload,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [transaction, ...prev]);
  };

  const updateTransaction = (id: string, payload: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...payload } : t)),
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const value: FinanceContextType = {
    loading,
    transactions,
    categories,
    monthly,
    total,
    addCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context)
    throw new Error("useFinance must be used inside FinanceProvider");
  return context;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function categoryById(categories: Category[], id: string) {
  return categories.find((category) => category.id === id);
}

export function filterByType(
  transactions: Transaction[],
  type: TransactionType,
) {
  return transactions.filter((transaction) => transaction.type === type);
}
