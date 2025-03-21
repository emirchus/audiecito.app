"use client";

import { useSupabase } from "@emirchus/use-supabase";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { signOutAction } from "@/lib/auth";

export interface AuthContextValue {
  user?: User | null;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  logOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: React.ReactNode;
  user: User | null | undefined;
}

export function AuthProvider({ children, user: cachedUser }: AuthProviderProps) {
  const { auth } = useSupabase();
  const [user, setUser] = useState<User | null | undefined>(cachedUser);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  const logOut = useCallback(async () => {
    await signOutAction();
    setUser(null);
    setSession(null);
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    const subscription = auth.onAuthStateChange(async (event) => {
      switch (event) {
        case "INITIAL_SESSION":
        case "USER_UPDATED":
        case "TOKEN_REFRESHED":
        case "SIGNED_IN":
          if (!session) return;
          setUser(session.user);

          break;
        case "SIGNED_OUT":
          setUser(null);
          setSession(null);
          break;
      }
    });

    return () => subscription.data.subscription.unsubscribe();
  }, [auth, session]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await auth.getSession();

      setSession(data.session);
    };

    fetchSession();
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
