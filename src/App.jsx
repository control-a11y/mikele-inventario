import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import RoleSelector from './pages/RoleSelector'
import LaboratorioDashboard from './pages/LaboratorioDashboard'
import MikeleDashboard from './pages/MikeleDashboard'

function App() {
  const { usuario, role } = useApp()

  // Si requiere cambiar contraseña, forzar a estar en la raíz donde se muestra el formulario de cambio
  const mustChangePwd = usuario && usuario.debe_cambiar_password

  return (
    <Routes>
      <Route path="/" element={
        !usuario 
          ? <RoleSelector /> 
          : mustChangePwd 
            ? <RoleSelector /> 
            : <Navigate to={`/${role}`} replace />
      } />
      
      <Route path="/laboratorio" element={
        (usuario && !mustChangePwd && role === 'laboratorio') 
          ? <LaboratorioDashboard /> 
          : <Navigate to="/" replace />
      } />
      
      <Route path="/mikele" element={
        (usuario && !mustChangePwd && role === 'mikele') 
          ? <MikeleDashboard /> 
          : <Navigate to="/" replace />
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
