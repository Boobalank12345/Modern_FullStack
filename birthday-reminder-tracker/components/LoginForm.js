import { useState } from 'react'

export default function LoginForm({ 
  onSubmit, 
  isLoading = false, 
  error = '', 
  submitButtonText = 'Sign In' 
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit(formData.email.trim(), formData.password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              validationErrors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        {validationErrors.email && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10 ${
              validationErrors.password ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading && (
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </span>
          )}
          {isLoading ? 'Signing in...' : submitButtonText}
        </button>
      </div>

      {/* Additional Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </form>
  )
}