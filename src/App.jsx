import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import RoleSelector from './pages/RoleSelector'
import AdminLogin from './pages/AdminLogin'
import LaboratorioDashboard from './pages/LaboratorioDashboard'
import MikeleDashboard from './pages/MikeleDashboard'

function App() {
  const { role, isAdmin } = useApp()

  return (
    <Routes>
      <Route path="/" element={
        role ? <Navigate to={`/${role}`} replace /> : <RoleSelector />
      } />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/laboratorio" element={
        (role === 'laboratorio' || isAdmin) ? <LaboratorioDashboard /> : <Navigate to="/" replace />
      } />
      <Route path="/mikele" element={
        (role === 'mikele' || isAdmin) ? <MikeleDashboard /> : <Navigate to="/" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
