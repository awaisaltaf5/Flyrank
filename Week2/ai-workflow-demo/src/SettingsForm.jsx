import { useState, useCallback } from 'react'

const validators = {
  username: (value) => {
    if (!value.trim()) return 'Username is required'
    if (value.trim().length < 3) return 'Username must be at least 3 characters'
    if (value.trim().length > 20) return 'Username must be at most 20 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) return 'Username can only contain letters, numbers, and underscores'
    return ''
  },
  email: (value) => {
    if (!value.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address'
    return ''
  },
  password: (value) => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
    return ''
  },
  confirmPassword: (value, formData) => {
    if (!value) return 'Please confirm your password'
    if (value !== formData.password) return 'Passwords do not match'
    return ''
  },
  age: (value) => {
    if (!value) return 'Age is required'
    const num = Number(value)
    if (isNaN(num) || !Number.isInteger(num)) return 'Age must be a whole number'
    if (num < 13) return 'You must be at least 13 years old'
    if (num > 120) return 'Please enter a valid age'
    return ''
  },
  website: (value) => {
    if (!value.trim()) return ''
    try {
      new URL(value.trim().startsWith('http') ? value.trim() : `https://${value.trim()}`)
      return ''
    } catch {
      return 'Please enter a valid URL'
    }
  },
  bio: (value) => {
    if (value.length > 500) return 'Bio must be at most 500 characters'
    return ''
  },
}

const initialFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  website: '',
  bio: '',
  theme: 'light',
  notifications: true,
}

const initialErrors = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  website: '',
  bio: '',
}

function SettingsForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState(initialErrors)
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  const validateField = useCallback((name, value, allData) => {
    const validator = validators[name]
    if (!validator) return ''
    return validator(value, allData)
  }, [])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue }

      // Clear submit status on any change
      if (submitStatus) setSubmitStatus(null)

      // Validate the changed field
      const error = validateField(name, newValue, updated)
      setErrors((prev) => ({ ...prev, [name]: error }))

      // If confirmPassword changed or password changed, re-validate confirmPassword
      if ((name === 'password' || name === 'confirmPassword') && touched.confirmPassword) {
        const confirmError = validateField('confirmPassword', updated.confirmPassword, updated)
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
      }

      return updated
    })
  }, [validateField, submitStatus, touched.confirmPassword])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate on blur
    setFormData((prev) => {
      const error = validateField(name, prev[name], prev)
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))

      // If confirmPassword blurred, validate it
      if (name === 'confirmPassword' || name === 'password') {
        const confirmError = validateField('confirmPassword', prev.confirmPassword, prev)
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: confirmError }))
      }

      return prev
    })
  }, [validateField])

  const validateAll = useCallback((data) => {
    const newErrors = {}
    let isValid = true

    for (const field of Object.keys(initialErrors)) {
      const error = validateField(field, data[field], data)
      newErrors[field] = error
      if (error) isValid = false
    }

    setErrors(newErrors)
    setTouched(
      Object.keys(initialErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    )

    return isValid
  }, [validateField])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    if (!validateAll(formData)) {
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitStatus('success')
      setFormData(initialFormData)
      setTouched({})
      setErrors(initialErrors)
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateAll])

  const handleReset = useCallback(() => {
    setFormData(initialFormData)
    setErrors(initialErrors)
    setTouched({})
    setSubmitStatus(null)
  }, [])

  const getFieldClass = (fieldName) => {
    const base = 'settings-field'
    if (touched[fieldName]) {
      return errors[fieldName] ? `${base} settings-field--invalid` : `${base} settings-field--valid`
    }
    return base
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <h2 className="settings-title">Account Settings</h2>
      <p className="settings-subtitle">Manage your account preferences and security</p>

      {submitStatus === 'success' && (
        <div className="settings-alert settings-alert--success">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l6.59-6.59L17 7l-8 8z" fill="currentColor"/>
          </svg>
          <span>Settings saved successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="settings-alert settings-alert--error">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
          </svg>
          <span>Failed to save settings. Please try again.</span>
        </div>
      )}

      <fieldset className="settings-fieldset">
        <legend className="settings-legend">Profile Information</legend>

        <div className={getFieldClass('username')}>
          <label htmlFor="username" className="settings-label">
            Username <span className="required">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="settings-input"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.username && !!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          {touched.username && errors.username && (
            <p id="username-error" className="settings-error" role="alert">
              {errors.username}
            </p>
          )}
          <p className="settings-hint">3-20 characters, letters, numbers, and underscores only</p>
        </div>

        <div className={getFieldClass('email')}>
          <label htmlFor="email" className="settings-label">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="settings-input"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.email && !!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {touched.email && errors.email && (
            <p id="email-error" className="settings-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className={getFieldClass('age')}>
          <label htmlFor="age" className="settings-label">
            Age <span className="required">*</span>
          </label>
          <input
            id="age"
            name="age"
            type="number"
            className="settings-input"
            placeholder="Enter your age"
            min="13"
            max="120"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.age && !!errors.age}
            aria-describedby={errors.age ? 'age-error' : undefined}
          />
          {touched.age && errors.age && (
            <p id="age-error" className="settings-error" role="alert">
              {errors.age}
            </p>
          )}
        </div>

        <div className={getFieldClass('website')}>
          <label htmlFor="website" className="settings-label">Website</label>
          <input
            id="website"
            name="website"
            type="url"
            className="settings-input"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.website && !!errors.website}
            aria-describedby={errors.website ? 'website-error' : undefined}
          />
          {touched.website && errors.website && (
            <p id="website-error" className="settings-error" role="alert">
              {errors.website}
            </p>
          )}
        </div>

        <div className={getFieldClass('bio')}>
          <label htmlFor="bio" className="settings-label">Bio</label>
          <textarea
            id="bio"
            name="bio"
            className="settings-input settings-textarea"
            placeholder="Tell us about yourself..."
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.bio && !!errors.bio}
            aria-describedby={errors.bio ? 'bio-error' : undefined}
          />
          {touched.bio && errors.bio && (
            <p id="bio-error" className="settings-error" role="alert">
              {errors.bio}
            </p>
          )}
          <p className="settings-hint">{formData.bio.length}/500 characters</p>
        </div>
      </fieldset>

      <fieldset className="settings-fieldset">
        <legend className="settings-legend">Security</legend>

        <div className={getFieldClass('password')}>
          <label htmlFor="password" className="settings-label">
            Password <span className="required">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="settings-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.password && !!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {touched.password && errors.password && (
            <p id="password-error" className="settings-error" role="alert">
              {errors.password}
            </p>
          )}
          <p className="settings-hint">At least 8 characters with uppercase, lowercase, and a number</p>
        </div>

        <div className={getFieldClass('confirmPassword')}>
          <label htmlFor="confirmPassword" className="settings-label">
            Confirm Password <span className="required">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="settings-input"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p id="confirmPassword-error" className="settings-error" role="alert">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="settings-fieldset">
        <legend className="settings-legend">Preferences</legend>

        <div className="settings-field">
          <label htmlFor="theme" className="settings-label">Theme</label>
          <select
            id="theme"
            name="theme"
            className="settings-input settings-select"
            value={formData.theme}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="settings-field settings-field--checkbox">
          <label className="settings-checkbox-label">
            <input
              name="notifications"
              type="checkbox"
              className="settings-checkbox"
              checked={formData.notifications}
              onChange={handleChange}
            />
            <span className="settings-checkbox-custom">
              {formData.notifications && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className="settings-checkbox-text">Enable email notifications</span>
          </label>
        </div>
      </fieldset>

      <div className="settings-actions">
        <button
          type="submit"
          className="settings-btn settings-btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="settings-spinner"></span>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
        <button
          type="button"
          className="settings-btn settings-btn--secondary"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Reset
        </button>
      </div>
    </form>
  )
}

export default SettingsForm