'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ActionResponse, errorResponse, successResponse } from '@/lib/action-response'
import { handleActionError } from '@/lib/error-handler'

export async function signInWithEmail(email: string, password: string): Promise<ActionResponse<null>> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(null)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function signInWithGoogle(): Promise<ActionResponse<null>> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(null)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<ActionResponse<null>> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(null)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    redirect('/login')
  }
}
