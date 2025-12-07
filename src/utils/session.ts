import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  access_token?: string
  refresh_token?: string
  user?: any
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'app-session',
    password: process.env.SESSION_SECRET || 'your-32-char-secret-key-here-123',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  })
}