import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react'

export default function Calendar() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    if (profile?.organization_id) loadRequests()
  }, [profile])

  async function loadRequests() {
    const { data } = await supabase
      .from('requests')
      .select('*, clients(name, color)')
      .eq('organization_id', profile.organization_id)
      .not('due_date', 'is', null)
    setRequests(data || [])
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1))

  const getRequestsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return requests.filter(r => r.due_date?.startsWith(dateStr))
  }

  const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const isPast = (day) => new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const overdueRequests = requests.filter(r => new Date(r.due_date) < today && !['completed', 'approved'].includes(r.status))
  const upcomingRequests = requests.filter(r => {
    const due = new Date(r.due_date)
    const diff = (due - today) / 86400000
    return diff >= 0 && diff <= 7 && !['completed', 'approved'].includes(r.status)
  })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-2xl font-bold">Calendario</h1>
        <p className="text-gray-500 text-sm">Visualizá las fechas de entrega</p>
      </header>

      <div className="p-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold">{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(d => <div key={d} className="text-center text-sm font-medium text-gray-500 py-2">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (!day) return <div key={i} className="h-24" />
              const dayRequests = getRequestsForDay(day)
              return (
                <div key={i} className={`h-24 p-1 border rounded-lg ${isToday(day) ? 'border-primary-500 bg-primary-50' : 'border-gray-100'} ${isPast(day) && !isToday(day) ? 'bg-gray-50' : ''}`}>
                  <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary-600' : isPast(day) ? 'text-gray-400' : ''}`}>{day}</div>
                  <div className="space-y-0.5 overflow-hidden">
                    {dayRequests.slice(0, 2).map(r => (
                      <Link key={r.id} to={`/dashboard/requests/${r.id}`} className={`block text-xs px-1.5 py-0.5 rounded truncate ${r.status === 'completed' ? 'bg-green-100 text-green-700' : isPast(day) ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {r.title}
                      </Link>
                    ))}
                    {dayRequests.length > 2 && <div className="text-xs text-gray-500 px-1">+{dayRequests.length - 2}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          {overdueRequests.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5" />Vencidas ({overdueRequests.length})</h3>
              <div className="space-y-2">
                {overdueRequests.slice(0, 5).map(r => (
                  <Link key={r.id} to={`/dashboard/requests/${r.id}`} className="block bg-white rounded-lg p-3">
                    <div className="font-medium text-sm">{r.title}</div>
                    <div className="text-xs text-red-600">Venció {new Date(r.due_date).toLocaleDateString('es-AR')}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="w-5 h-5" />Próximas entregas</h3>
            {upcomingRequests.length === 0 ? <p className="text-gray-500 text-sm">No hay entregas próximas</p> : (
              <div className="space-y-2">
                {upcomingRequests.map(r => (
                  <Link key={r.id} to={`/dashboard/requests/${r.id}`} className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100">
                    <div className="font-medium text-sm">{r.title}</div>
                    <div className="text-xs text-gray-500">{r.clients?.name}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
