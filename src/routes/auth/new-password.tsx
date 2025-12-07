import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { requireGuest } from '@/utils/auth-guard'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { sanitizeInput, validatePassword } from '@/utils/sanitization'

export const Route = createFileRoute('/auth/new-password')({
  loader: async () => {
    await requireGuest()
  },
  beforeLoad: ({ search }) => {
    if (!search.email || !search.otp) {
      throw redirect({ to: '/auth/reset-password' })
    }
  },
  component: NewPasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || '',
      otp: (search.otp as string) || '',
    }
  },
})

function NewPasswordPage() {
  const navigate = useNavigate()
  // const { email } = Route.useSearch()
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const sanitizedNewPassword = sanitizeInput(newPassword)
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword)

    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    const passwordValidation = validatePassword(sanitizedNewPassword)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message!)
      setIsLoading(false)
      return
    }

    try {
      // TODO: Call API to reset password with email, otp, and newPassword
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate({ to: '/auth/login' })
    } catch {
      setError('Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo mode="icon" className="mb-6" />
            <h1 className="text-3xl font-bold text-black mb-2">Create New Password</h1>
            <p className="text-gray-600">Enter a strong password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="New Password"
                required
              />
            </div>

            <div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Confirm New Password"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="text-sm text-gray-600">
              <p>Password must:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Be at least 8 characters long</li>
                <li>Match in both fields</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <a href="/auth/login" className="text-black font-medium hover:underline">
                Back to login
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div 
        className="w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(/images/tier3.jpg)'
        }}
      >
        <div className="absolute inset-0 bg-[#1A365D]/70"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-bold">New Beginning.</h2>
          <p className="text-lg mt-2">Set a strong password to protect your account</p>
        </div>
      </div>
    </div>
  )
}
