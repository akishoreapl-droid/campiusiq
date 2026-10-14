import { createClient } from '@supabase/supabase-js';

// WARNING: The service_role key has superuser privileges and bypasses Row-Level Security (RLS).
// NEVER import this file into client-side browser components.
// Only use in server-side functions, scripts, Node.js tools, or secure backend handlers.

declare const process: {
  env: Record<string, string | undefined>;
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cxvikyzuwnxczsbcllwh.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
