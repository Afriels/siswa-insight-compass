
import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  resetInactivityTimer: () => void;
};

const AUTH_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    
    if (user) {
      const timer = setTimeout(async () => {
        console.log("User inactive for 10 minutes, logging out");
        await signOut();
      }, AUTH_TIMEOUT);
      
      setInactivityTimer(timer);
    }
  }, [inactivityTimer, user]);

  const signOut = async () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  useEffect(() => {
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetInactivityTimer();
    };
    
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [resetInactivityTimer, inactivityTimer]);

  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          resetInactivityTimer();
        } else if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
      }
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        resetInactivityTimer();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    signOut,
    resetInactivityTimer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
