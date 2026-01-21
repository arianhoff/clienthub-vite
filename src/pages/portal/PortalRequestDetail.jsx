import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Send, CheckCircle, XCircle } from 'lucide-react'

export default function PortalRequestDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [request, setRequest] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequest()
  }, [id])

  async function loadRequest() {
    const { data } = await supabase.from('requests').select('*').eq('id', id).single()
    if (data) {
      setRequest(data)
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*, profiles(full_name, role)')
        .eq('request_id', id)
        .eq('is_internal', false)
        .order('created_at', { ascending: true })
      setComments(commentsData || [])
    }
    setLoading(false)
  }

  async function handleApprove() {
    await supabase.from('requests').update({ status: 'approved' }).eq('id', id)
    setRequest({ ...request, status: 'approved' })
  }

  async function handleRequestChanges() {
    await supabase.from('requests').update({ status: 'changes_requested' }).eq('id', id)
    setRequest({ ...request, status: 'changes_requested' })
  }

  async function handleSendComment(e) {
    e.preventDefault()
    if (!newComment.trim()) return

    const { data } = await supabase.from('comments').insert({
      request_id: id,
      profile_id: profile.id,
      content: newComment.trim(),
      is_internal: false,
    }).select('*, profiles(full_name, role)').single()

    if (data) {
      setComments([...comments, data])
      setNewComment('')
    }
  }

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  const formatDate = (date) => new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })

  const statusConfig = {
    new: { label: 'Nueva', color: 'bg-green-100 text-green-700' },
    in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-700' },
    review: { label: 'En revisión', color: 'bg-yellow-100 text-yellow-700' },
    changes_requested: { label: 'Cambios solicitados', color: 'bg-orange-100 text-orange-700' },
    completed: { label: 'Completada', color: 'bg-gray-100 text-gray-700' },
    approved: { label: 'Aprobada', color: 'bg-green-100 text-green-700' },
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando...</div>
  if (!request) return <div className="text-center py-12 text-gray-500">Solicitud no encontrada</div>

  return (
    <div>
      <Link to="/portal" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5" />Volver
      </Link>

      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{request.title}</h1>
            <p className="text-gray-500">Creada {formatDate(request.created_at)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[request.status]?.color}`}>
            {statusConfig[request.status]?.label}
          </span>
        </div>

        {request.description && <p className="text-gray-600 mb-4">{request.description}</p>}

        {request.due_date && (
          <p className="text-sm text-gray-500">Fecha de entrega: {formatDate(request.due_date)}</p>
        )}
      </div>

      {request.status === 'review' && (
        <div className="card mb-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold mb-3">Esta solicitud está lista para tu revisión</h3>
          <div className="flex gap-3">
            <button onClick={handleApprove} className="btn-primary flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />Aprobar
            </button>
            <button onClick={handleRequestChanges} className="btn-secondary flex items-center gap-2">
              <XCircle className="w-5 h-5" />Pedir cambios
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold mb-4">Comentarios ({comments.length})</h2>

        {comments.length > 0 && (
          <div className="space-y-4 mb-6">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${c.profiles?.role === 'client' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}>
                  {getInitials(c.profiles?.full_name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{c.profiles?.full_name}</span>
                    <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSendComment} className="flex gap-3">
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="input flex-1" placeholder="Escribí un comentario..." />
          <button type="submit" className="btn-primary px-4"><Send className="w-5 h-5" /></button>
        </form>
      </div>
    </div>
  )
}
