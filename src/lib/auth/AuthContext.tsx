'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import type { Database, Profile } from '@/lib/database.types';
import { mergeCartOnLogin } from '@/lib/auth/mergeCartOnLogin';
import { useCart } from '@/lib/CartContext';
import type { LoginInput, SignupInput } from '@/lib/auth/schemas';

type AuthStatus = 'loading' | 'ready' | 'disabled';
type ProfileStatus = 'idle' | 'loading' | 'ready' | 'error';
type Supabase = SupabaseClient<Database>;

export function isProfileComplete(p: Profile | null): boolean {
  if (!p) return false;
  return Boolean(p.full_name && p.full_name.trim().length >= 2 && p.phone && p.phone.trim().length >= 6);
}

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  session: Session | null;
  supabase: Supabase | null;
  profile: Profile | null;
  profileStatus: ProfileStatus;
  profileComplete: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (input: LoginInput) => Promise<{ error: string | null }>;
  signUp: (input: SignupInput) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  forceSignOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function fetchProfile(
  client: Supabase,
  userId: string
): Promise<Profile | null> {
  const { data } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return (data as Profile | null) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = useMemo(isConfigured, []);
  const [status, setStatus] = useState<AuthStatus>(configured ? 'loading' : 'disabled');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [supabase, setSupabase] = useState<Supabase | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>('idle');
  const { clearCart } = useCart();

  const loadProfile = useCallback(async (client: Supabase, userId: string) => {
    setProfileStatus('loading');
    try {
      const p = await fetchProfile(client, userId);
      setProfile(p);
      setProfileStatus('ready');
    } catch (e) {
      console.warn('[auth] loadProfile:', e);
      setProfile(null);
      setProfileStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!configured) {
      setStatus('disabled');
      return;
    }
    let client: Supabase;
    try {
      client = createSupabaseBrowser();
    } catch (e) {
      console.error('[auth] No se pudo inicializar Supabase:', e);
      setStatus('disabled');
      return;
    }
    setSupabase(client);
    setStatus('loading');

    let mounted = true;

    client.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setStatus('ready');
      if (data.session?.user) {
        await loadProfile(client, data.session.user.id);
      }
    });

    const { data: sub } = client.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setStatus('ready');
      if (nextSession?.user) {
        void mergeCartOnLogin(client, nextSession.user.id).catch((e) => {
          console.warn('[auth] mergeCartOnLogin:', e);
        });
        await loadProfile(client, nextSession.user.id);
      } else {
        clearCart();
        setProfile(null);
        setProfileStatus('idle');
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [configured, clearCart, loadProfile]);

  const signIn = useCallback<AuthContextValue['signIn']>(
    async ({ email, password }) => {
      if (!supabase) return { error: 'Supabase no está configurado.' };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signUp = useCallback<AuthContextValue['signUp']>(
    async ({ email, password }) => {
      if (!supabase) return { error: 'Supabase no está configurado.' };
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/cuenta`,
        },
      });
      if (error) return { error: error.message };
      if (data.session) return { error: null };
      return { error: null };
    },
    [supabase]
  );

  const resetLocalSession = useCallback(() => {
    if (typeof document === 'undefined') return;
    // Borra todas las cookies de Supabase (suelen empezar por `sb-`).
    const cookies = document.cookie ? document.cookie.split(';') : [];
    for (const raw of cookies) {
      const name = raw.split('=')[0]?.trim();
      if (!name) continue;
      if (name.startsWith('sb-') || name.includes('supabase') || name.includes('auth-token')) {
        const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = `${name}=; ${expires}; path=/`;
        document.cookie = `${name}=; ${expires}; path=/; domain=${window.location.hostname}`;
      }
    }
    try {
      localStorage.removeItem('brio-cart-v2');
    } catch {
      // ignore
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    try {
      // Timeout de seguridad: si la llamada se queda colgada, caemos al fallback local.
      const signOutPromise = supabase.auth.signOut();
      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 4000));
      await Promise.race([signOutPromise, timeout]);
    } catch (e) {
      console.warn('[auth] signOut error:', e);
    } finally {
      // Pase lo que pase, limpiamos estado y cookies para que la UI no se quede pillada.
      setSession(null);
      setUser(null);
      setProfile(null);
      setProfileStatus('idle');
      clearCart();
      resetLocalSession();
    }
  }, [supabase, clearCart, resetLocalSession]);

  const forceSignOut = useCallback(async () => {
    if (supabase) {
      try {
        const signOutPromise = supabase.auth.signOut();
        const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1500));
        await Promise.race([signOutPromise, timeout]);
      } catch {
        // ignore
      }
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setProfileStatus('idle');
    clearCart();
    resetLocalSession();
  }, [supabase, clearCart, resetLocalSession]);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) return;
    await loadProfile(supabase, user.id);
  }, [supabase, user, loadProfile]);

  const value: AuthContextValue = {
    status,
    user,
    session,
    supabase,
    profile,
    profileStatus,
    profileComplete: isProfileComplete(profile),
    refreshProfile,
    signIn,
    signUp,
    signOut,
    forceSignOut,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
