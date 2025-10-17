'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Copy } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function AuthCodeErrorPage() {
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
              <li>• The redirect URL doesn't match the configured URL</li>
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
