import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { authHelpers } from '../utils/auth'
import BirthdayCard from '../components/BirthdayCard'

export default function BirthdayList({ authContext }) {
  const [birthdays, setBirthdays] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [relationshipFilter, setRelationshipFilter] = useState('all')
  const [sortBy, setSortBy] = useState('nextBirthday')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const router = useRouter()

  const relationshipOptions = [
    { value: 'all', label: 'All Relationships' },
    { value: 'family', label: 'Family' },
    { value: 'friend', label: 'Friends' },
    { value: 'colleague', label: 'Colleagues' },
    { value: 'acquaintance', label: 'Acquaintances' },
    { value: 'other', label: 'Other' },
  ]

  const sortOptions = [
    { value: 'nextBirthday', label: 'Next Birthday' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'dateOfBirth', label: 'Date of Birth' },
    { value: 'relationship', label: 'Relationship' },
  ]

  useEffect(() => {
    fetchBirthdays()
  }, [searchTerm, relationshipFilter, sortBy, currentPage])

  const fetchBirthdays = async () => {
    try {
      setIsLoading(true)
      const headers = authHelpers.getAuthHeaders()

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search: searchTerm,
        relationship: relationshipFilter,
        sortBy: sortBy,
      })

      const response = await fetch(`/api/birthdays?${params}`, {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setBirthdays(data.birthdays)
        setPagination(data.pagination)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch birthdays')
      }
    } catch (error) {
      console.error('Fetch birthdays error:', error)
      setError('An error occurred while loading birthdays')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (birthdayId) => {
    if (!confirm('Are you sure you want to delete this birthday?')) {
      return
    }

    try {
      const headers = authHelpers.getAuthHeaders()

      const response = await fetch(`/api/birthdays/${birthdayId}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        // Remove the deleted birthday from the list
        setBirthdays(birthdays.filter(b => b._id !== birthdayId))
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to delete birthday')
      }
    } catch (error) {
      console.error('Delete birthday error:', error)
      alert('An error occurred while deleting the birthday')
    }
  }

  const handleEdit = (birthdayId) => {
    router.push(`/${birthdayId}`)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'relationship') {
      setRelationshipFilter(value)
    } else if (filterType === 'sort') {
      setSortBy(value)
    }
    setCurrentPage(1) // Reset to first page when filtering
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
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
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  }

  return (
    <>
      <Head>
        <title>Birthday List - Birthday Reminder Tracker</title>
        <meta name="description" content="View and manage all your tracked birthdays" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🎂 Birthday List</h1>
            <p className="mt-2 text-gray-600">
              Manage all your tracked birthdays
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/add-birthday"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="mr-2">+</span>
              Add Birthday
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Relationship Filter */}
            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <select
                id="relationship"
                value={relationshipFilter}
                onChange={(e) => handleFilterChange('relationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {relationshipOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {pagination.total ? (
                  <>
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} birthdays
                  </>
                ) : (
                  'No birthdays found'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Birthday Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : birthdays.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {birthdays.map((birthday) => (
                <BirthdayCard
                  key={birthday._id}
                  birthday={birthday}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage === pagination.pages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                      <span className="font-medium">{pagination.pages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              pageNum === currentPage
                                ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                        disabled={currentPage === pagination.pages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No birthdays found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || relationshipFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : "You haven't added any birthdays yet"
              }
            </p>
            <Link
              href="/add-birthday"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Your First Birthday
            </Link>
          </div>
        )}
      </div>
    </>
  )
}