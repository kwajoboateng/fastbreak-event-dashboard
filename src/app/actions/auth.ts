'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ActionResponse, errorResponse, successResponse } from '@/lib/action-response'
import { handleActionError } from '@/lib/error-handler'

/**
 * Server Action for email/password authentication.
 * Handles user sign-in with email and password credentials.
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise<ActionResponse<null>> - Success/error response
 */
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


/**
 * Server Action for user registration with email/password.
 * Creates a new user account with email and password.
 * 
 * Note: Supabase may require email verification depending on configuration.
 * Users will receive a verification email if email confirmation is enabled.
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise<ActionResponse<null>> - Success/error response
 */
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

/**
 * Server Action for user sign-out.
 * Signs out the current user and redirects to login page.
 * 
 * Note: This function always redirects to /login regardless of success/failure.
 * The redirect happens in the finally block to ensure it always occurs.
 * 
 * @returns Promise<void> - Always redirects to login page
 */
export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    // Always redirect to login page, even if sign-out fails
    redirect('/login')
  }
}
