import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import BirthdayForm from '../components/BirthdayForm'
import { authHelpers } from '../utils/auth'

export default function AddBirthday({ authContext }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authHelpers.getAuthHeaders()
      }

      const response = await fetch('/api/birthdays/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Birthday added successfully!')
        setTimeout(() => {
          router.push('/birthday-list')
        }, 1500)
      } else {
        setError(data.message || 'Failed to add birthday')
      }
    } catch (error) {
      console.error('Add birthday error:', error)
      setError('An error occurred while adding the birthday')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Add Birthday - Birthday Reminder Tracker</title>
        <meta name="description" content="Add a new birthday to track" />
      </Head>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">🎂 Add New Birthday</h1>
            <p className="mt-1 text-sm text-gray-600">
              Add someone's birthday to never miss their special day
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

            <BirthdayForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitButtonText="Add Birthday"
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">💡 Tips for Adding Birthdays</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Use the relationship field to organize your contacts (family, friends, colleagues, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Add gift ideas to remember what they might like for their birthday</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Set reminder preferences to get notified in advance</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Include contact information to easily reach out on their special day</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}