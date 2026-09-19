"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "@/lib/api";
import { User } from "@/lib/api/types";

export type SessionStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

interface SessionContextValue {
  user: User | null;
  status: SessionStatus;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(
  null,
);

export const SessionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      const sessionUser = await authApi.getSession();
      setUser(sessionUser);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const sessionUser = await authApi.login({ email, password });
      setUser(sessionUser);
      setStatus("authenticated");
    },
    [],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      // The backend's /register only creates the account; it does not
      // establish a session (only /login does). Chaining a real login call
      // here gives "register -> straight into the app" UX without
      // fabricating auth state that the backend never granted.
      await authApi.register({ email, password });
      const sessionUser = await authApi.login({ email, password });
      setUser(sessionUser);
      setStatus("authenticated");
    },
    [],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ user, status, refresh, login, register, logout }),
    [user, status, refresh, login, register, logout],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
