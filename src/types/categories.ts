export interface CreateCategoryRequest {
  title: string
}

export interface CategoryResponse {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface GetCategoriesParams {
  page?: number
  page_size?: number
  query?: string
  id?: string
}