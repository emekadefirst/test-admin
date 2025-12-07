export interface User {
  id: string
  username: string | null
  email: string
  profile_image: string | null
  banner_image: string | null
  first_name: string
  last_name: string
  follower_count: number
  following_count: number
  is_verified: boolean
  permissions: string[]
}
