export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export function successResponse<T>(data: T): ActionResponse<T> {
  return { success: true, data }
}

export function errorResponse(error: string): ActionResponse<never> {
  return { success: false, error }
}
