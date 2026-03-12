"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/lib/api";
import type { AuthResponse } from "@/types/api.types";

type AuthUser = {
  userId: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  updateUser: (payload: AuthUser, token?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function persistAuth(response: AuthResponse) {
  localStorage.setItem("auth_token", response.token);
  localStorage.setItem(
    "auth_user",
    JSON.stringify({ userId: response.userId, name: response.name, email: response.email }),
  );
}

function clearAuth() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (payload: { name: string; email: string; password: string }) => {
    const response = await authApi.signup(payload);
    persistAuth(response);
    setToken(response.token);
    setUser({ userId: response.userId, name: response.name, email: response.email });
  }, []);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const response = await authApi.login(payload);
    persistAuth(response);
    setToken(response.token);
    setUser({ userId: response.userId, name: response.name, email: response.email });
  }, []);

  const updateUser = useCallback((nextUser: AuthUser, nextToken?: string) => {
    setUser(nextUser);
    localStorage.setItem("auth_user", JSON.stringify(nextUser));
    if (nextToken) {
      setToken(nextToken);
      localStorage.setItem("auth_token", nextToken);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, signup, login, updateUser, logout }),
    [user, token, isLoading, signup, login, updateUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
