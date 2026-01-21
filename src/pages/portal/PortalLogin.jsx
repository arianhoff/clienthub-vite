import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { MessageSquare, Mail, AlertCircle } from 'lucide-react'

export default function PortalLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/portal` }
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">ClientHub</h1>
          <p className="text-gray-600">Accedé a tu portal de cliente</p>
        </div>

        {sent ? (
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-semibold text-lg mb-2">¡Revisá tu email!</h2>
            <p className="text-gray-600">Te enviamos un link mágico a <strong>{email}</strong></p>
          </div>
        ) : (
          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="tu@email.com" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar link de acceso'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Te enviaremos un link mágico para acceder sin contraseña.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
