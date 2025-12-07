import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { requireGuest } from '@/utils/auth-guard'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/logo'
import { loginFn } from '@/server/auth'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/contexts/toast-context'
import { sanitizeInput, validateEmail, validatePassword } from '@/utils/sanitization'

export const Route = createFileRoute('/auth/login')({
  loader: requireGuest,
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const { addToast } = useToast()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const sanitizedEmail = sanitizeInput(email)
    const sanitizedPassword = sanitizeInput(password)

    if (!validateEmail(sanitizedEmail)) {
      addToast('error', 'Please enter a valid email address')
      setIsLoading(false)
      return
    }

    const passwordValidation = validatePassword(sanitizedPassword)
    if (!passwordValidation.isValid) {
      addToast('error', passwordValidation.message!)
      setIsLoading(false)
      return
    }

    try {
      const result = await loginFn({ data: { email: sanitizedEmail, password: sanitizedPassword } })
      
      if (result.error) {
        addToast('error', result.error)
      } else if (result.success) {
        await refreshUser()
        addToast('success', 'Login successful! Redirecting...')
        navigate({ to: '/dashboard' })
      }
    } catch {
      addToast('error', 'An unexpected error occurred. Please try again.')
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
            <h1 className="text-3xl font-bold text-black mb-2">Administrator Login</h1>
            <p className="text-gray-600">Access your Viazuri admin dashboard</p>
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

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Signing In...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Forgot your password?{' '}
              <a href="/auth/reset-password" className="text-black font-medium hover:underline">
                Reset it here
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <div 
        className="w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(/images/hero-section.jpg)'
        }}
      >
        <div className="absolute inset-0 bg-[#1A365D]/70"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-bold">Viazuri.</h2>
        </div>
      </div>
    </div>
  )
}