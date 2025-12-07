import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { requireGuest } from '@/utils/auth-guard'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { sanitizeInput, validateEmail } from '@/utils/sanitization'

export const Route = createFileRoute('/auth/reset-password')({
  loader: requireGuest,
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const sanitizedEmail = sanitizeInput(email)

    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Call API to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate({ to: '/auth/verify-otp', search: { email: sanitizedEmail } })
    } catch {
      setError('Failed to send verification code')
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
            <h1 className="text-3xl font-bold text-black mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive a verification code</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Email"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
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
          <h2 className="text-4xl font-bold">Secure Access.</h2>
          <p className="text-lg mt-2">We'll help you get back to your account</p>
        </div>
      </div>
    </div>
  )
}
