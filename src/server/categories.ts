import { createServerFn } from '@tanstack/react-start'
import { apiCall } from './proxy'
import { sanitizeFormData } from '@/utils/sanitization'

export const getBlogCategoriesFn = createServerFn({ method: 'GET' })
  .inputValidator((params: { page?: number; page_size?: number; query?: string; id?: string }) => params)
  .handler(async ({ data: params }) => {
    const result = await apiCall({
      data: {
        url: '/cms/api/v1/blog/categories',
        method: 'GET',
        params
      }
    })
    return result
  })

export const createBlogCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    const sanitizedData = sanitizeFormData(data)
    const result = await apiCall({
      data: {
        url: '/cms/api/v1/blogs/categories',
        method: 'POST',
        body: sanitizedData
      }
    })
    return result
  })

export const updateBlogCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; title: string }) => data)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data
    const sanitizedData = sanitizeFormData(updateData)
    const result = await apiCall({
      data: {
        url: `/cms/api/v1/blog/categories/${id}`,
        method: 'PUT',
        body: sanitizedData
      }
    })
    return result
  })

export const deleteBlogCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const result = await apiCall({
      data: {
        url: `/cms/api/v1/blog/categories/${data.id}`,
        method: 'DELETE'
      }
    })
    return result
  })

export const getFaqCategoriesFn = createServerFn({ method: 'GET' })
  .inputValidator((params: { page?: number; page_size?: number; query?: string; id?: string }) => params)
  .handler(async ({ data: params }) => {
    const result = await apiCall({
      data: {
        url: '/cms/api/v1/faq/categories',
        method: 'GET',
        params
      }
    })
    return result
  })

export const createFaqCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    const sanitizedData = sanitizeFormData(data)
    const result = await apiCall({
      data: {
        url: '/cms/api/v1/faq/categories',
        method: 'POST',
        body: sanitizedData
      }
    })
    return result
  })

export const updateFaqCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; title: string }) => data)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data
    const sanitizedData = sanitizeFormData(updateData)
    const result = await apiCall({
      data: {
        url: `/cms/api/v1/faq/categories/${id}`,
        method: 'PUT',
        body: sanitizedData
      }
    })
    return result
  })

export const deleteFaqCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const result = await apiCall({
      data: {
        url: `/cms/api/v1/faq/categories/${data.id}`,
        method: 'DELETE'
      }
    })
    return result
  })