"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "@/lib/api/auth";
import type { LoginRequest, UserType } from "@/lib/api/types";

interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  userType: UserType;
  // Absent in sessions stored before this field existed - treat undefined as no photo.
  imageUrl?: string | null;
}

// The session itself is the HttpOnly cookie set by /api/auth/login, invisible to JavaScript.
// localStorage only keeps the profile shown in the header (nothing secret), so a page reload
// knows who is logged in without a round trip. If the cookie has expired, the next
// authenticated call answers 401 and the pages call logout().
const USER_KEY = "user";
// Where the JWT used to live before the BFF; removed on hydration.
const LEGACY_TOKEN_KEY = "token";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True until localStorage hydration (see AuthProvider) has run once. Pages that
   * gate access on isAuthenticated (e.g. /pedidos) must wait for this to go false
   * before redirecting - otherwise they see the pre-hydration isAuthenticated=false
   * and redirect a logged-in user to /login. React fires effects bottom-up, so a
   * page's own effect runs before this provider's hydration effect (the provider is
   * an ancestor) - the race is real, not hypothetical. */
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  /** Patches the locally-cached user (e.g. after a profile edit changes fullName) so the
   * header reflects it immediately, without forcing a re-login. Does not call the API
   * itself - callers save via updateMyProfile first, then pass the fields that changed. */
  updateUser: (patch: Partial<Pick<AuthUser, "fullName" | "email" | "imageUrl">>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Starts null on the server and on first client render (avoids a hydration mismatch),
  // then hydrates from localStorage in the effect below, client-only.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sanctioned exception to react-hooks/set-state-in-effect: this is hydrating from
    // localStorage, a browser-only store that doesn't exist during SSR - reading it in
    // a lazy useState initializer instead would make the client's first render differ
    // from the server-rendered HTML (a hydration mismatch), which is worse.
    const hadLegacyToken = localStorage.getItem(LEGACY_TOKEN_KEY) !== null;
    localStorage.removeItem(LEGACY_TOKEN_KEY);

    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser && !hadLegacyToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser) as AuthUser);
    } else {
      // A session from before the BFF has no cookie: ask for a fresh login.
      localStorage.removeItem(USER_KEY);
    }
    setIsLoading(false);
  }, []);

  async function login(payload: LoginRequest) {
    const response = await authApi.login(payload);
    const authUser: AuthUser = {
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
      userType: response.userType,
      imageUrl: response.imageUrl,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    // Drops the HttpOnly cookie server-side; a failure here only leaves a cookie that the
    // next 401 (or its own expiry) clears anyway.
    authApi.logout().catch(() => {});
  }

  function updateUser(patch: Partial<Pick<AuthUser, "fullName" | "email" | "imageUrl">>) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUser }}>
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
