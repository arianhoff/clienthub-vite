import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MessageSquare, Bell, LogOut } from 'lucide-react'

export default function PortalLayout() {
  const { profile, organization, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/portal/login')
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold">{organization?.name}</div>
                <div className="text-xs text-gray-500">Portal de cliente</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-medium text-sm">
                  {getInitials(profile?.full_name)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{profile?.full_name}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
