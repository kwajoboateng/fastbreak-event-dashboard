import { ActionResponse, errorResponse } from './action-response'

/**
 * Centralized error handling for database operations.
 * Converts technical database errors into user-friendly messages.
 * 
 * @param error - The unknown error from database operations
 * @returns A user-friendly error message string
 */
export function handleDatabaseError(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific Supabase/PostgreSQL errors with user-friendly messages
    if (error.message.includes('duplicate key')) {
      return 'This record already exists'
    }
    if (error.message.includes('foreign key')) {
      return 'Referenced record not found'
    }
    if (error.message.includes('not null')) {
      return 'Required field is missing'
    }
    if (error.message.includes('unique constraint')) {
      return 'This value already exists'
    }
    // Return the original error message if it's already user-friendly
    return error.message
  }
  // Fallback for non-Error objects
  return 'An unexpected error occurred'
}

/**
 * Generic error handler for all server actions.
 * Wraps database errors in the standard ActionResponse format.
 * 
 * @param error - The unknown error from any operation
 * @returns ActionResponse with success: false and user-friendly error message
 */
export function handleActionError(error: unknown): ActionResponse<never> {
  const errorMessage = handleDatabaseError(error)
  return errorResponse(errorMessage)
}
