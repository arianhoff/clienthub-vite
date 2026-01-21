import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { ArrowLeft, AlertCircle } from 'lucide-react'

const TYPES = [
  { value: 'design', label: 'Diseño gráfico' },
  { value: 'social', label: 'Redes sociales' },
  { value: 'video', label: 'Video' },
  { value: 'web', label: 'Web / Landing' },
  { value: 'branding', label: 'Branding' },
  { value: 'other', label: 'Otro' },
]

const PRIORITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
]

export default function NewRequest() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [clientId, setClientId] = useState(searchParams.get('client') || '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('design')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    loadClients()
  }, [profile])

  async function loadClients() {
    if (!profile?.organization_id) return
    const { data } = await supabase
      .from('clients')
      .select('id, name')
      .eq('organization_id', profile.organization_id)
      .order('name')
    setClients(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.from('requests').insert({
        organization_id: profile.organization_id,
        client_id: clientId,
        title: title.trim(),
        description: description.trim() || null,
        type,
        priority,
        due_date: dueDate || null,
        status: 'new',
        created_by: profile.id,
      })

      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold">Nueva solicitud</h1>
            <p className="text-gray-500 text-sm">Creá una nueva solicitud para un cliente</p>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="input" required>
              <option value="">Seleccionar cliente</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Ej: Diseño de flyer para promoción" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input min-h-[100px]" placeholder="Detalles adicionales..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input">
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input">
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de entrega</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
          </div>

          <div className="flex gap-3 pt-4">
            <Link to="/dashboard" className="btn-secondary flex-1 text-center">Cancelar</Link>
            <button type="submit" disabled={loading || !clientId || !title.trim()} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? 'Creando...' : 'Crear solicitud'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
