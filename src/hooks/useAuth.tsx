// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

type AuthContextType = {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const cur = localStorage.getItem("user");
    setUser(cur ? JSON.parse(cur) : null);
  }, []);

  async function login(email: string, password: string) {
    const payload = await authApi.login(email, password);
    setToken(localStorage.getItem("token"));
    if (payload.user) setUser(payload.user);
    else setUser({ email });
    return payload;
  }

  function logout() {
    authApi.logout();
    setUser(null);
    setToken(null);
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
