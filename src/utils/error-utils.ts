/**
 * Get user-friendly error message based on HTTP status code
 */
export function getErrorMessageByStatus(statusCode: number): string {
  const errorMessages: Record<number, string> = {
    400: 'Bad request. Please check your input and try again.',
    401: 'Authentication required. Please log in.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This request conflicts with existing data.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable. Please try again.',
    503: 'Service unavailable. Please try again later.',
    504: 'Request timeout. Please try again.',
  }

  return errorMessages[statusCode] || 'An unexpected error occurred. Please try again.'
}

/**
 * Extract error message from API response
 * Priority: response.detail > status code message > generic message
 */
export function getApiErrorMessage(error: unknown): string {
  // Handle Response object
  if (error instanceof Response) {
    return getErrorMessageByStatus(error.status)
  }

  // Handle error with response property (fetch errors)
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response

    // Try to get detail from response body if available
    if (response?.data?.detail) {
      return response.data.detail
    }

    // Use status code if available
    if (response?.status) {
      return getErrorMessageByStatus(response.status)
    }
  }

  // Handle error with detail property directly
  if (error && typeof error === 'object' && 'detail' in error) {
    return String((error as any).detail)
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred. Please try again.'
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Parse error from fetch response
 * Attempts to extract detail from response JSON
 */
export async function parseErrorFromResponse(response: Response): Promise<string> {
  console.log('🔍 Parsing error from response:', { 
    status: response.status, 
    statusText: response.statusText,
    contentType: response.headers.get('content-type')
  })
  
  try {
    const data = await response.json()
    console.log('📄 Response JSON data:', data)
    
    if (data.detail) {
      console.log('✅ Found detail in response:', data.detail)
      
      // Handle array of error objects (validation errors)
      if (Array.isArray(data.detail)) {
        // Check for database integrity errors
        const integrityError = data.detail.find((err: any) => err.type === 'IntegrityError')
        if (integrityError) {
          // Extract the constraint name and make it user-friendly
          const msg = integrityError.msg || ''
          
          // Handle duplicate key errors
          if (msg.includes('duplicate key value')) {
            // Try to extract the field name from the constraint
            const fieldMatch = msg.match(/constraint "(\w+)_(\w+)_key"/)
            if (fieldMatch) {
              const field = fieldMatch[2] // e.g., "title" from "blog_categories_title_key"
              return `A ${field} with this value already exists. Please use a different ${field}.`
            }
            return 'This item already exists. Please use a different value.'
          }
          
          // Handle foreign key errors
          if (msg.includes('foreign key constraint')) {
            return 'This operation cannot be completed because it would break data relationships.'
          }
          
          // Generic integrity error
          return 'This operation conflicts with existing data. Please check your input.'
        }
        
        // Handle other validation errors
        const errorMessages = data.detail
          .map((err: any) => err.msg || err.message)
          .filter(Boolean)
        
        if (errorMessages.length > 0) {
          return errorMessages.join('. ')
        }
      }
      
      // Handle string detail
      if (typeof data.detail === 'string') {
        return data.detail
      }
      
      // Handle object detail
      return JSON.stringify(data.detail)
    }
    
    console.log('⚠️ No detail key in response, using status code message')
  } catch (error) {
    console.log('⚠️ Failed to parse JSON, using status code message:', error)
  }

  const statusMessage = getErrorMessageByStatus(response.status)
  console.log('📋 Final error message:', statusMessage)
  return statusMessage
}
