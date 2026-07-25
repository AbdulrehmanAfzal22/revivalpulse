const SESSION_STORAGE_KEY = 'islamic-web:anon-session-id';

/**
 * Random, device-local identifier used only to scope global-counter rate
 * limiting and "my contribution" stats — it carries no PII and is never
 * linked to an auth identity, so anonymous participation works by default.
 * Persists across visits (localStorage); clearing site data resets it.
 */
export function getOrCreateSessionId(): string {
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const created = crypto.randomUUID();
  window.localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}
