import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin-layout'
import { useAuth } from '@/contexts/auth-context'
import { requireAuth } from '@/utils/auth-guard'

export const Route = createFileRoute('/dashboard')({
  loader: requireAuth,
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2D3748]">Dashboard</h1>
          <p className="text-[#A0AEC0] mt-2">Welcome back, {user?.first_name}!</p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#2D3748] mb-2">Dashboard Under Construction</h2>
            <p className="text-[#A0AEC0]">We're working hard to bring you an amazing dashboard experience.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}