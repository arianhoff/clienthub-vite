import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'
import NewClient from './pages/NewClient'
import Requests from './pages/Requests'
import RequestDetail from './pages/RequestDetail'
import NewRequest from './pages/NewRequest'
import Calendar from './pages/Calendar'
import Reports from './pages/Reports'
import Files from './pages/Files'
import Settings from './pages/Settings'

// Portal Pages
import PortalLogin from './pages/portal/PortalLogin'
import Portal from './pages/portal/Portal'
import PortalRequestDetail from './pages/portal/PortalRequestDetail'
import PortalNewRequest from './pages/portal/PortalNewRequest'

// Layout
import DashboardLayout from './components/DashboardLayout'
import PortalLayout from './components/PortalLayout'

function PrivateRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" />
  }
  
  return children
}

function ClientRoute({ children }) {
  const { user, profile, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }
  
  if (!user || profile?.role !== 'client') {
    return <Navigate to="/portal/login" />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard routes (admin/member) */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/new" element={<NewClient />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="requests" element={<Requests />} />
        <Route path="requests/new" element={<NewRequest />} />
        <Route path="requests/:id" element={<RequestDetail />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="reports" element={<Reports />} />
        <Route path="files" element={<Files />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Portal routes (clients) */}
      <Route path="/portal/login" element={<PortalLogin />} />
      <Route path="/portal" element={
        <ClientRoute>
          <PortalLayout />
        </ClientRoute>
      }>
        <Route index element={<Portal />} />
        <Route path="requests/new" element={<PortalNewRequest />} />
        <Route path="requests/:id" element={<PortalRequestDetail />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
