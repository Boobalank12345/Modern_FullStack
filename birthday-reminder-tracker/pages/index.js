import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

export default function Home({ authContext }) {
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authContext?.isAuthenticated) {
      router.push('/dashboard')
    }
  }, [authContext?.isAuthenticated, router])

  return (
    <>
      <Head>
        <title>Birthday Reminder Tracker</title>
        <meta name="description" content="Never forget a birthday again! Track and get reminders for all your loved ones' birthdays." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">🎂 Birthday Tracker</h1>
              </div>
              <div className="flex space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Admin Login
                </Link>
                <Link href="/userLogin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  User Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Never Forget a
              <span className="text-blue-600"> Birthday</span> Again!
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Keep track of all your loved ones' birthdays and get timely reminders. 
              Organize contacts, set custom reminders, and never miss celebrating special moments.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/userLogin" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Admin Access
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-grid-spacing">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Admin Access</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  📅
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Smart Reminders</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Get customizable reminders days before each birthday so you never miss an important date.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  👥
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Contact Management</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Organize birthdays by relationship type and keep all contact information in one place.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                  🎁
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Gift Ideas</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Store gift ideas and notes for each person to make gift-giving easier and more thoughtful.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                  📊
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Analytics</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  View upcoming birthdays, statistics, and insights about your birthday tracking habits.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mx-auto">
                  🔒
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Secure & Private</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Your data is secure and private. Only you have access to your birthday information.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  📱
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Mobile Friendly</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Access your birthday tracker from any device with our responsive design.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-blue-600 rounded-lg shadow-xl">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
              <div className="text-center">
                <h3 className="text-3xl font-extrabold text-white">
                  Ready to get started?
                </h3>
                <p className="mt-4 text-lg text-blue-100">
                  Join thousands of users who never miss a birthday celebration.
                </p>
                <div className="mt-8">
                  <Link href="/userLogin" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10">
                    Start Tracking Birthdays
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                © 2024 Birthday Reminder Tracker. All rights reserved.
              </p>
              <div className="mt-4">
                <Link href="/terms-conditions" className="text-blue-600 hover:text-blue-800 text-sm">
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}