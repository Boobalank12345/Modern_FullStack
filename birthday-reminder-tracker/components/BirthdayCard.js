import { useState } from 'react'

export default function BirthdayCard({ birthday, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
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
    
    if (diffDays === 0) return { text: 'Today', color: 'bg-green-100 text-green-800' }
    if (diffDays === 1) return { text: 'Tomorrow', color: 'bg-yellow-100 text-yellow-800' }
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'bg-orange-100 text-orange-800' }
    if (diffDays <= 30) return { text: `${diffDays} days`, color: 'bg-blue-100 text-blue-800' }
    return { text: `${diffDays} days`, color: 'bg-gray-100 text-gray-800' }
  }

  const getRelationshipIcon = (relationship) => {
    const icons = {
      family: '👨‍👩‍👧‍👦',
      friend: '👫',
      colleague: '💼',
      acquaintance: '🤝',
      other: '👤'
    }
    return icons[relationship] || icons.other
  }

  const getRelationshipColor = (relationship) => {
    const colors = {
      family: 'bg-red-100 text-red-800',
      friend: 'bg-green-100 text-green-800',
      colleague: 'bg-blue-100 text-blue-800',
      acquaintance: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[relationship] || colors.other
  }

  const daysUntil = getDaysUntil(birthday.dateOfBirth)

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {birthday.name}
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{getRelationshipIcon(birthday.relationship)}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRelationshipColor(birthday.relationship)}`}>
                {birthday.relationship}
              </span>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      onEdit(birthday._id)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      onDelete(birthday._id)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Birthday Info */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">Birthday</p>
            <p className="text-lg font-medium text-gray-900">
              {formatDate(birthday.dateOfBirth)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Age</p>
            <p className="text-lg font-medium text-gray-900">
              {birthday.age} → {birthday.age + 1}
            </p>
          </div>
        </div>

        {/* Days Until Birthday */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Next birthday:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${daysUntil.color}`}>
            {daysUntil.text}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      {(birthday.email || birthday.phone) && (
        <div className="px-6 pb-4 border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-4 text-sm">
            {birthday.email && (
              <a
                href={`mailto:${birthday.email}`}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            )}
            {birthday.phone && (
              <a
                href={`tel:${birthday.phone}`}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
            )}
          </div>
        </div>
      )}

      {/* Gift Ideas Preview */}
      {birthday.giftIdeas && birthday.giftIdeas.length > 0 && (
        <div className="px-6 pb-4 border-t border-gray-100 pt-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span>{birthday.giftIdeas.length} gift idea{birthday.giftIdeas.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Notes Preview */}
      {birthday.notes && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {birthday.notes.length > 100 
              ? `${birthday.notes.substring(0, 100)}...` 
              : birthday.notes
            }
          </p>
        </div>
      )}

      {/* Click overlay to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}