import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from '@/utils/session'
import { parseErrorFromResponse } from '@/utils/error-utils'
import { sanitizeFormData } from '@/utils/sanitization'

const API_BASE_URL = 'https://service.viazuri.com'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const sanitizedData = sanitizeFormData(data)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      })

      if (!response.ok) {
        const errorMessage = await parseErrorFromResponse(response)
        return { error: errorMessage }
      }

      const tokens = await response.json()
      const session = await useAppSession()
      
      await session.update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      })

      return { success: true }
    } catch {
      return { error: 'Network error. Please check your connection and try again.' }
    }
  })

export const getUserFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const session = await useAppSession()
    const token = session.data.access_token

    if (!token) {
      return null
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/whoami`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        return null
      }

      const userData = await response.json()
      return userData
    } catch {
      return null
    }
  })

export const logoutFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    const session = await useAppSession()
    await session.clear()
    return { success: true }
  })