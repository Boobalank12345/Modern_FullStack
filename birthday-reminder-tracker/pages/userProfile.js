// This file is a duplicate of profile.js for user-specific profile management
// In a real application, you might want to differentiate between admin and user profiles
// For now, we'll redirect to the main profile page

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function UserProfile() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main profile page
    router.replace('/profile')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  )
}