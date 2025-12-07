import { createServerFn } from '@tanstack/react-start'
import { apiCall } from './proxy'
import { sanitizeFormData } from '@/utils/sanitization'

export const getFaqsFn = createServerFn({ method: 'GET' })
  .inputValidator((params: {
    page?: number
    page_size?: number
    query?: string
    slug?: string
    id?: string
    category_id?: string
  }) => params)
  .handler(async ({ data: params }) => {
    return apiCall({
      data: {
        url: '/cms/api/v1/faqs',
        method: 'GET',
        params: { ...params, _t: Date.now() }
      }
    })
  })

export const createFaqFn = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    question: string
    answer: string
    category_id: string
  }) => data)
  .handler(async ({ data }) => {
    const sanitizedData = sanitizeFormData(data)
    return apiCall({
      data: {
        url: '/cms/api/v1/faqs',
        method: 'POST',
        body: sanitizedData
      }
    })
  })

export const updateFaqFn = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    id: string
    question: string
    answer: string
    category_id: string
  }) => data)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data
    const sanitizedData = sanitizeFormData(updateData)
    return apiCall({
      data: {
        url: `/cms/api/v1/faqs/${id}`,
        method: 'PUT',
        body: sanitizedData
      }
    })
  })

export const deleteFaqFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiCall({
      data: {
        url: `/cms/api/v1/faqs/${data.id}/`,
        method: 'DELETE'
      }
    })
  })

export const restoreFaqFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiCall({
      data: {
        url: `/cms/api/v1/faqs/restore/${data.id}`,
        method: 'PATCH'
      }
    })
  })

export const hardDeleteFaqFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiCall({
      data: {
        url: `/cms/api/v1/faqs/hard-delete/${data.id}/`,
        method: 'DELETE'
      }
    })
  })
