import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsForm from '../SettingsForm'

// Helper to fill in valid form data using placeholder text for unique identification
async function fillValidForm(user) {
  await user.type(screen.getByPlaceholderText('Enter your full name'), 'John Doe')
  await user.type(screen.getByPlaceholderText('you@example.com'), 'john@example.com')
  await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
  await user.type(screen.getByPlaceholderText('Re-enter your password'), 'password123')
}

describe('SettingsForm', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders all form fields', () => {
    render(<SettingsForm />)

    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Re-enter your password')).toBeInTheDocument()
    expect(screen.getByLabelText(/theme/i)).toBeInTheDocument()
  })

  it('renders the submit button disabled initially (form is invalid)', () => {
    render(<SettingsForm />)

    const submitButton = screen.getByRole('button', { name: /save settings/i })
    expect(submitButton).toBeDisabled()
  })

  it('renders the reset button', () => {
    render(<SettingsForm />)

    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('shows inline error for full name when blurred empty', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    const nameInput = screen.getByPlaceholderText('Enter your full name')
    await user.click(nameInput)
    await user.tab() // blur

    expect(screen.getByText('Full name is required')).toBeInTheDocument()
  })

  it('shows inline error for email when blurred empty', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    const emailInput = screen.getByPlaceholderText('you@example.com')
    await user.click(emailInput)
    await user.tab()

    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('shows inline error for invalid email format', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    const emailInput = screen.getByPlaceholderText('you@example.com')
    await user.type(emailInput, 'notanemail')
    await user.tab()

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
  })

  it('shows inline error for password shorter than 8 characters', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    const passwordInput = screen.getByPlaceholderText('Enter your password')
    await user.type(passwordInput, 'Abc12')
    await user.tab()

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
  })

  it('shows inline error when confirm password does not match', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const confirmInput = screen.getByPlaceholderText('Re-enter your password')

    await user.type(passwordInput, 'password123')
    await user.type(confirmInput, 'different')
    await user.tab()

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })

  it('enables submit button when all fields are valid', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    await fillValidForm(user)

    const submitButton = screen.getByRole('button', { name: /save settings/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('disables submit button when form is invalid', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    // Fill in only some fields
    await user.type(screen.getByPlaceholderText('Enter your full name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'john@example.com')

    const submitButton = screen.getByRole('button', { name: /save settings/i })
    expect(submitButton).toBeDisabled()
  })

  it('shows success message after valid submission', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    await fillValidForm(user)

    const submitButton = screen.getByRole('button', { name: /save settings/i })
    await user.click(submitButton)

    // Fast-forward past the simulated API call (1500ms) using act
    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument()
  })

  it('shows submitting state on button while saving', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    await fillValidForm(user)

    const submitButton = screen.getByRole('button', { name: /save settings/i })
    await user.click(submitButton)

    // Button should show "Saving..." and be disabled
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    await fillValidForm(user)

    const resetButton = screen.getByRole('button', { name: /reset/i })
    await user.click(resetButton)

    // All inputs should be empty
    expect(screen.getByPlaceholderText('Enter your full name')).toHaveValue('')
    expect(screen.getByPlaceholderText('you@example.com')).toHaveValue('')
    expect(screen.getByPlaceholderText('Enter your password')).toHaveValue('')
    expect(screen.getByPlaceholderText('Re-enter your password')).toHaveValue('')
    expect(screen.getByLabelText(/theme/i)).toHaveValue('light')

    // Submit button should be disabled again
    expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled()
  })

  it('clears errors when reset is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    // Trigger some errors
    const nameInput = screen.getByPlaceholderText('Enter your full name')
    await user.click(nameInput)
    await user.tab()

    expect(screen.getByText('Full name is required')).toBeInTheDocument()

    // Reset
    await user.click(screen.getByRole('button', { name: /reset/i }))

    expect(screen.queryByText('Full name is required')).not.toBeInTheDocument()
  })

  it('re-validates confirm password when password changes', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SettingsForm />)

    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const confirmInput = screen.getByPlaceholderText('Re-enter your password')

    // Type matching passwords
    await user.type(passwordInput, 'password123')
    await user.type(confirmInput, 'password123')
    await user.tab()

    // No error should show
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument()

    // Change password to something different
    await user.clear(passwordInput)
    await user.type(passwordInput, 'newpassword456')

    // Confirm password should now show mismatch
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<SettingsForm />)

    // All required fields should have aria-required
    expect(screen.getByPlaceholderText('Enter your full name')).toHaveAttribute('aria-required', 'true')
    expect(screen.getByPlaceholderText('you@example.com')).toHaveAttribute('aria-required', 'true')
    expect(screen.getByPlaceholderText('Enter your password')).toHaveAttribute('aria-required', 'true')
    expect(screen.getByPlaceholderText('Re-enter your password')).toHaveAttribute('aria-required', 'true')
    expect(screen.getByLabelText(/theme/i)).toHaveAttribute('aria-required', 'true')

    // Form should have noValidate attribute
    const form = document.querySelector('form')
    expect(form).toHaveAttribute('novalidate')
  })

  it('uses semantic HTML elements', () => {
    render(<SettingsForm />)

    expect(document.querySelector('form')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Settings')
    expect(screen.getAllByRole('group')).toHaveLength(3) // 3 fieldsets
  })
})