import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  isReady: boolean;  
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      const next = !!token;
      if (!cancelled) setIsLoggedIn(prev => (prev === next ? prev : next));
    })();
    return () => { cancelled = true; };
  }, []);

  const login = async () => {
    await AsyncStorage.setItem("userToken", "dummy-token");
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
