export interface CreateFaqRequest {
  question: string
  answer: string
  category_id: string
}

export interface FaqResponse {
  id: string
  created_at: string
  updated_at: string
  question: string
  answer: string
  category: string
}

export interface GetFaqsResponse {
  page: number
  page_size: number
  count: number
  data: FaqResponse[]
}

export interface GetFaqsParams {
  page?: number
  page_size?: number
  id?: string
  slug?: string
  category_id?: string
}