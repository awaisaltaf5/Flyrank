/**
 * Reusable validation functions for the Settings form.
 * Each function returns an error string (empty string means valid).
 */

export function validateFullName(value) {
  if (!value || !value.trim()) {
    return 'Full name is required'
  }
  if (value.trim().length < 2) {
    return 'Full name must be at least 2 characters'
  }
  if (value.trim().length > 100) {
    return 'Full name must be at most 100 characters'
  }
  return ''
}

export function validateEmail(value) {
  if (!value || !value.trim()) {
    return 'Email is required'
  }
  // RFC 5322 simplified email regex
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'Please enter a valid email address'
  }
  return ''
}

export function validatePassword(value) {
  if (!value) {
    return 'Password is required'
  }
  if (value.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (value.length > 128) {
    return 'Password must be at most 128 characters'
  }
  return ''
}

export function validateConfirmPassword(value, formData) {
  if (!value) {
    return 'Please confirm your password'
  }
  if (value !== formData.password) {
    return 'Passwords do not match'
  }
  return ''
}

export function validateTheme(value) {
  const validThemes = ['light', 'dark', 'system']
  if (!validThemes.includes(value)) {
    return 'Please select a valid theme'
  }
  return ''
}

/**
 * Validates all fields in the form data.
 * Returns an object with field names as keys and error strings as values.
 */
export function validateAll(formData) {
  const errors = {}

  errors.fullName = validateFullName(formData.fullName)
  errors.email = validateEmail(formData.email)
  errors.password = validatePassword(formData.password)
  errors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData)
  errors.theme = validateTheme(formData.theme)

  return errors
}

/**
 * Checks if an errors object has any non-empty error strings.
 */
export function hasErrors(errors) {
  return Object.values(errors).some((error) => error !== '')
}