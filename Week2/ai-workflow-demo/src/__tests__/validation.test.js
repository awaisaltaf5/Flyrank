import { describe, it, expect } from 'vitest'
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTheme,
  validateAll,
  hasErrors,
} from '../utils/validation'

describe('validateFullName', () => {
  it('returns error for empty value', () => {
    expect(validateFullName('')).toBe('Full name is required')
  })

  it('returns error for whitespace-only value', () => {
    expect(validateFullName('   ')).toBe('Full name is required')
  })

  it('returns error for null', () => {
    expect(validateFullName(null)).toBe('Full name is required')
  })

  it('returns error for undefined', () => {
    expect(validateFullName(undefined)).toBe('Full name is required')
  })

  it('returns error for name shorter than 2 characters', () => {
    expect(validateFullName('A')).toBe('Full name must be at least 2 characters')
  })

  it('returns error for name longer than 100 characters', () => {
    const longName = 'A'.repeat(101)
    expect(validateFullName(longName)).toBe('Full name must be at most 100 characters')
  })

  it('returns empty string for valid name', () => {
    expect(validateFullName('John Doe')).toBe('')
  })

  it('returns empty string for name at minimum length', () => {
    expect(validateFullName('Jo')).toBe('')
  })

  it('returns empty string for name at maximum length', () => {
    const name = 'A'.repeat(100)
    expect(validateFullName(name)).toBe('')
  })

  it('trims whitespace before validation', () => {
    expect(validateFullName('  John  ')).toBe('')
  })
})

describe('validateEmail', () => {
  it('returns error for empty value', () => {
    expect(validateEmail('')).toBe('Email is required')
  })

  it('returns error for whitespace-only value', () => {
    expect(validateEmail('   ')).toBe('Email is required')
  })

  it('returns error for null', () => {
    expect(validateEmail(null)).toBe('Email is required')
  })

  it('returns error for undefined', () => {
    expect(validateEmail(undefined)).toBe('Email is required')
  })

  it('returns error for missing @ symbol', () => {
    expect(validateEmail('notanemail')).toBe('Please enter a valid email address')
  })

  it('returns error for missing domain', () => {
    expect(validateEmail('user@')).toBe('Please enter a valid email address')
  })

  it('returns error for missing username', () => {
    expect(validateEmail('@domain.com')).toBe('Please enter a valid email address')
  })

  it('returns error for missing TLD', () => {
    expect(validateEmail('user@domain')).toBe('Please enter a valid email address')
  })

  it('returns error for spaces in email', () => {
    expect(validateEmail('user @domain.com')).toBe('Please enter a valid email address')
  })

  it('returns empty string for valid email', () => {
    expect(validateEmail('user@example.com')).toBe('')
  })

  it('returns empty string for email with subdomain', () => {
    expect(validateEmail('user@sub.example.com')).toBe('')
  })

  it('returns empty string for email with plus addressing', () => {
    expect(validateEmail('user+tag@example.com')).toBe('')
  })

  it('trims whitespace before validation', () => {
    expect(validateEmail('  user@example.com  ')).toBe('')
  })
})

describe('validatePassword', () => {
  it('returns error for empty value', () => {
    expect(validatePassword('')).toBe('Password is required')
  })

  it('returns error for null', () => {
    expect(validatePassword(null)).toBe('Password is required')
  })

  it('returns error for undefined', () => {
    expect(validatePassword(undefined)).toBe('Password is required')
  })

  it('returns error for password shorter than 8 characters', () => {
    expect(validatePassword('Abc123')).toBe('Password must be at least 8 characters')
  })

  it('returns error for password longer than 128 characters', () => {
    const longPassword = 'A'.repeat(129)
    expect(validatePassword(longPassword)).toBe('Password must be at most 128 characters')
  })

  it('returns empty string for password at minimum length', () => {
    expect(validatePassword('abcdefgh')).toBe('')
  })

  it('returns empty string for password at maximum length', () => {
    const password = 'A'.repeat(128)
    expect(validatePassword(password)).toBe('')
  })

  it('returns empty string for valid password with mixed characters', () => {
    expect(validatePassword('MyP@ssw0rd!')).toBe('')
  })

  it('does not require uppercase, lowercase, or numbers (only min length)', () => {
    expect(validatePassword('12345678')).toBe('')
    expect(validatePassword('abcdefgh')).toBe('')
    expect(validatePassword('ABCDEFGH')).toBe('')
  })
})

describe('validateConfirmPassword', () => {
  it('returns error for empty value', () => {
    expect(validateConfirmPassword('', { password: 'test1234' })).toBe(
      'Please confirm your password',
    )
  })

  it('returns error for null', () => {
    expect(validateConfirmPassword(null, { password: 'test1234' })).toBe(
      'Please confirm your password',
    )
  })

  it('returns error for undefined', () => {
    expect(validateConfirmPassword(undefined, { password: 'test1234' })).toBe(
      'Please confirm your password',
    )
  })

  it('returns error when passwords do not match', () => {
    expect(validateConfirmPassword('different', { password: 'test1234' })).toBe(
      'Passwords do not match',
    )
  })

  it('returns empty string when passwords match', () => {
    expect(validateConfirmPassword('test1234', { password: 'test1234' })).toBe('')
  })

  it('returns empty string when both are empty and password is also empty', () => {
    expect(validateConfirmPassword('', { password: '' })).toBe(
      'Please confirm your password',
    )
  })
})

describe('validateTheme', () => {
  it('returns error for invalid theme', () => {
    expect(validateTheme('blue')).toBe('Please select a valid theme')
  })

  it('returns error for empty string', () => {
    expect(validateTheme('')).toBe('Please select a valid theme')
  })

  it('returns empty string for "light"', () => {
    expect(validateTheme('light')).toBe('')
  })

  it('returns empty string for "dark"', () => {
    expect(validateTheme('dark')).toBe('')
  })

  it('returns empty string for "system"', () => {
    expect(validateTheme('system')).toBe('')
  })
})

describe('validateAll', () => {
  it('returns errors for empty form data', () => {
    const errors = validateAll({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      theme: '',
    })

    expect(errors.fullName).toBeTruthy()
    expect(errors.email).toBeTruthy()
    expect(errors.password).toBeTruthy()
    expect(errors.confirmPassword).toBeTruthy()
    expect(errors.theme).toBeTruthy()
  })

  it('returns no errors for valid form data', () => {
    const errors = validateAll({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      theme: 'dark',
    })

    expect(errors.fullName).toBe('')
    expect(errors.email).toBe('')
    expect(errors.password).toBe('')
    expect(errors.confirmPassword).toBe('')
    expect(errors.theme).toBe('')
  })

  it('returns error for mismatched passwords', () => {
    const errors = validateAll({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'different',
      theme: 'light',
    })

    expect(errors.confirmPassword).toBe('Passwords do not match')
    expect(errors.fullName).toBe('')
    expect(errors.email).toBe('')
    expect(errors.password).toBe('')
  })
})

describe('hasErrors', () => {
  it('returns false for empty object', () => {
    expect(hasErrors({})).toBe(false)
  })

  it('returns false when all errors are empty strings', () => {
    expect(hasErrors({ name: '', email: '' })).toBe(false)
  })

  it('returns true when at least one error exists', () => {
    expect(hasErrors({ name: 'Required', email: '' })).toBe(true)
  })

  it('returns true when multiple errors exist', () => {
    expect(hasErrors({ name: 'Required', email: 'Invalid' })).toBe(true)
  })
})