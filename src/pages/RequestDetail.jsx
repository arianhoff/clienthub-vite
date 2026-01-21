import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Send, Clock, CheckCircle, AlertCircle, Play, Eye } from 'lucide-react'

const STATUSES = [
  { value: 'new', label: 'Nueva', color: 'bg-green-500', icon: AlertCircle },
  { value: 'in_progress', label: 'En progreso', color: 'bg-blue-500', icon: Play },
  { value: 'review', label: 'En revisión', color: 'bg-yellow-500', icon: Eye },
  { value: 'completed', label: 'Completada', color: 'bg-gray-500', icon: CheckCircle },
]

export default function RequestDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [request, setRequest] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadRequest()
  }, [id])

  async function loadRequest() {
    const { data } = await supabase
      .from('requests')
      .select('*, clients(name, color)')
      .eq('id', id)
      .single()

    if (data) {
      setRequest(data)
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*, profiles(full_name, role)')
        .eq('request_id', id)
        .order('created_at', { ascending: true })
      setComments(commentsData || [])
    }
    setLoading(false)
  }

  async function handleStatusChange(newStatus) {
    await supabase.from('requests').update({ status: newStatus }).eq('id', id)
    setRequest({ ...request, status: newStatus })
  }

  async function handleSendComment(e) {
    e.preventDefault()
    if (!newComment.trim()) return
    setSending(true)

    const { data } = await supabase.from('comments').insert({
      request_id: id,
      profile_id: profile.id,
      content: newComment.trim(),
    }).select('*, profiles(full_name, role)').single()

    if (data) {
      setComments([...comments, data])
      setNewComment('')
    }
    setSending(false)
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatTime = (date) => new Date(date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Cargando...</div>
  if (!request) return <div className="flex items-center justify-center h-64 text-gray-500">Solicitud no encontrada</div>

  const currentStatusIndex = STATUSES.findIndex(s => s.value === request.status)

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{request.title}</h1>
            <p className="text-gray-500 text-sm">{request.clients?.name} • Creada {formatDate(request.created_at)}</p>
          </div>
        </div>
      </header>

      <div className="p-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <h2 className="font-semibold mb-3">Descripción</h2>
            <p className="text-gray-600">{request.description || 'Sin descripción'}</p>
          </div>

          {/* Status workflow */}
          <div className="card">
            <h2 className="font-semibold mb-4">Estado</h2>
            <div className="flex items-center gap-2">
              {STATUSES.map((status, i) => {
                const isActive = i <= currentStatusIndex
                const isCurrent = status.value === request.status
                return (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
                      isCurrent ? `${status.color} text-white` : isActive ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <status.icon className="w-4 h-4" />
                    {status.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Comments */}
          <div className="card">
            <h2 className="font-semibold mb-4">Comentarios ({comments.length})</h2>
            
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay comentarios todavía</p>
            ) : (
              <div className="space-y-4 mb-6">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-medium">
                      {getInitials(comment.profiles?.full_name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.profiles?.full_name}</span>
                        <span className="text-xs text-gray-400">{formatTime(comment.created_at)}</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSendComment} className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="input flex-1"
                placeholder="Escribí un comentario..."
              />
              <button type="submit" disabled={sending || !newComment.trim()} className="btn-primary px-4 disabled:opacity-50">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="font-semibold mb-4">Cliente</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium" style={{ backgroundColor: request.clients?.color }}>
                {getInitials(request.clients?.name)}
              </div>
              <span className="font-medium">{request.clients?.name}</span>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Detalles</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo</span>
                <span className="capitalize">{request.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Prioridad</span>
                <span className="capitalize">{request.priority}</span>
              </div>
              {request.due_date && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha límite</span>
                  <span className={new Date(request.due_date) < new Date() ? 'text-red-600 font-medium' : ''}>
                    {formatDate(request.due_date)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
