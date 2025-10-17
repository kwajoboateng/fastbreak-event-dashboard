'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Copy } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

/**
 * Content component that uses useSearchParams().
 * 
 * This component is separated from the main export to allow wrapping
 * with Suspense boundary, which is required by Next.js for static
 * generation when using useSearchParams().
 */
function AuthCodeErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const description = searchParams.get('description')
  const [copied, setCopied] = useState(false)

  const copyErrorDetails = () => {
    const errorDetails = `Error: ${error || 'Unknown'}\nDescription: ${description || 'No description provided'}`
    navigator.clipboard.writeText(errorDetails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Authentication Error
          </CardTitle>
          <p className="text-center text-gray-600">
            There was an error during the authentication process.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
              <p className="text-sm text-red-700 mb-2">
                <strong>Error:</strong> {error}
              </p>
              {description && (
                <p className="text-sm text-red-700">
                  <strong>Description:</strong> {description}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={copyErrorDetails}
                className="mt-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                {copied ? 'Copied!' : 'Copy Error Details'}
              </Button>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">Common causes:</p>
            <ul className="space-y-1 ml-4">
              <li>• The authentication was cancelled</li>
              <li>• The session expired</li>
              <li>• There was a network error</li>
              <li>• The OAuth provider configuration is incorrect</li>
              <li>• The redirect URL doesn&apos;t match the configured URL</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link href="/login" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
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
 * 
 * @returns JSX element with Suspense-wrapped content
 */
export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  )
}
