import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { requireGuest } from '@/utils/auth-guard'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { OtpInput } from '@/components/otp-input'
import { validateOTP } from '@/utils/sanitization'

export const Route = createFileRoute('/auth/verify-otp')({
  loader: async ({ search }) => {
    await requireGuest()
    if (!search.email) {
      throw redirect({ to: '/auth/reset-password' })
    }
  },
  component: VerifyOtpPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || '',
    }
  },
})

function VerifyOtpPage() {
  const navigate = useNavigate()
  const { email } = Route.useSearch()
  const [otp, setOtp] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!validateOTP(otp)) {
      setError('Please enter a valid 6-digit verification code')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Call API to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate({ to: '/auth/new-password', search: { email, otp } })
    } catch {
      setError('Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    try {
      // TODO: Call API to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch {
      setError('Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo mode="icon" className="mb-6" />
            <h1 className="text-3xl font-bold text-black mb-2">Enter Verification Code</h1>
            <p className="text-gray-600">
              We sent a code to <span className="font-medium text-black">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <OtpInput 
              value={otp}
              onChange={setOtp}
            />

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full h-12 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-600">
              Didn't receive the code?{' '}
              <button 
                onClick={handleResend}
                className="text-black font-medium hover:underline"
              >
                Resend
              </button>
            </p>
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
          backgroundImage: 'url(/images/hero-section.jpg)'
        }}
      >
        <div className="absolute inset-0 bg-[#1A365D]/70"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-bold">Almost There.</h2>
          <p className="text-lg mt-2">Just one more step to secure your account</p>
        </div>
      </div>
    </div>
  )
}
