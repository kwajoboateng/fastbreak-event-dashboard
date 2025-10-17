import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('OAuth callback received:', { code: !!code, error, errorDescription, origin })

  // Handle OAuth errors from the provider
  if (error) {
    console.error('OAuth provider error:', { error, errorDescription })
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`)
  }

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_failed&description=${encodeURIComponent(exchangeError.message)}`)
      }

      if (data.session) {
        console.log('Authentication successful, redirecting to:', next)
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

  // No code provided
  console.error('No authorization code provided')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code&description=No authorization code was provided`)
}
