/**
 * Generic response type for all server actions in the application.
 * This ensures consistent error handling and type safety across all API interactions.
 * 
 * @template T - The type of data returned on success
 */
export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Creates a successful response with the provided data.
 * Used throughout the application for consistent success responses.
 * 
 * @param data - The data to return on success
 * @returns ActionResponse with success: true and the provided data
 */
export function successResponse<T>(data: T): ActionResponse<T> {
  return { success: true, data }
}

/**
 * Creates an error response with the provided error message.
 * Used throughout the application for consistent error responses.
 * 
 * @param error - The error message to return
 * @returns ActionResponse with success: false and the error message
 */
export function errorResponse(error: string): ActionResponse<never> {
  return { success: false, error }
}
