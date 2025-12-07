import validator from 'validator'

export const sanitizeInput = (input: string): string => {
  // Basic sanitization that works in both client and server environments
  return input.trim().replace(/[<>"'&]/g, (match) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    }
    return entities[match] || match
  })
}

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email) && email.length <= 254
}

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' }
  }
  return { isValid: true }
}

export const validateOTP = (otp: string): boolean => {
  return validator.isNumeric(otp) && otp.length === 6
}

export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = {} as T
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }
  return sanitized
}