import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client configured for server-side operations.
 * This client is used in Server Components, Server Actions, and API routes.
 * 
 * Key features:
 * - Handles authentication cookies automatically
 * - Works with Next.js App Router server-side rendering
 * - Manages user sessions through HTTP-only cookies
 * 
 * @returns Promise<SupabaseClient> - Configured Supabase client for server use
 */
export async function createClient() {
  // Get the cookie store from Next.js headers
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Retrieves all cookies for the current request.
         * Used by Supabase to read authentication tokens.
         */
        getAll() {
          return cookieStore.getAll()
        },
        /**
         * Sets cookies in the response.
         * Used by Supabase to store authentication tokens.
         * 
         * Note: The try-catch is necessary because setAll might be called
         * from Server Components where cookie setting is not allowed.
         * The middleware handles session refresh in these cases.
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
