"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "@/lib/api/auth";
import type { LoginRequest, UserType } from "@/lib/api/types";

interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  userType: UserType;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Both start null on the server and on first client render (avoids a hydration
  // mismatch), then hydrate from localStorage in the effect below, client-only.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Sanctioned exception to react-hooks/set-state-in-effect: this is hydrating from
    // localStorage, a browser-only store that doesn't exist during SSR - reading it in
    // a lazy useState initializer instead would make the client's first render differ
    // from the server-rendered HTML (a hydration mismatch), which is worse.
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as AuthUser);
    }
  }, []);

  async function login(payload: LoginRequest) {
    const response = await authApi.login(payload);
    const authUser: AuthUser = {
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
      userType: response.userType,
    };
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(authUser));
    setToken(response.token);
    setUser(authUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
