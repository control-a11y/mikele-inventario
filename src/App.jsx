import { Component } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import LaboratorioDashboard from './pages/LaboratorioDashboard'
import MikeleDashboard from './pages/MikeleDashboard'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#08080f', color: '#f0f0f5', fontFamily: 'Outfit, sans-serif',
          padding: '2rem', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Error</h1>
          <p style={{ color: 'rgba(240,240,245,0.55)' }}>Algo salió mal.</p>
          <pre style={{
            background: 'rgba(255,255,255,0.05)', padding: '1rem',
            borderRadius: '8px', fontSize: '0.85rem', color: '#ff6b8a',
            maxWidth: '500px', overflow: 'auto', marginTop: '1rem'
          }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{
            marginTop: '1.5rem', padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #6b8aff, #ff6b8a)',
            border: 'none', borderRadius: '8px', color: '#fff',
            fontSize: '1rem', cursor: 'pointer'
          }}>
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppRoutes() {
  const { user, permissions, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#08080f', color: 'rgba(240,240,245,0.55)',
        fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem'
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#ff6b8a', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ marginTop: '1rem' }}>Cargando...</p>
      </div>
    )
  }

  const isAuthed = user && permissions

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthed ? <Login /> : <Navigate to={`/${permissions.views[0]}`} replace />
      } />
      <Route path="/laboratorio" element={
        isAuthed && permissions.views.includes('laboratorio')
          ? <LaboratorioDashboard />
          : <Navigate to="/login" replace />
      } />
      <Route path="/mikele" element={
        isAuthed && permissions.views.includes('mikele')
          ? <MikeleDashboard />
          : <Navigate to="/login" replace />
      } />
      <Route path="/" element={
        isAuthed
          ? <Navigate to={`/${permissions.views[0]}`} replace />
          : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  )
}

export default App
