import { useAuth } from '@/contexts/auth-context'

function getCurrentDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function AdminHeader() {
  const { user } = useAuth()

  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="bg-white rounded-lg py-3 flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome Back! <span className="text-[#1A365D]">{user?.first_name} {user?.last_name}</span>
            {user?.is_verified && (
              <span className="bg-blue-100 text-[#1A365D] text-xs px-2 py-1 rounded-full font-medium border border-blue-200">
                Verified
              </span>
            )}
          </h1>
        </div>

        <div>
          <p className="text-sm text-gray-500 mt-2">{getCurrentDate()}</p>
        </div>
      </div>
    </div>
  )
}