import { createServerFn } from '@tanstack/react-start'

export const uploadFileFn = createServerFn({ method: 'POST' })
  .inputValidator((data: FormData) => data)
  .handler(async ({ data }) => {
    console.log('📤 Upload handler called')
    console.log('FormData entries:', Array.from(data.entries()).map(([key, value]) => ({
      key,
      type: value instanceof File ? 'File' : typeof value,
      name: value instanceof File ? value.name : value
    })))
    
    const session = await import('@/utils/session').then(m => m.useAppSession())
    const token = session.data.access_token
    
    console.log('🔑 Token available:', !!token)
    console.log('📡 Making upload request to:', 'https://service.viazuri.com/files/')
    
    const response = await fetch('https://service.viazuri.com/files/', {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: data
    })

    console.log('📥 Upload response status:', response.status)
    console.log('📥 Upload response content-type:', response.headers.get('content-type'))

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Upload failed:', error)
      throw new Error(error || 'Failed to upload file')
    }

    const result = await response.json()
    console.log('✅ Upload successful:', result)
    return result
  })
