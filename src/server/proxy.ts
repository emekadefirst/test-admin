import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from '@/utils/session'
import { parseErrorFromResponse } from '@/utils/error-utils'

const API_BASE_URL = 'https://service.viazuri.com'

export const apiCall = createServerFn({ method: 'POST' })
  .inputValidator((data: { url: string; method: string; body?: any; params?: Record<string, any> }) => data)
  .handler(async ({ data }) => {
    try {
      const session = await useAppSession()
      const token = session.data.access_token

      let url = `${API_BASE_URL}${data.url}`
      if (data.params) {
        const searchParams = new URLSearchParams()
        Object.entries(data.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        })
        const separator = url.includes('?') ? '&' : '?'
        url += `${separator}${searchParams.toString()}`
      }

      const response = await fetch(url, {
        method: data.method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: data.body ? JSON.stringify(data.body) : undefined,
      })

      if (!response.ok) {
        const errorMessage = await parseErrorFromResponse(response)
        console.error('[API Error]', errorMessage)
        return {
          ok: false,
          status: response.status,
          error: errorMessage,
          data: null
        }
      }

      const contentType = response.headers.get('content-type')
      let responseData
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        const text = await response.text()
        responseData = { message: text }
      }

      return {
        ok: true,
        status: response.status,
        data: responseData
      }
    } catch (error) {
      console.error('[Proxy Error]', error)
      return {
        ok: false,
        status: 0,
        error: 'Network error. Please check your connection and try again.',
        data: null
      }
    }
  })