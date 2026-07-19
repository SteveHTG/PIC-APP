import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabase/client";

/**
 * Supabase Auth session for the admin screen. Only meaningful when
 * Supabase is configured — AdminPage falls back to the demo passcode
 * gate otherwise.
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession),
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  function signOut() {
    return supabase.auth.signOut();
  }

  return { session, loading, signIn, signOut };
}
