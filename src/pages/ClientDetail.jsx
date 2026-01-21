import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Plus, Mail, Phone, FileText } from 'lucide-react'

export default function ClientDetail() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClient()
  }, [id])

  async function loadClient() {
    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (clientData) {
      setClient(clientData)
      const { data: requestsData } = await supabase
        .from('requests')
        .select('*')
        .eq('client_id', id)
        .order('created_at', { ascending: false })
      setRequests(requestsData || [])
    }
    setLoading(false)
  }

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const statusConfig = {
    new: { label: 'Nueva', color: 'bg-green-100 text-green-700' },
    in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-700' },
    review: { label: 'En revisión', color: 'bg-yellow-100 text-yellow-700' },
    completed: { label: 'Completada', color: 'bg-gray-100 text-gray-700' },
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Cargando...</div>
  if (!client) return <div className="flex items-center justify-center h-64 text-gray-500">Cliente no encontrado</div>

  const activeRequests = requests.filter(r => !['completed', 'approved'].includes(r.status))

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/clients" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium" style={{ backgroundColor: client.color }}>{getInitials(client.name)}</div>
            <div>
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <p className="text-gray-500 text-sm">{requests.length} solicitudes</p>
            </div>
          </div>
          <Link to={`/dashboard/requests/new?client=${id}`} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />Nueva solicitud
          </Link>
        </div>
      </header>

      <div className="p-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 card">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" />Solicitudes ({activeRequests.length})</h2>
          {activeRequests.length === 0 ? <p className="text-gray-500">No hay solicitudes activas</p> : (
            <div className="space-y-3">
              {activeRequests.map(r => (
                <Link key={r.id} to={`/dashboard/requests/${r.id}`} className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100">
                  <span className="font-medium">{r.title}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${statusConfig[r.status]?.color}`}>{statusConfig[r.status]?.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Contacto</h2>
          {client.contact_email ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{client.contact_email}</div>
              {client.contact_phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{client.contact_phone}</div>}
            </div>
          ) : <p className="text-gray-500 text-sm">Sin información</p>}
        </div>
      </div>
    </>
  )
}
