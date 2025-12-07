import { redirect } from '@tanstack/react-router'
import { getUserFn } from '@/server/auth'

export async function requireAuth() {
  try {
    const userData = await getUserFn()
    if (!userData?.results?.[0]) {
      throw redirect({ to: '/auth/login' })
    }
    return userData.results[0]
  } catch {
    throw redirect({ to: '/auth/login' })
  }
}

export async function requireGuest() {
  try {
    const userData = await getUserFn()
    if (userData?.results?.[0]) {
      throw redirect({ to: '/dashboard' })
    }
  } catch {
    // User not authenticated, allow access
  }
}

export async function requireGuestWithFlow({ search }: { search: any }) {
  await requireGuest()
  return search
}