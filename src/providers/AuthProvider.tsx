
import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  resetInactivityTimer: () => void;
};

const AUTH_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimer) clearTimeout(inactivityTimer);
    
    // Only set new timer if user is logged in
    if (user) {
      const timer = setTimeout(async () => {
        console.log("User inactive for 5 minutes, logging out");
        await signOut();
      }, AUTH_TIMEOUT);
      
      setInactivityTimer(timer);
    }
  }, [inactivityTimer, user]);

  const signOut = async () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    await supabase.auth.signOut();
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetInactivityTimer();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Clear event listeners on cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [resetInactivityTimer, inactivityTimer]);

  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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

    // THEN check for existing session
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
