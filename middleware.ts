import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest } from 'next/server'

/**
 * Next.js middleware for handling authentication and session management.
 * 
 * This middleware runs on every request and:
 * 1. Updates the user's authentication session
 * 2. Handles token refresh automatically
 * 3. Protects routes by redirecting unauthenticated users
 * 
 * The middleware is configured to run on all routes except static assets
 * to ensure authentication is checked for all application pages.
 * 
 * @param request - The incoming Next.js request
 * @returns Response with updated session or redirect
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * Middleware configuration defining which routes to process.
 * 
 * This matcher excludes static assets and images to improve performance
 * and avoid unnecessary authentication checks on non-application routes.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static image files (svg, png, jpg, jpeg, gif, webp)
     * 
     * This ensures authentication is checked for all application routes
     * while avoiding unnecessary processing of static assets.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
