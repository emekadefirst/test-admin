import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin-layout'
import { requireAuth } from '@/utils/auth-guard'

export const Route = createFileRoute('/security')({
  loader: requireAuth,
  component: SecurityPage,
})

function SecurityPage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#2D3748] mb-6">Security</h1>
        <p className="text-[#A0AEC0]">Security settings coming soon...</p>
      </div>
    </AdminLayout>
  )
}