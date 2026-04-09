import { AuthContextType, User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "payu_users";
const CURRENT_USER_KEY = "payu_current_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      await AsyncStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(userWithoutPassword),
      );
      setUser(userWithoutPassword as User);
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const signUp = async (newUser: User) => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    if (users.find((u) => u.email === newUser.email)) {
      throw new Error("User already exists");
    }

    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    await AsyncStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(userWithoutPassword),
    );
    setUser(userWithoutPassword as User);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
