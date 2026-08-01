/**
 * A small, leveled logging utility — replaces the scattered ad hoc
 * `console.log('[some-prefix]', ...)` calls (each individually wrapped in
 * `// eslint-disable-next-line no-console`) with one consistent mechanism.
 * This is the one sanctioned place `console.*` is called directly; every
 * other module should go through `createLogger` instead.
 *
 * debug/info are silenced by default in production builds (matching the
 * `process.env.NODE_ENV` convention already used elsewhere in this app,
 * e.g. useTranslation's missing-key warning) — warn/error still surface
 * everywhere, since those are actionable regardless of environment.
 * Developer Mode (or a future debug panel) can call `setMinLogLevel('debug')`
 * at runtime to see everything without a rebuild.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function defaultMinLevel(): LogLevel {
  return process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
}

let minLevel: LogLevel = defaultMinLevel();

/** Overrides the minimum level at runtime — e.g. a developer-mode toggle wanting full debug output in an otherwise-production build. */
export function setMinLogLevel(level: LogLevel): void {
  minLevel = level;
}

/** Restores the environment-appropriate default — mainly useful for tests that change the level and need to clean up after themselves. */
export function resetMinLogLevel(): void {
  minLevel = defaultMinLevel();
}

export function getMinLogLevel(): LogLevel {
  return minLevel;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minLevel];
}

/** One logger per module/feature, consistently prefixed — e.g. `createLogger('recitation-coach')` replaces every `'[recitation-coach]'` string literal that used to be typed out at each call site. */
export function createLogger(namespace: string): Logger {
  const prefix = `[${namespace}]`;
  return {
    debug: (...args: unknown[]) => {
      if (!shouldLog('debug')) return;
      // eslint-disable-next-line no-console
      console.debug(prefix, ...args);
    },
    info: (...args: unknown[]) => {
      if (!shouldLog('info')) return;
      // eslint-disable-next-line no-console
      console.info(prefix, ...args);
    },
    warn: (...args: unknown[]) => {
      if (!shouldLog('warn')) return;
      // eslint-disable-next-line no-console
      console.warn(prefix, ...args);
    },
    error: (...args: unknown[]) => {
      if (!shouldLog('error')) return;
      // eslint-disable-next-line no-console
      console.error(prefix, ...args);
    },
  };
}
