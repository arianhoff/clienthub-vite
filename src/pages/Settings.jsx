import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Building, User, CreditCard, Bell, Save, Check } from 'lucide-react'

export default function Settings() {
  const { profile, organization, refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('organization')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [orgName, setOrgName] = useState(organization?.name || '')
  const [fullName, setFullName] = useState(profile?.full_name || '')

  async function saveOrganization() {
    setSaving(true)
    await supabase.from('organizations').update({ name: orgName }).eq('id', organization.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveProfile() {
    setSaving(true)
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id)
    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'organization', label: 'Organización', icon: Building },
    { id: 'profile', label: 'Mi perfil', icon: User },
    { id: 'billing', label: 'Facturación', icon: CreditCard },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
  ]

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-2xl font-bold">Ajustes</h1>
        <p className="text-gray-500 text-sm">Configuración de tu cuenta</p>
      </header>

      <div className="p-8 flex gap-8">
        <nav className="w-64 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-5 h-5" />{tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 max-w-xl">
          {saved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <Check className="w-5 h-5" />Guardado
            </div>
          )}

          {activeTab === 'organization' && (
            <div className="card space-y-6">
              <h2 className="font-semibold text-lg">Organización</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL del portal</label>
                <div className="flex items-center gap-2 text-gray-500">
                  <span>clienthub.app/</span>
                  <input type="text" value={organization?.slug} disabled className="input bg-gray-50 flex-1" />
                </div>
              </div>
              <button onClick={saveOrganization} disabled={saving} className="btn-primary flex items-center gap-2">
                <Save className="w-5 h-5" />{saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card space-y-6">
              <h2 className="font-semibold text-lg">Mi perfil</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={profile?.email || ''} disabled className="input bg-gray-50" />
              </div>
              <button onClick={saveProfile} disabled={saving} className="btn-primary flex items-center gap-2">
                <Save className="w-5 h-5" />{saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="card">
              <h2 className="font-semibold text-lg mb-4">Plan actual</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg">Plan de prueba</h3>
                <p className="text-yellow-700 text-sm">14 días de prueba gratis</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />3 clientes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />Solicitudes ilimitadas</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />Portal del cliente</li>
                </ul>
              </div>
              <button className="btn-primary w-full">Activar plan completo</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card space-y-6">
              <h2 className="font-semibold text-lg">Notificaciones</h2>
              {['Nuevas solicitudes', 'Aprobaciones', 'Comentarios', 'Recordatorio de vencimiento'].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span>{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i !== 2} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
