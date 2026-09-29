import { InjectionToken } from '@angular/core';

/**
 * Settings that differ per environment. They are deliberately NOT compiled into the
 * bundle: the browser fetches /config.json at startup and each deployment writes that
 * file (IIS: the deploy script; container: the nginx entrypoint, from env vars). One
 * build artifact is therefore promoted unchanged SIT -> UAT -> PROD.
 */
export interface AppConfig {
  /** Label shown in the status badge, e.g. "SIT". */
  environment: string;
  /** NetCore.API origin without a trailing slash; '' means no API is wired up. */
  apiBaseUrl: string;
  /** Build number of the deployed artifact; the post-deploy smoke test asserts it. */
  version: string;
}

export const DEFAULT_APP_CONFIG: AppConfig = { environment: 'local', apiBaseUrl: '', version: 'dev' };

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  // Used by the build-time prerender and by tests; the browser bootstrap overrides it.
  factory: () => DEFAULT_APP_CONFIG,
});

/** Fetches config.json; any failure falls back to the defaults rather than blocking startup. */
export async function loadAppConfig(fetchFn: typeof fetch = fetch): Promise<AppConfig> {
  try {
    const response = await fetchFn('config.json', { cache: 'no-store' });
    if (!response.ok) {
      return DEFAULT_APP_CONFIG;
    }
    const loaded = (await response.json()) as Partial<AppConfig>;
    return {
      ...DEFAULT_APP_CONFIG,
      ...loaded,
      apiBaseUrl: (loaded.apiBaseUrl ?? '').replace(/\/+$/, ''),
    };
  } catch {
    return DEFAULT_APP_CONFIG;
  }
}
