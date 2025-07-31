import { useState, useEffect } from 'react'
import { authHelpers } from '../utils/auth'

export default function Analytics({ authContext }) {
  const [analytics, setAnalytics] = useState({
    totalBirthdays: 0,
    relationshipBreakdown: {},
    monthlyDistribution: {},
    ageGroups: {},
    upcomingMilestones: [],
    averageAge: 0,
    oldestPerson: null,
    youngestPerson: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const headers = authHelpers.getAuthHeaders()

      const response = await fetch('/api/birthdays?limit=1000', {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        const birthdays = data.birthdays

        // Calculate analytics
        const totalBirthdays = birthdays.length

        // Relationship breakdown
        const relationshipBreakdown = birthdays.reduce((acc, birthday) => {
          acc[birthday.relationship] = (acc[birthday.relationship] || 0) + 1
          return acc
        }, {})

        // Monthly distribution
        const monthlyDistribution = birthdays.reduce((acc, birthday) => {
          const month = new Date(birthday.dateOfBirth).toLocaleDateString('en-US', { month: 'long' })
          acc[month] = (acc[month] || 0) + 1
          return acc
        }, {})

        // Age groups
        const ageGroups = birthdays.reduce((acc, birthday) => {
          const age = birthday.age
          let group
          if (age < 18) group = 'Under 18'
          else if (age < 30) group = '18-29'
          else if (age < 50) group = '30-49'
          else if (age < 70) group = '50-69'
          else group = '70+'
          
          acc[group] = (acc[group] || 0) + 1
          return acc
        }, {})

        // Upcoming milestones (milestone birthdays in next year)
        const upcomingMilestones = birthdays
          .filter(birthday => {
            const nextAge = birthday.age + 1
            return nextAge % 10 === 0 || [16, 18, 21, 25, 30, 40, 50, 65, 75, 80, 90, 100].includes(nextAge)
          })
          .map(birthday => ({
            ...birthday,
            nextAge: birthday.age + 1
          }))
          .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday)
          .slice(0, 10)

        // Average age
        const averageAge = birthdays.length > 0 
          ? Math.round(birthdays.reduce((sum, birthday) => sum + birthday.age, 0) / birthdays.length)
          : 0

        // Oldest and youngest
        const sortedByAge = [...birthdays].sort((a, b) => b.age - a.age)
        const oldestPerson = sortedByAge[0] || null
        const youngestPerson = sortedByAge[sortedByAge.length - 1] || null

        setAnalytics({
          totalBirthdays,
          relationshipBreakdown,
          monthlyDistribution,
          ageGroups,
          upcomingMilestones,
          averageAge,
          oldestPerson,
          youngestPerson
        })

      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch analytics data')
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
      setError('An error occurred while loading analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalBirthdays}</div>
          <div className="text-sm text-gray-600">Total Birthdays Tracked</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{analytics.averageAge}</div>
          <div className="text-sm text-gray-600">Average Age</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.upcomingMilestones.length}</div>
          <div className="text-sm text-gray-600">Upcoming Milestones</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Relationship Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Relationship Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(analytics.relationshipBreakdown).map(([relationship, count]) => (
              <div key={relationship} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="capitalize text-sm font-medium text-gray-700">{relationship}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${getPercentage(count, analytics.totalBirthdays)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Groups */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎂 Age Groups</h3>
          <div className="space-y-4">
            {Object.entries(analytics.ageGroups).map(([ageGroup, count]) => (
              <div key={ageGroup} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">{ageGroup}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${getPercentage(count, analytics.totalBirthdays)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Birthday Distribution by Month</h3>
          <div className="space-y-3">
            {Object.entries(analytics.monthlyDistribution).map(([month, count]) => (
              <div key={month} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-20">{month}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${getPercentage(count, analytics.totalBirthdays)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oldest & Youngest */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Age Records</h3>
          <div className="space-y-4">
            {analytics.oldestPerson && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Oldest Person</p>
                    <p className="text-lg font-semibold text-yellow-900">{analytics.oldestPerson.name}</p>
                    <p className="text-sm text-yellow-700">{analytics.oldestPerson.age} years old</p>
                  </div>
                  <div className="text-2xl">👴</div>
                </div>
              </div>
            )}
            
            {analytics.youngestPerson && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Youngest Person</p>
                    <p className="text-lg font-semibold text-blue-900">{analytics.youngestPerson.name}</p>
                    <p className="text-sm text-blue-700">{analytics.youngestPerson.age} years old</p>
                  </div>
                  <div className="text-2xl">👶</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Milestones */}
      {analytics.upcomingMilestones.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Upcoming Milestone Birthdays</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.upcomingMilestones.map((birthday) => (
              <div key={birthday._id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{birthday.name}</h4>
                  <span className="text-2xl font-bold text-purple-600">{birthday.nextAge}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(birthday.dateOfBirth)} • {birthday.daysUntilBirthday} days
                </p>
                <p className="text-xs text-gray-500 capitalize mt-1">{birthday.relationship}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Milestone Birthday
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {analytics.totalBirthdays === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
          <p className="text-gray-600 mb-6">
            Add some birthdays to see analytics and insights about your contacts.
          </p>
        </div>
      )}
    </div>
  )
}