import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * OAuth callback handler for authentication providers (Google, etc.).
 * 
 * This route handles the callback from OAuth providers after user authentication.
 * The flow is:
 * 1. User clicks "Sign in with Google" 
 * 2. User is redirected to Google's OAuth page
 * 3. Google redirects back to this route with an authorization code
 * 4. This route exchanges the code for a session
 * 5. User is redirected to the dashboard or specified page
 * 
 * @param request - NextRequest object containing OAuth callback parameters
 * @returns NextResponse - Redirects to dashboard on success or error page on failure
 */
export async function GET(request: NextRequest) {
  // Extract OAuth callback parameters from the URL
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code') // Authorization code from OAuth provider
  const error = searchParams.get('error') // Error from OAuth provider
  const errorDescription = searchParams.get('error_description') // Error description
  const next = searchParams.get('next') ?? '/dashboard' // Where to redirect after success

  console.log('OAuth callback received:', { code: !!code, error, errorDescription, origin })

  // Handle OAuth errors from the provider (user cancelled, etc.)
  if (error) {
    console.error('OAuth provider error:', { error, errorDescription })
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`)
  }

  // Process the authorization code
  if (code) {
    try {
      const supabase = await createClient()
      // Exchange the authorization code for a user session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_failed&description=${encodeURIComponent(exchangeError.message)}`)
      }

      if (data.session) {
        console.log('Authentication successful, redirecting to:', next)
        // Success! Redirect to the intended destination
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        console.error('No session created after code exchange')
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_session&description=No session was created`)
      }
    } catch (error) {
      console.error('Unexpected error during code exchange:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unexpected&description=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
    }
  }

  // No authorization code provided - this shouldn't happen in normal flow
  console.error('No authorization code provided')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code&description=No authorization code was provided`)
}
