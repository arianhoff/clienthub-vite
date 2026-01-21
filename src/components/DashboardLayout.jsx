import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import {
  MessageSquare,
  Inbox,
  Users,
  Calendar,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  AlertCircle
} from 'lucide-react'

export default function DashboardLayout() {
  const { user, profile, organization, signOut } = useAuth()
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ requests: 0, clients: 0, needsAttention: 0 })

  useEffect(() => {
    if (profile?.organization_id) {
      loadCounts()
    }
  }, [profile])

  async function loadCounts() {
    const { count: requestsCount } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id)
      .in('status', ['new', 'in_progress', 'review'])

    const { count: clientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id)

    const { count: attentionCount } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', profile.organization_id)
      .in('status', ['new', 'changes_requested'])

    setCounts({
      requests: requestsCount || 0,
      clients: clientsCount || 0,
      needsAttention: attentionCount || 0
    })
  }

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  const navigation = [
    { name: 'Solicitudes', href: '/dashboard', icon: Inbox, count: counts.requests },
    { name: 'Clientes', href: '/dashboard/clients', icon: Users, count: counts.clients },
    { name: 'Calendario', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Archivos', href: '/dashboard/files', icon: FolderOpen },
    { name: 'Reportes', href: '/dashboard/reports', icon: BarChart3 },
  ]

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">ClientHub</span>
          </div>
        </div>

        {/* Needs attention alert */}
        {counts.needsAttention > 0 && (
          <div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-2 text-yellow-800 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {counts.needsAttention} requieren atención
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {item.count > 0 && (
                <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-medium">
              {getInitials(profile?.full_name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{profile?.full_name}</div>
              <div className="text-xs text-gray-500 truncate">{organization?.name}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <NavLink
              to="/dashboard/settings"
              className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition text-sm"
            >
              <Settings className="w-4 h-4" />
              Ajustes
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Outlet context={{ loadCounts }} />
      </div>
    </div>
  )
}
