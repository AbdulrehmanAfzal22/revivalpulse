export type AuthProvider = 'google' | 'apple' | 'email';

export type AuthStatus = 'loading' | 'authenticated' | 'guest' | 'error';

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  provider: AuthProvider;
}

export interface AuthResult {
  error: string | null;
}
