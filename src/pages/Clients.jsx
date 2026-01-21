import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Plus, Search, Users, Mail } from 'lucide-react'

export default function Clients() {
  const { profile } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (profile?.organization_id) {
      loadClients()
    }
  }, [profile])

  async function loadClients() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false })

    setClients(data || [])
    setLoading(false)
  }

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diffDays = Math.floor((now - d) / 86400000)
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-gray-500 text-sm">{clients.length} clientes en total</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <Link to="/dashboard/clients/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nuevo cliente
            </Link>
          </div>
        </div>
      </header>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-1">No hay clientes</h3>
            <p className="text-gray-500 mb-4">Agregá tu primer cliente para empezar</p>
            <Link to="/dashboard/clients/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nuevo cliente
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <Link
                key={client.id}
                to={`/dashboard/clients/${client.id}`}
                className="card hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: client.color || '#6366f1' }}
                  >
                    {getInitials(client.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{client.name}</h3>
                    <p className="text-sm text-gray-500">Agregado {formatDate(client.created_at)}</p>
                    {client.contact_email ? (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{client.contact_email}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-1">Sin información de contacto</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Add client card */}
            <Link
              to="/dashboard/clients/new"
              className="card border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition flex items-center justify-center min-h-[120px]"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-600 font-medium">Agregar cliente</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
