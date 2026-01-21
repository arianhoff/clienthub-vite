import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  MessageSquare, 
  Bell, 
  CheckCircle, 
  Users, 
  LayoutDashboard, 
  Palette,
  ArrowRight,
  Check,
  Star
} from 'lucide-react'

export default function Landing() {
  const { user, profile } = useAuth()

  // If logged in, show link to dashboard or portal
  const getAppLink = () => {
    if (!user) return '/login'
    if (profile?.role === 'client') return '/portal'
    return '/dashboard'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">ClientHub</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Funcionalidades</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Precios</a>
              <a href="#how" className="text-gray-600 hover:text-gray-900 transition">Cómo funciona</a>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <Link to={getAppLink()} className="btn-primary">
                  Ir al dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Empezar gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              14 días de prueba gratis
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Gestioná tus clientes{' '}
              <span className="bg-gradient-to-r from-primary-500 to-emerald-400 bg-clip-text text-transparent">
                sin volverte loco
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              La plataforma todo-en-uno para agencias de marketing. 
              Centralizá solicitudes, aprobaciones y comunicación con tus clientes en un solo lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 text-lg">
                Crear cuenta gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto border-2 border-gray-200 hover:border-gray-300 font-semibold px-8 py-4 rounded-xl transition text-lg">
                Ver demo
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Sin tarjeta de crédito • Configuración en 2 minutos
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gray-900 rounded-2xl p-2 shadow-2xl">
              <div className="bg-gray-100 rounded-xl overflow-hidden">
                <div className="bg-white p-6">
                  <div className="flex gap-6">
                    <div className="w-48 space-y-2">
                      <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-2 rounded-lg">
                        <div className="w-5 h-5 bg-primary-500 rounded" />
                        <span className="font-medium text-sm">Solicitudes</span>
                        <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">12</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 px-3 py-2">
                        <div className="w-5 h-5 bg-gray-300 rounded" />
                        <span className="text-sm">Clientes</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 px-3 py-2">
                        <div className="w-5 h-5 bg-gray-300 rounded" />
                        <span className="text-sm">Calendario</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="text-2xl font-bold">24</div>
                          <div className="text-sm text-gray-500">Total</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-blue-600">8</div>
                          <div className="text-sm text-gray-500">En progreso</div>
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-yellow-600">3</div>
                          <div className="text-sm text-gray-500">Pendientes</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-green-600">13</div>
                          <div className="text-sm text-gray-500">Completadas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitás para gestionar clientes
            </h2>
            <p className="text-xl text-gray-600">
              Herramientas diseñadas para agencias de marketing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: 'Portal del cliente', description: 'Tus clientes pueden crear solicitudes y ver el estado de sus proyectos.', color: 'bg-primary-100 text-primary-600' },
              { icon: Bell, title: 'Notificaciones', description: 'Alertas automáticas cuando hay cambios importantes.', color: 'bg-blue-100 text-blue-600' },
              { icon: CheckCircle, title: 'Flujo de aprobación', description: 'Los clientes aprueban o piden cambios desde su portal.', color: 'bg-green-100 text-green-600' },
              { icon: Users, title: 'Gestión de equipo', description: 'Asigná responsables y colaborá con tu equipo.', color: 'bg-purple-100 text-purple-600' },
              { icon: LayoutDashboard, title: 'Dashboard unificado', description: 'Visualizá el estado de todos tus proyectos.', color: 'bg-orange-100 text-orange-600' },
              { icon: Palette, title: 'Tu marca, tu portal', description: 'Personalizá el portal con tu logo y colores.', color: 'bg-pink-100 text-pink-600' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-lg transition">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cómo funciona</h2>
            <p className="text-xl text-gray-600">Empezá en 3 simples pasos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Creá tu cuenta', description: 'Registrate gratis y configurá tu organización.' },
              { step: '2', title: 'Invitá a tus clientes', description: 'Enviá invitaciones por email con link mágico.' },
              { step: '3', title: 'Gestioná todo', description: 'Recibí solicitudes y entregá proyectos.' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Precios simples</h2>
            <p className="text-xl text-gray-600">Empezá gratis, escalá cuando lo necesites</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
              <h3 className="font-bold text-xl mb-2">Freelance</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Gratis</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['3 clientes', '1 usuario', '2 GB'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center btn-secondary w-full">Empezar gratis</Link>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                Popular
              </div>
              <h3 className="font-bold text-xl mb-2">Negocio</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-500">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['20 clientes', '5 usuarios', '25 GB'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center btn-primary w-full">Empezar prueba</Link>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
              <h3 className="font-bold text-xl mb-2">Agencia</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-gray-500">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Ilimitados', 'Ilimitados', '100 GB'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full">Contactar</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">ClientHub</span>
          </div>
          <p className="text-gray-400">© 2026 ClientHub</p>
        </div>
      </footer>
    </div>
  )
}
