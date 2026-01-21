import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Building, User, Mail, Phone, AlertCircle } from 'lucide-react'

const COLORS = [
  '#22c55e', '#3b82f6', '#6366f1', '#f472b6', '#f97316',
  '#ef4444', '#14b8a6', '#8b5cf6', '#84cc16', '#06b6d4'
]

export default function NewClient() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.from('clients').insert({
        organization_id: profile.organization_id,
        name: name.trim(),
        color,
        contact_name: contactName.trim() || null,
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
      })

      if (error) throw error

      navigate('/dashboard/clients')
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
          <Link to="/dashboard/clients" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Nuevo cliente</h1>
            <p className="text-gray-500 text-sm">Agregá un nuevo cliente a tu organización</p>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Nombre del cliente / empresa *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Ej: Café Roma, TechStore, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color identificador
            </label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nombre del contacto
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="input"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email del contacto
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="input"
              placeholder="contacto@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="input"
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link to="/dashboard/clients" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
