import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from 'services/supabaseClient';
import type { AuthProvider, AuthResult, AuthUser } from 'types/user.types';

const NOT_CONFIGURED_ERROR = 'Sign-in is not configured yet. Add Supabase credentials to enable it.';

export function mapSupabaseUser(user: SupabaseUser): AuthUser {
  const fullName = user.user_metadata?.full_name as string | undefined;
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const provider = user.app_metadata?.provider as AuthProvider | undefined;

  return {
    id: user.id,
    email: user.email ?? null,
    displayName: fullName ?? user.email ?? 'User',
    avatarUrl: avatarUrl ?? null,
    provider: provider ?? 'email',
  };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  if (!supabase) return { error: NOT_CONFIGURED_ERROR };
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  return { error: error?.message ?? null };
}

export async function signInWithApple(): Promise<AuthResult> {
  if (!supabase) return { error: NOT_CONFIGURED_ERROR };
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
  return { error: error?.message ?? null };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { error: NOT_CONFIGURED_ERROR };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { error: NOT_CONFIGURED_ERROR };
  const { error } = await supabase.auth.signUp({ email, password });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<AuthResult> {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}
