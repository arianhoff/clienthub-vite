import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { BarChart3, Users, FileText, CheckCircle, Clock } from 'lucide-react'

export default function Reports() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [clients, setClients] = useState([])

  useEffect(() => {
    if (profile?.organization_id) loadData()
  }, [profile])

  async function loadData() {
    const { data: reqData } = await supabase.from('requests').select('*, clients(name)').eq('organization_id', profile.organization_id)
    const { data: clientData } = await supabase.from('clients').select('*').eq('organization_id', profile.organization_id)
    setRequests(reqData || [])
    setClients(clientData || [])
  }

  const total = requests.length
  const completed = requests.filter(r => ['completed', 'approved'].includes(r.status)).length
  const inProgress = requests.filter(r => r.status === 'in_progress').length
  const pending = requests.filter(r => r.status === 'new').length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const requestsByType = requests.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {})

  const typeLabels = { design: 'Diseño', social: 'Redes sociales', video: 'Video', web: 'Web', branding: 'Branding', other: 'Otro' }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <p className="text-gray-500 text-sm">Métricas y estadísticas</p>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div><div className="text-2xl font-bold">{total}</div><div className="text-sm text-gray-500">Solicitudes</div></div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><div className="text-2xl font-bold text-green-600">{completed}</div><div className="text-sm text-gray-500">Completadas</div></div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div>
            <div><div className="text-2xl font-bold text-yellow-600">{inProgress + pending}</div><div className="text-sm text-gray-500">En proceso</div></div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-purple-600" /></div>
            <div><div className="text-2xl font-bold">{clients.length}</div><div className="text-sm text-gray-500">Clientes</div></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" />Por tipo</h2>
            {Object.keys(requestsByType).length === 0 ? <p className="text-gray-500">Sin datos</p> : (
              <div className="space-y-3">
                {Object.entries(requestsByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{typeLabels[type] || type}</span>
                      <span className="text-gray-500">{count} ({Math.round((count / total) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Resumen</h2>
            <div className="space-y-4">
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-primary-600">{completionRate}%</div>
                <div className="text-sm text-gray-600">Tasa de completado</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold">{pending}</div>
                  <div className="text-xs text-gray-500">Nuevas</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold">{inProgress}</div>
                  <div className="text-xs text-gray-500">En progreso</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
