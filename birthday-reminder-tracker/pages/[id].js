import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import BirthdayForm from '../components/BirthdayForm'
import { authHelpers } from '../utils/auth'

export default function BirthdayDetail({ authContext }) {
  const [birthday, setBirthday] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchBirthday()
    }
  }, [id])

  const fetchBirthday = async () => {
    try {
      setIsLoading(true)
      const headers = authHelpers.getAuthHeaders()

      const response = await fetch(`/api/birthdays/${id}`, {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setBirthday(data.birthday)
      } else if (response.status === 404) {
        setError('Birthday not found')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch birthday')
      }
    } catch (error) {
      console.error('Fetch birthday error:', error)
      setError('An error occurred while loading the birthday')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (formData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authHelpers.getAuthHeaders()
      }

      const response = await fetch(`/api/birthdays/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Birthday updated successfully!')
        setBirthday(data.birthday)
        setIsEditing(false)
        
        // Refresh the birthday data to get updated virtual fields
        setTimeout(() => {
          fetchBirthday()
        }, 1000)
      } else {
        setError(data.message || 'Failed to update birthday')
      }
    } catch (error) {
      console.error('Update birthday error:', error)
      setError('An error occurred while updating the birthday')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this birthday?')) {
      return
    }

    try {
      setIsLoading(true)
      const headers = authHelpers.getAuthHeaders()

      const response = await fetch(`/api/birthdays/${id}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        router.push('/birthday-list')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete birthday')
      }
    } catch (error) {
      console.error('Delete birthday error:', error)
      setError('An error occurred while deleting the birthday')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  const formatNextBirthday = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const thisYearBirthday = new Date(today.getFullYear(), date.getMonth(), date.getDate())
    
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1)
    }
    
    return thisYearBirthday.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  const getDaysUntil = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const thisYearBirthday = new Date(today.getFullYear(), date.getMonth(), date.getDate())
    
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = thisYearBirthday - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today! 🎉'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  }

  if (isLoading && !birthday) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error && !birthday) {
    return (
      <>
        <Head>
          <title>Birthday Not Found - Birthday Reminder Tracker</title>
        </Head>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Birthday Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/birthday-list"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              ← Back to Birthday List
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{birthday?.name}'s Birthday - Birthday Reminder Tracker</title>
        <meta name="description" content={`Birthday details for ${birthday?.name}`} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/birthday-list"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
            >
              ← Back to Birthday List
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              🎂 {birthday?.name}'s Birthday
            </h1>
          </div>
          <div className="flex space-x-3">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

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

        {isEditing ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit Birthday</h2>
            </div>
            <BirthdayForm
              initialData={birthday}
              onSubmit={handleUpdate}
              isLoading={isLoading}
              submitButtonText="Update Birthday"
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Birthday Information</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{birthday?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(birthday?.dateOfBirth)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                    <dd className="mt-1 text-sm text-gray-900">{birthday?.age} years old</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{birthday?.relationship}</dd>
                  </div>
                  {birthday?.email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a href={`mailto:${birthday.email}`} className="text-blue-600 hover:text-blue-800">
                          {birthday.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {birthday?.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a href={`tel:${birthday.phone}`} className="text-blue-600 hover:text-blue-800">
                          {birthday.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Notes */}
              {birthday?.notes && (
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{birthday.notes}</p>
                </div>
              )}

              {/* Gift Ideas */}
              {birthday?.giftIdeas && birthday.giftIdeas.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🎁 Gift Ideas</h2>
                  <ul className="space-y-2">
                    {birthday.giftIdeas.map((idea, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
                        <span className="text-gray-700">{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Next Birthday */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🎉 Next Birthday</h2>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {getDaysUntil(birthday?.dateOfBirth)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatNextBirthday(birthday?.dateOfBirth)}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Turning {(birthday?.age || 0) + 1}
                  </div>
                </div>
              </div>

              {/* Reminder Settings */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">⏰ Reminder Settings</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Enabled</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      birthday?.reminderSettings?.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {birthday?.reminderSettings?.enabled ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Days Before</span>
                    <span className="text-sm font-medium text-gray-900">
                      {birthday?.reminderSettings?.daysBefore || 7} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}