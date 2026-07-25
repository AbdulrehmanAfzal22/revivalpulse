import { create } from 'zustand';
import { supabase } from 'services/supabaseClient';
import { mapSupabaseUser } from 'api/auth/authClient';
import type { AuthStatus, AuthUser } from 'types/user.types';

interface AuthStoreState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  setSession: (user: AuthUser | null) => void;
  setError: (message: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  status: 'loading',
  error: null,
  setSession: (user) =>
    set(
      user
        ? { user, status: 'authenticated', error: null }
        : { user: null, status: 'guest', error: null }
    ),
  setError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),
}));

if (supabase) {
  supabase.auth.getSession().then(({ data }) => {
    const sessionUser = data.session?.user;
    useAuthStore.getState().setSession(sessionUser ? mapSupabaseUser(sessionUser) : null);
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session?.user ? mapSupabaseUser(session.user) : null);
  });
} else {
  useAuthStore.setState({ status: 'guest' });
}
