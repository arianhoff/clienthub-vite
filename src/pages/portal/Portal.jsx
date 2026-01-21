import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { Plus, Inbox, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function Portal() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (profile?.client_id) loadRequests()
  }, [profile])

  async function loadRequests() {
    const { data } = await supabase
      .from('requests')
      .select('*')
      .eq('client_id', profile.client_id)
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  const filteredRequests = requests.filter(r => {
    if (filter === 'in_progress') return r.status === 'in_progress'
    if (filter === 'review') return r.status === 'review'
    if (filter === 'completed') return ['completed', 'approved'].includes(r.status)
    return true
  })

  const stats = {
    total: requests.length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    review: requests.filter(r => r.status === 'review').length,
    completed: requests.filter(r => ['completed', 'approved'].includes(r.status)).length,
  }

  const statusConfig = {
    new: { label: 'Nueva', color: 'bg-green-100 text-green-700' },
    in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-700' },
    review: { label: 'En revisión', color: 'bg-yellow-100 text-yellow-700' },
    completed: { label: 'Completada', color: 'bg-gray-100 text-gray-700' },
    approved: { label: 'Aprobada', color: 'bg-green-100 text-green-700' },
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Hola, {profile?.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-600">Acá podés ver y gestionar todas tus solicitudes</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card"><div className="text-2xl font-bold">{stats.total}</div><div className="text-sm text-gray-500">Total</div></div>
        <div className="card"><div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div><div className="text-sm text-gray-500">En progreso</div></div>
        <div className="card"><div className="text-2xl font-bold text-yellow-600">{stats.review}</div><div className="text-sm text-gray-500">Por aprobar</div></div>
        <div className="card"><div className="text-2xl font-bold text-green-600">{stats.completed}</div><div className="text-sm text-gray-500">Completadas</div></div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg">Tus solicitudes</h2>
        <Link to="/portal/requests/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />Nueva solicitud
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ key: 'all', label: 'Todas' }, { key: 'in_progress', label: 'En progreso' }, { key: 'review', label: 'Por aprobar' }, { key: 'completed', label: 'Completadas' }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-lg font-medium transition ${filter === f.key ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Cargando...</div> : filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay solicitudes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map(r => (
            <Link key={r.id} to={`/portal/requests/${r.id}`} className="card flex items-center justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[r.status]?.color}`}>{statusConfig[r.status]?.label}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(r.created_at)}
                  {r.due_date && <span> • Entrega: {formatDate(r.due_date)}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
