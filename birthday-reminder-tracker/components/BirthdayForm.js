import { useState, useEffect } from 'react'

export default function BirthdayForm({ 
  initialData = null, 
  onSubmit, 
  isLoading = false, 
  submitButtonText = 'Save Birthday',
  onCancel = null 
}) {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    relationship: 'friend',
    email: '',
    phone: '',
    notes: '',
    giftIdeas: [''],
    reminderSettings: {
      enabled: true,
      daysBefore: 7
    }
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
        relationship: initialData.relationship || 'friend',
        email: initialData.email || '',
        phone: initialData.phone || '',
        notes: initialData.notes || '',
        giftIdeas: initialData.giftIdeas && initialData.giftIdeas.length > 0 ? initialData.giftIdeas : [''],
        reminderSettings: {
          enabled: initialData.reminderSettings?.enabled !== undefined ? initialData.reminderSettings.enabled : true,
          daysBefore: initialData.reminderSettings?.daysBefore || 7
        }
      })
    }
  }, [initialData])

  const relationshipOptions = [
    { value: 'family', label: 'Family' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'acquaintance', label: 'Acquaintance' },
    { value: 'other', label: 'Other' },
  ]

  const reminderDaysOptions = [
    { value: 1, label: '1 day' },
    { value: 3, label: '3 days' },
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
    { value: 30, label: '30 days' },
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future'
      }
    }

    if (formData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith('reminderSettings.')) {
      const settingKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        reminderSettings: {
          ...prev.reminderSettings,
          [settingKey]: type === 'checkbox' ? checked : (settingKey === 'daysBefore' ? parseInt(value) : value)
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleGiftIdeaChange = (index, value) => {
    const newGiftIdeas = [...formData.giftIdeas]
    newGiftIdeas[index] = value
    setFormData(prev => ({
      ...prev,
      giftIdeas: newGiftIdeas
    }))
  }

  const addGiftIdea = () => {
    setFormData(prev => ({
      ...prev,
      giftIdeas: [...prev.giftIdeas, '']
    }))
  }

  const removeGiftIdea = (index) => {
    if (formData.giftIdeas.length > 1) {
      const newGiftIdeas = formData.giftIdeas.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        giftIdeas: newGiftIdeas
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Clean up gift ideas (remove empty ones)
    const cleanedGiftIdeas = formData.giftIdeas.filter(idea => idea.trim() !== '')

    const submitData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      giftIdeas: cleanedGiftIdeas
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
            Relationship
          </label>
          <select
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {relationshipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add any notes about this person..."
        />
      </div>

      {/* Gift Ideas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Gift Ideas
          </label>
          <button
            type="button"
            onClick={addGiftIdea}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Idea
          </button>
        </div>
        <div className="space-y-2">
          {formData.giftIdeas.map((idea, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={idea}
                onChange={(e) => handleGiftIdeaChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Gift idea ${index + 1}`}
              />
              {formData.giftIdeas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGiftIdea(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminderEnabled"
              name="reminderSettings.enabled"
              checked={formData.reminderSettings.enabled}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="reminderEnabled" className="ml-2 block text-sm text-gray-900">
              Enable birthday reminders
            </label>
          </div>

          {formData.reminderSettings.enabled && (
            <div>
              <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700 mb-1">
                Remind me
              </label>
              <select
                id="reminderDays"
                name="reminderSettings.daysBefore"
                value={formData.reminderSettings.daysBefore}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {reminderDaysOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} before
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  )
}