import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client configured for client-side operations.
 * This client is used in Client Components for operations that require
 * browser-specific functionality like OAuth redirects.
 * 
 * Key features:
 * - Handles OAuth flows that require browser redirects
 * - Manages client-side authentication state
 * - Used for operations that cannot be performed server-side
 * 
 * Note: This client should be used sparingly. Prefer server-side
 * operations when possible for better security and performance.
 * 
 * @returns SupabaseClient - Configured Supabase client for browser use
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
