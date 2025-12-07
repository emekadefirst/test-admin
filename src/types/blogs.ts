export interface CreateBlogRequest {
  title: string
  image_ids: string[]
  content: string
  category_id: string
  tags: string[]
  status: 'draft' | 'published'
}

export interface BlogResponse {
  id: string
  created_at: string
  updated_at: string
  title: string
  image_ids: string[]
  content: string
  category: string
  tags: string[]
  slug: string
  status: 'draft' | 'published'
}

export interface GetBlogsResponse {
  page: number
  page_size: number
  count: number
  data: BlogResponse[]
}

export interface GetBlogsParams {
  page?: number
  page_size?: number
  query?: string
  id?: string
  slug?: string
  category_id?: string
}