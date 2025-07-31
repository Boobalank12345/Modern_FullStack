import { useState, useEffect } from 'react'
import Head from 'next/head'
import { authHelpers } from '../utils/auth'

export default function Profile({ authContext }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    profilePicture: '',
    preferences: {
      notifications: true,
      reminderDays: 7
    }
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const headers = authHelpers.getAuthHeaders()

      const response = await fetch('/api/users/profile', {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        const user = data.user
        
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
          profilePicture: user.profilePicture || '',
          preferences: {
            notifications: user.preferences?.notifications !== undefined ? user.preferences.notifications : true,
            reminderDays: user.preferences?.reminderDays || 7
          }
        })
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
      setError('An error occurred while loading profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : (prefKey === 'reminderDays' ? parseInt(value) : value)
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authHelpers.getAuthHeaders()
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
        
        // Update auth context with new user data
        authContext.setUserData(data.user)
        authHelpers.setUserData(data.user)
      } else {
        setError(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      setError('An error occurred while updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authHelpers.getAuthHeaders()
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password updated successfully!')
        setIsChangingPassword(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setError(data.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Update password error:', error)
      setError('An error occurred while updating password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your birthday data.')) {
      return
    }

    if (!confirm('This will permanently delete your account and all data. Are you absolutely sure?')) {
      return
    }

    try {
      setIsLoading(true)
      const headers = authHelpers.getAuthHeaders()

      const response = await fetch('/api/users/profile', {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        alert('Account deleted successfully')
        authContext.logout()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Delete account error:', error)
      setError('An error occurred while deleting account')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !formData.name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Profile - Birthday Reminder Tracker</title>
        <meta name="description" content="Manage your profile settings" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">👤 Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Profile Information */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications"
                        name="preferences.notifications"
                        checked={formData.preferences.notifications}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                        Enable birthday notifications
                      </label>
                    </div>

                    <div>
                      <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700 mb-1">
                        Default reminder days before birthday
                      </label>
                      <select
                        id="reminderDays"
                        name="preferences.reminderDays"
                        value={formData.preferences.reminderDays}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value={1}>1 day</option>
                        <option value={3}>3 days</option>
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        fetchProfile() // Reset form data
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h2>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Once you delete your account, there is no going back. This will permanently delete your account and all your birthday data.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}