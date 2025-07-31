import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { authHelpers } from '../utils/auth'
import Dashboard from '../components/Dashboard'
import Analytics from '../components/Analytics'

export default function DashboardPage({ authContext }) {
  const [birthdays, setBirthdays] = useState([])
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([])
  const [todaysBirthdays, setTodaysBirthdays] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const headers = authHelpers.getAuthHeaders()

      // Fetch all birthdays
      const response = await fetch('/api/birthdays?limit=100', {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        const allBirthdays = data.birthdays

        setBirthdays(allBirthdays)

        // Filter birthdays for different categories
        const today = new Date()
        const todayStr = today.toDateString()
        const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        const oneMonthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

        // Today's birthdays
        const todaysB = allBirthdays.filter(birthday => {
          const birthDate = new Date(birthday.dateOfBirth)
          const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          return thisYearBirthday.toDateString() === todayStr
        })

        // Upcoming birthdays (next 30 days, excluding today)
        const upcomingB = allBirthdays.filter(birthday => {
          const birthDate = new Date(birthday.dateOfBirth)
          const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          
          // If birthday already passed this year, check next year
          if (thisYearBirthday < today) {
            thisYearBirthday.setFullYear(today.getFullYear() + 1)
          }
          
          return thisYearBirthday > today && thisYearBirthday <= oneMonthFromNow
        }).sort((a, b) => {
          const aDate = new Date(a.dateOfBirth)
          const bDate = new Date(b.dateOfBirth)
          const aThisYear = new Date(today.getFullYear(), aDate.getMonth(), aDate.getDate())
          const bThisYear = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate())
          
          if (aThisYear < today) aThisYear.setFullYear(today.getFullYear() + 1)
          if (bThisYear < today) bThisYear.setFullYear(today.getFullYear() + 1)
          
          return aThisYear - bThisYear
        })

        setTodaysBirthdays(todaysB)
        setUpcomingBirthdays(upcomingB.slice(0, 10)) // Show only next 10

        // Calculate stats
        const thisWeekB = allBirthdays.filter(birthday => {
          const birthDate = new Date(birthday.dateOfBirth)
          const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          
          if (thisYearBirthday < today) {
            thisYearBirthday.setFullYear(today.getFullYear() + 1)
          }
          
          return thisYearBirthday >= today && thisYearBirthday <= oneWeekFromNow
        })

        const thisMonthB = allBirthdays.filter(birthday => {
          const birthDate = new Date(birthday.dateOfBirth)
          const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          
          if (thisYearBirthday < today) {
            thisYearBirthday.setFullYear(today.getFullYear() + 1)
          }
          
          return thisYearBirthday >= today && thisYearBirthday <= oneMonthFromNow
        })

        setStats({
          total: allBirthdays.length,
          thisMonth: thisMonthB.length,
          thisWeek: thisWeekB.length,
          today: todaysB.length
        })

      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch birthdays')
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      setError('An error occurred while loading dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const thisYearBirthday = new Date(today.getFullYear(), date.getMonth(), date.getDate())
    
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1)
    }
    
    return thisYearBirthday.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: thisYearBirthday.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
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
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard - Birthday Reminder Tracker</title>
        <meta name="description" content="Your birthday tracking dashboard" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {authContext?.userData?.name}! 🎉
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your birthday reminders
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{stats.total}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Birthdays</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{stats.today}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{stats.thisWeek}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.thisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{stats.thisMonth}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.thisMonth}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Birthdays */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">🎂 Today's Birthdays</h2>
            </div>
            <div className="p-6">
              {todaysBirthdays.length > 0 ? (
                <div className="space-y-4">
                  {todaysBirthdays.map((birthday) => (
                    <div key={birthday._id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <h3 className="font-semibold text-gray-900">{birthday.name}</h3>
                        <p className="text-sm text-gray-600">
                          Turning {birthday.age + 1} today! 🎉
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{birthday.relationship}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Today
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No birthdays today</p>
              )}
            </div>
          </div>

          {/* Upcoming Birthdays */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">📅 Upcoming Birthdays</h2>
              <Link href="/birthday-list" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {upcomingBirthdays.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBirthdays.map((birthday) => (
                    <div key={birthday._id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <h3 className="font-semibold text-gray-900">{birthday.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(birthday.dateOfBirth)} • Turning {birthday.age + 1}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{birthday.relationship}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getDaysUntil(birthday.dateOfBirth)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming birthdays in the next 30 days</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/add-birthday" className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">+</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Add Birthday</p>
                <p className="text-xs text-blue-700">Add a new birthday</p>
              </div>
            </Link>

            <Link href="/birthday-list" className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">📋</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">View All</p>
                <p className="text-xs text-green-700">See all birthdays</p>
              </div>
            </Link>

            <Link href="/profile" className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">👤</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">Profile</p>
                <p className="text-xs text-purple-700">Edit your profile</p>
              </div>
            </Link>

            <button 
              onClick={fetchDashboardData}
              className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🔄</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Refresh</p>
                <p className="text-xs text-gray-700">Update data</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}