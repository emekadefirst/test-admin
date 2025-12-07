import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  HelpCircle,
  Users,
  LogOut
} from 'lucide-react'
import { Logo } from './logo'
import { logoutFn } from '@/server/auth'

const menuItems = [
  { icon: LayoutDashboard, name: 'Dashboard', href: '/dashboard' },
  { icon: FolderOpen, name: 'Categories', href: '/categories' },
  { icon: FileText, name: 'Blogs', href: '/blogs' },
  { icon: HelpCircle, name: 'FAQs', href: '/faqs' },
  { icon: Users, name: 'Subscribers', href: '/subscribers' },
  { icon: LogOut, name: 'Logout', action: 'logout' },
]

export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutFn()
    navigate({ to: '/auth/login' })
  }

  return (
    <div className="w-64 bg-[#0F172A] h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <Logo mode="logotext" theme="light" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon

          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium text-white/80 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.name}
              to={item.href!}
              className={`flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'text-white bg-white/20 border-l-4 border-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}