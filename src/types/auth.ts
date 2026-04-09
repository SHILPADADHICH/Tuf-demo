export type User = {
  fullName: string;
  email: string;
  password?: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
};
