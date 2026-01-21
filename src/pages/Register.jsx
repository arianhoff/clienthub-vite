import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MessageSquare, Mail, Lock, User, Building, AlertCircle, Check } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Step 1: Account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  // Step 2: Organization
  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')

  function generateSlug(name) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function handleOrgNameChange(value) {
    setOrgName(value)
    setOrgSlug(generateSlug(value))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        return
      }
      setStep(2)
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, fullName, orgName, orgSlug)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">ClientHub</span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`flex-1 h-1 rounded ${step > 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {step === 1 ? 'Creá tu cuenta' : 'Tu organización'}
          </h1>
          <p className="text-gray-600 mb-8">
            {step === 1 
              ? 'Empezá tu prueba gratuita de 14 días' 
              : 'Configurá el nombre de tu agencia'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input pl-12"
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-12"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-12"
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de tu agencia
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => handleOrgNameChange(e.target.value)}
                      className="input pl-12"
                      placeholder="Mi Agencia"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del portal
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm mr-2">clienthub.app/</span>
                    <input
                      type="text"
                      value={orgSlug}
                      onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="input flex-1"
                      placeholder="mi-agencia"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Esta será la URL que usarán tus clientes
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  Atrás
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Creando...' : step === 1 ? 'Continuar' : 'Crear cuenta'}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-600 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary-500 to-emerald-500 p-12">
        <div className="h-full flex flex-col justify-center text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">14 días de prueba gratis</span>
            </div>
            <p className="text-primary-100 text-sm">Sin tarjeta de crédito requerida</p>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Unite a cientos de agencias
          </h2>
          <p className="text-xl text-primary-100">
            Que ya usan ClientHub para gestionar sus clientes de forma eficiente.
          </p>
        </div>
      </div>
    </div>
  )
}
