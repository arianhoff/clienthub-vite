import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { 
  Plus, 
  Search, 
  Inbox, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  MoreVertical
} from 'lucide-react'

export default function Dashboard() {
  const { profile } = useAuth()
  const { loadCounts } = useOutletContext()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (profile?.organization_id) {
      loadRequests()
    }
  }, [profile, filter])

  async function loadRequests() {
    setLoading(true)
    
    let query = supabase
      .from('requests')
      .select('*, clients(name, color)')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false })

    if (filter === 'new') {
      query = query.eq('status', 'new')
    } else if (filter === 'in_progress') {
      query = query.eq('status', 'in_progress')
    } else if (filter === 'review') {
      query = query.in('status', ['review', 'changes_requested'])
    } else if (filter === 'completed') {
      query = query.in('status', ['completed', 'approved'])
    }

    const { data } = await query
    setRequests(data || [])
    setLoading(false)
  }

  // Calculate stats
  const stats = {
    total: requests.length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    review: requests.filter(r => ['review', 'changes_requested'].includes(r.status)).length,
    completed: requests.filter(r => ['completed', 'approved'].includes(r.status)).length,
  }

  const newRequests = requests.filter(r => r.status === 'new').length
  const overdueRequests = requests.filter(r => {
    if (!r.due_date || ['completed', 'approved'].includes(r.status)) return false
    return new Date(r.due_date) < new Date()
  }).length

  const filteredRequests = requests.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const statusConfig = {
    new: { label: 'Nueva', color: 'bg-green-100 text-green-700' },
    in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-700' },
    review: { label: 'En revisión', color: 'bg-yellow-100 text-yellow-700' },
    changes_requested: { label: 'Cambios', color: 'bg-orange-100 text-orange-700' },
    completed: { label: 'Completada', color: 'bg-gray-100 text-gray-700' },
    approved: { label: 'Aprobada', color: 'bg-green-100 text-green-700' },
  }

  const formatDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
  }

  const isOverdue = (dueDate, status) => {
    if (!dueDate || ['completed', 'approved'].includes(status)) return false
    return new Date(dueDate) < new Date()
  }

  const getRelativeTime = (date) => {
    const now = new Date()
    const d = new Date(date)
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays === 1) return 'Ayer'
    return `Hace ${diffDays} días`
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Solicitudes</h1>
            <p className="text-gray-500 text-sm">Gestioná las solicitudes de tus clientes</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <Link to="/dashboard/requests/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nueva solicitud
            </Link>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Alerts */}
        {(newRequests > 0 || overdueRequests > 0) && (
          <div className="space-y-3 mb-6">
            {newRequests > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <span className="font-medium text-yellow-800">{newRequests} solicitudes requieren tu atención</span>
                  <span className="text-yellow-700"> - {newRequests} nuevas</span>
                </div>
              </div>
            )}
            {overdueRequests > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <span className="font-medium text-red-800">{overdueRequests} solicitudes vencidas</span>
                  <span className="text-red-700"> - Estas solicitudes pasaron su fecha de entrega</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Inbox className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-500">Total solicitudes</div>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-500">En progreso</div>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.review}</div>
              <div className="text-sm text-gray-500">Esperando aprobación</div>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completadas</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'new', label: 'Nuevas' },
            { key: 'in_progress', label: 'En progreso' },
            { key: 'review', label: 'Esperando' },
            { key: 'completed', label: 'Completadas' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-1">No hay solicitudes</h3>
            <p className="text-gray-500 mb-4">Creá tu primera solicitud para empezar</p>
            <Link to="/dashboard/requests/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nueva solicitud
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map(request => (
              <Link
                key={request.id}
                to={`/dashboard/requests/${request.id}`}
                className="card flex items-center gap-4 hover:shadow-md transition"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: request.clients?.color + '20' || '#f3f4f6' }}
                >
                  <MessageSquare 
                    className="w-5 h-5" 
                    style={{ color: request.clients?.color || '#6b7280' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[request.status]?.color}`}>
                      {statusConfig[request.status]?.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{request.clients?.name}</span>
                    <span>•</span>
                    <span>{getRelativeTime(request.created_at)}</span>
                    {request.due_date && (
                      <>
                        <span>•</span>
                        <span className={isOverdue(request.due_date, request.status) ? 'text-red-600 font-medium' : ''}>
                          Vence: {formatDate(request.due_date)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
