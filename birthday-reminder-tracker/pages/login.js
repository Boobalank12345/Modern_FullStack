import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import LoginForm from '../components/LoginForm'

export default function AdminLogin({ authContext }) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authContext?.isAuthenticated) {
      router.push('/dashboard')
    }
  }, [authContext?.isAuthenticated, router])

  const handleLogin = async (email, password) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Login successful
        authContext.login(data.token, data.user)
        router.push('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login - Birthday Reminder Tracker</title>
        <meta name="description" content="Admin login for Birthday Reminder Tracker" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">🎂</h1>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your admin account
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
              submitButtonText="Sign In as Admin"
            />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link 
                  href="/userLogin" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Login as User instead
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link 
                  href="/" 
                  className="font-medium text-gray-600 hover:text-gray-500"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin Access
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    This is the admin login portal. If you're a regular user, please use the{' '}
                    <Link href="/userLogin" className="font-medium underline">
                      User Login
                    </Link>{' '}
                    instead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}