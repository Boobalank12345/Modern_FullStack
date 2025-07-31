import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { authHelpers } from '../utils/auth'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const router = useRouter()

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/userLogin', '/terms-conditions', '/']

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const authenticated = authHelpers.isAuthenticated()
      const user = authHelpers.getUserData()
      
      setIsAuthenticated(authenticated)
      setUserData(user)
      setIsLoading(false)

      // Redirect to login if not authenticated and trying to access protected route
      if (!authenticated && !publicRoutes.includes(router.pathname)) {
        router.push('/login')
      }
    }

    checkAuth()

    // Listen for route changes
    const handleRouteChange = () => {
      const authenticated = authHelpers.isAuthenticated()
      if (!authenticated && !publicRoutes.includes(router.pathname)) {
        router.push('/login')
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Auth context to pass to components
  const authContext = {
    isAuthenticated,
    userData,
    setIsAuthenticated,
    setUserData,
    login: (token, user) => {
      authHelpers.setToken(token)
      authHelpers.setUserData(user)
      setIsAuthenticated(true)
      setUserData(user)
    },
    logout: () => {
      authHelpers.logout()
      setIsAuthenticated(false)
      setUserData(null)
    }
  }

  // Don't wrap public routes with Layout
  if (publicRoutes.includes(router.pathname)) {
    return <Component {...pageProps} authContext={authContext} />
  }

  // Wrap protected routes with Layout
  return (
    <Layout authContext={authContext}>
      <Component {...pageProps} authContext={authContext} />
    </Layout>
  )
}