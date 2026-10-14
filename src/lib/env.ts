/**
 * Validates and exposes safe client-side environment variables.
 * Never exposes privileged database credentials or service-role keys.
 */

interface SafeClientEnv {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  APP_ENV: string;
  APP_NAME: string;
  IS_CONFIGURED: boolean;
}

export function getSafeEnv(): SafeClientEnv {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || anonKey;
  const env = import.meta.env.VITE_APP_ENV || 'production';
  const name = import.meta.env.VITE_APP_NAME || 'CampusIQ';

  const isConfigured = Boolean(url && (anonKey || publishableKey));

  if (!isConfigured) {
    console.warn(
      '[CampusIQ Security] Missing required VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.'
    );
  }

  return {
    SUPABASE_URL: url,
    SUPABASE_ANON_KEY: anonKey,
    SUPABASE_PUBLISHABLE_KEY: publishableKey,
    APP_ENV: env,
    APP_NAME: name,
    IS_CONFIGURED: isConfigured,
  };
}

export const safeEnv = getSafeEnv();
