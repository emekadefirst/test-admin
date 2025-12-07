import { createServerFn } from '@tanstack/react-start'
import { apiCall } from './proxy'
import { sanitizeFormData } from '@/utils/sanitization'

export const getBlogsFn = createServerFn({ method: 'GET' })
  .inputValidator((params: {
    page?: number
    page_size?: number
    query?: string
    id?: string
    slug?: string
    category_id?: string
  }) => params)
  .handler(async ({ data: params }) => {
    return apiCall({
      data: {
        url: '/cms/api/v1/blogs',
        method: 'GET',
        params: { ...params, _t: Date.now() }
      }
    })
  })

export const createBlogFn = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    title: string
    image_ids: string[]
    content: string
    category_id: string
    tags: string[]
    status: 'draft' | 'published'
  }) => data)
  .handler(async ({ data }) => {
    const sanitizedData = sanitizeFormData(data)
    return apiCall({
      data: {
        url: '/cms/api/v1/blogs',
        method: 'POST',
        body: sanitizedData
      }
    })
  })

export const updateBlogFn = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    id: string
    title: string
    image_ids: string[]
    content: string
    category_id: string
    tags: string[]
    status: 'draft' | 'published'
  }) => data)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data
    const sanitizedData = sanitizeFormData(updateData)
    return apiCall({
      data: {
        url: `/cms/api/v1/blog/${id}`,
        method: 'PUT',
        body: sanitizedData
      }
    })
  })

export const deleteBlogFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    console.log('🗑️ deleteBlogFn called with ID:', data.id)
    const result = await apiCall({
      data: {
        url: `/cms/api/v1/blogs/${data.id}`,
        method: 'DELETE'
      }
    })
    console.log('🗑️ Delete result:', result)
    return result
  })

export const hardDeleteBlogFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiCall({
      data: {
        url: `/cms/api/v1/blogs/hard-delete/${data.id}/`,
        method: 'DELETE'
      }
    })
  })

export const restoreBlogFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiCall({
      data: {
        url: `/cms/api/v1/blogs/restore/${data.id}`,
        method: 'PATCH'
      }
    })
  })
