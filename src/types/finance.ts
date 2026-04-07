export type TransactionType = 'income' | 'expense';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom?: boolean;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  createdAt: string;
};

export type TransactionInput = {
  type: TransactionType;
  amount: string;
  categoryId: string;
  date: string;
  note: string;
};
