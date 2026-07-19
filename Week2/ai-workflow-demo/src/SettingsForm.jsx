import { useState, useCallback, useMemo } from 'react'
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTheme,
  validateAll,
  hasErrors,
} from './utils/validation'

const initialFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  theme: 'light',
}

const initialTouched = {
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
  theme: false,
}

const fieldValidators = {
  fullName: validateFullName,
  email: validateEmail,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
  theme: validateTheme,
}

function SettingsForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(initialTouched)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  // Validate a single field
  const validateField = useCallback((name, value, allData) => {
    const validator = fieldValidators[name]
    if (!validator) return ''
    if (name === 'confirmPassword') {
      return validator(value, allData)
    }
    return validator(value)
  }, [])

  // Compute whether form is valid to enable submit
  const isValid = useMemo(() => {
    const currentErrors = validateAll(formData)
    return !hasErrors(currentErrors)
  }, [formData])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue }

      // Clear submit status on any change
      setSubmitStatus(null)

      // Validate the changed field
      const error = validateField(name, newValue, updated)
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))

      // If confirmPassword or password changed, re-validate confirmPassword
      if ((name === 'password' || name === 'confirmPassword') && touched.confirmPassword) {
        const confirmError = validateField(
          'confirmPassword',
          updated.confirmPassword,
          updated,
        )
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: confirmError }))
      }

      // If theme changed, validate it
      if (name === 'theme') {
        const themeError = validateField('theme', newValue, updated)
        setErrors((prevErrors) => ({ ...prevErrors, theme: themeError }))
      }

      return updated
    })
  }, [validateField, touched.confirmPassword])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    setFormData((prev) => {
      const error = validateField(name, prev[name], prev)
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))

      // Re-validate confirmPassword when password or confirmPassword loses focus
      if (name === 'confirmPassword' || name === 'password') {
        const confirmError = validateField(
          'confirmPassword',
          prev.confirmPassword,
          prev,
        )
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: confirmError }))
      }

      return prev
    })
  }, [validateField])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setIsSubmitting(true)
      setSubmitStatus(null)

      // Mark all fields as touched
      setTouched({
        fullName: true,
        email: true,
        password: true,
        confirmPassword: true,
        theme: true,
      })

      // Full validation
      const allErrors = validateAll(formData)
      setErrors(allErrors)

      if (hasErrors(allErrors)) {
        setIsSubmitting(false)
        return
      }

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setSubmitStatus('success')
        setFormData(initialFormData)
        setTouched(initialTouched)
        setErrors({})
      } catch {
        setSubmitStatus('error')
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData],
  )

  const handleReset = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    setTouched(initialTouched)
    setSubmitStatus(null)
  }, [])

  const getFieldClass = (fieldName) => {
    const base = 'settings-field'
    if (touched[fieldName]) {
      return errors[fieldName]
        ? `${base} settings-field--invalid`
        : `${base} settings-field--valid`
    }
    return base
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <h1 className="settings-title">Settings</h1>
      <p className="settings-subtitle">Manage your account settings</p>

      {submitStatus === 'success' && (
        <div className="settings-alert settings-alert--success" role="status">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l6.59-6.59L17 7l-8 8z" fill="currentColor"/>
          </svg>
          <span>Settings saved successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="settings-alert settings-alert--error" role="alert">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
          </svg>
          <span>Failed to save settings. Please try again.</span>
        </div>
      )}

      <fieldset className="settings-fieldset">
        <legend className="settings-legend">Profile Information</legend>

        <div className={getFieldClass('fullName')}>
          <label htmlFor="fullName" className="settings-label">
            Full Name <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="settings-input"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.fullName && !!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {touched.fullName && errors.fullName && (
            <p id="fullName-error" className="settings-error" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className={getFieldClass('email')}>
          <label htmlFor="email" className="settings-label">
            Email <span className="required" aria-hidden="true">*</span>
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
            aria-required="true"
            aria-invalid={touched.email && !!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {touched.email && errors.email && (
            <p id="email-error" className="settings-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="settings-fieldset">
        <legend className="settings-legend">Security</legend>

        <div className={getFieldClass('password')}>
          <label htmlFor="password" className="settings-label">
            Password <span className="required" aria-hidden="true">*</span>
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
            aria-required="true"
            aria-invalid={touched.password && !!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {touched.password && errors.password && (
            <p id="password-error" className="settings-error" role="alert">
              {errors.password}
            </p>
          )}
          <p className="settings-hint">Must be at least 8 characters</p>
        </div>

        <div className={getFieldClass('confirmPassword')}>
          <label htmlFor="confirmPassword" className="settings-label">
            Confirm Password <span className="required" aria-hidden="true">*</span>
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
            aria-required="true"
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
          <label htmlFor="theme" className="settings-label">
            Theme <span className="required" aria-hidden="true">*</span>
          </label>
          <select
            id="theme"
            name="theme"
            className="settings-input settings-select"
            value={formData.theme}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.theme && !!errors.theme}
            aria-describedby={errors.theme ? 'theme-error' : undefined}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
          {touched.theme && errors.theme && (
            <p id="theme-error" className="settings-error" role="alert">
              {errors.theme}
            </p>
          )}
        </div>
      </fieldset>

      <div className="settings-actions">
        <button
          type="submit"
          className="settings-btn settings-btn--primary"
          disabled={isSubmitting || !isValid}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="settings-spinner" aria-hidden="true"></span>
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