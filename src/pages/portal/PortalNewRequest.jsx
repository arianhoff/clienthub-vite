import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, AlertCircle } from 'lucide-react'

const TYPES = [
  { value: 'design', label: 'Diseño gráfico' },
  { value: 'social', label: 'Redes sociales' },
  { value: 'video', label: 'Video' },
  { value: 'web', label: 'Web / Landing' },
  { value: 'other', label: 'Otro' },
]

export default function PortalNewRequest() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('design')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.from('requests').insert({
        organization_id: profile.organization_id,
        client_id: profile.client_id,
        title: title.trim(),
        description: description.trim() || null,
        type,
        priority: 'medium',
        status: 'new',
        created_by: profile.id,
      })

      if (error) throw error
      navigate('/portal')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link to="/portal" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5" />Volver
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nueva solicitud</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué necesitás? *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Ej: Diseño de flyer para evento" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de trabajo</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input">
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detalles adicionales</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input min-h-[120px]" placeholder="Describí lo que necesitás con el mayor detalle posible..." />
        </div>

        <div className="flex gap-3">
          <Link to="/portal" className="btn-secondary flex-1 text-center">Cancelar</Link>
          <button type="submit" disabled={loading || !title.trim()} className="btn-primary flex-1 disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </form>
    </div>
  )
}
