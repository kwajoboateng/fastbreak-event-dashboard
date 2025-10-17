'use client'

import { useState, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signInWithEmail, signUpWithEmail } from '@/app/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

/**
 * Validation schema for login/signup form using Zod.
 * Ensures email is valid and password meets minimum requirements.
 */
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

/**
 * Login/Signup page component with dual functionality.
 * 
 * This component handles both user authentication and registration:
 * - Toggle between login and signup modes
 * - Email/password authentication
 * - Google OAuth authentication
 * - Form validation with React Hook Form and Zod
 * - URL parameter support for initial signup mode
 * - Loading states and error handling
 * - Automatic redirect after successful authentication
 * 
 * Features:
 * - Responsive design with Shadcn UI components
 * - Real-time form validation
 * - Toast notifications for user feedback
 * - OAuth redirect handling
 * - Query parameter support (?mode=signup)
 * 
 * @returns JSX element with the authentication form
 */

/**
 * Content component that uses useSearchParams().
 * 
 * This component is separated from the main export to allow wrapping
 * with Suspense boundary, which is required by Next.js for static
 * generation when using useSearchParams(). This allows the page to
 * read URL query parameters (like ?mode=signup) during static generation.
 */
function LoginPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for signup mode from query parameter
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'signup') {
      setIsSignUp(true)
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const result = isSignUp 
        ? await signUpWithEmail(data.email, data.password)
        : await signInWithEmail(data.email, data.password)
        
      if (result.success) {
        if (isSignUp) {
          toast.success('Account created! Please check your email to verify your account.')
        } else {
          toast.success('Successfully signed in!')
          router.push('/dashboard')
        }
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // Use client-side Supabase for OAuth redirect
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        toast.error(error.message)
        setIsLoading(false)
      }
      // If successful, the user will be redirected to Google
    } catch (error) {
      console.error('Google sign in error:', error)
      toast.error('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#404E3B]">
            {isSignUp ? 'Create Account' : 'Sign in'}
          </CardTitle>
          <CardDescription className="text-center text-[#6C8480]">
            {isSignUp 
              ? 'Enter your email and password to create your account'
              : 'Enter your email and password to sign in to your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                disabled={isLoading}
                className="cursor-text"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                disabled={isLoading}
                className="cursor-text"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading 
                ? (isSignUp ? 'Creating account...' : 'Signing in...') 
                : (isSignUp ? 'Create Account' : 'Sign in')
              }
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <Button
              variant="link"
              className="p-0 h-auto font-normal cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
            >
              {isSignUp ? 'Sign in instead' : 'Create an account'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Main page component with Suspense boundary.
 * 
 * This wrapper is necessary because useSearchParams() requires a Suspense
 * boundary when used in pages that are statically generated. The fallback
 * provides a loading state while the search parameters are being resolved.
 * This enables the page to read URL query parameters (like ?mode=signup)
 * during the static generation process.
 * 
 * @returns JSX element with Suspense-wrapped content
 */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6] py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B9669] mx-auto"></div>
          <p className="mt-2 text-[#6C8480]">Loading...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
