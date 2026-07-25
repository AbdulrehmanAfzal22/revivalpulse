import { useAuthStore } from 'stores/authStore';
import {
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signOut as signOutRequest,
  signUpWithEmail,
} from 'api/auth/authClient';
import type { AuthResult, AuthStatus, AuthUser } from 'types/user.types';

export interface UseAuthResult {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  clearError: () => void;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithApple: () => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

export default function useAuth(): UseAuthResult {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    user,
    status,
    error,
    isAuthenticated: status === 'authenticated',
    isGuest: status === 'guest',
    clearError,
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    signOut: signOutRequest,
  };
}
