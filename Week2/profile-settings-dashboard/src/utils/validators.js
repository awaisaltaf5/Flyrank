export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Email is required.';
  }
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email is required.';
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(trimmed) ? '' : 'Please enter a valid email address.';
}

export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return 'Username is required.';
  }
  const trimmed = username.trim();
  if (!trimmed) {
    return 'Username is required.';
  }
  if (trimmed.length < 3) {
    return 'Username must be at least 3 characters.';
  }
  if (trimmed.length > 20) {
    return 'Username must be at most 20 characters.';
  }
  return '';
}

export function validateForm(values) {
  const errors = {
    username: validateUsername(values.username),
    email: validateEmail(values.email)
  };
  return {
    isValid: !errors.username && !errors.email,
    errors
  };
}