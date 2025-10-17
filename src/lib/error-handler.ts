import { ActionResponse, errorResponse } from './action-response'

export function handleDatabaseError(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific Supabase errors
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
    return error.message
  }
  return 'An unexpected error occurred'
}

export function handleActionError(error: unknown): ActionResponse<never> {
  const errorMessage = handleDatabaseError(error)
  return errorResponse(errorMessage)
}
