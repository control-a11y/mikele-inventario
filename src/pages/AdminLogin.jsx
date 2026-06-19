import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function AdminLogin() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { adminSignIn, adminSignUp, isAdmin, adminUser, adminSignOut, selectRole } = useApp()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (isRegister) {
        const { error } = await adminSignUp(email, password)
        if (error) throw error
        setSuccess('¡Cuenta admin creada! Ahora inicia sesión.')
        setIsRegister(false)
        setPassword('')
      } else {
        const { error } = await adminSignIn(email, password)
        if (error) throw error
        selectRole('laboratorio')
        navigate('/laboratorio')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await adminSignOut()
    navigate('/')
  }

  const pageStyle = {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#08080f', padding: '1.5rem', fontFamily: "'Outfit', sans-serif",
  }
  const cardStyle = {
    width: '100%', maxWidth: 440, background: '#14142a',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20,
    padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  }
  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
    color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontSize: '1rem',
    outline: 'none', boxSizing: 'border-box', minHeight: 48,
  }
  const labelStyle = {
    display: 'block', fontSize: '0.85rem', fontWeight: 500,
    color: 'rgba(240,240,245,0.55)', marginBottom: '0.5rem',
    textTransform: 'uppercase', letterSpacing: '0.02em',
  }
  const btnStyle = {
    width: '100%', padding: '0.9rem 1.5rem',
    background: 'linear-gradient(135deg, #f0d68a, #e6a919)',
    border: 'none', borderRadius: 12, color: '#111',
    fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 600,
    cursor: 'pointer', minHeight: 48, opacity: loading ? 0.6 : 1,
  }

  if (isAdmin) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👑</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f0d68a', margin: '0 0 0.5rem' }}>Admin Activo</h1>
            <p style={{ color: 'rgba(240,240,245,0.55)', margin: '0 0 2rem' }}>{adminUser?.email}</p>
            <button onClick={() => { selectRole('laboratorio'); navigate('/laboratorio') }} style={{ ...btnStyle, marginBottom: '0.75rem' }}>
              Ir al Dashboard
            </button>
            <button onClick={handleLogout} style={{ ...btnStyle, background: 'rgba(255,107,138,0.15)', color: '#ff6b8a' }}>
              Cerrar Sesión Admin
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>🔑</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f0d68a', margin: '0.5rem 0 0.25rem' }}>Admin</h1>
          <p style={{ color: 'rgba(240,240,245,0.55)', fontSize: '0.9rem', margin: 0 }}>Acceso restringido</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Correo</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@correo.com" required autoComplete="email" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required minLength={6}
              autoComplete={isRegister ? 'new-password' : 'current-password'} style={inputStyle} />
          </div>

          {error && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem',
            background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff7070' }}>{error}</div>}
          {success && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem',
            background: 'rgba(107,207,127,0.12)', border: '1px solid rgba(107,207,127,0.25)', color: '#6bcf7f' }}>{success}</div>}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Procesando...' : (isRegister ? 'Crear Cuenta Admin' : 'Iniciar Sesión')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess('') }}
            style={{ background: 'none', border: 'none', color: 'rgba(240,240,245,0.4)',
              fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', cursor: 'pointer', padding: '0.5rem' }}>
            {isRegister ? '¿Ya tienes cuenta? Iniciar sesión' : '¿Primera vez? Crear cuenta'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'rgba(240,240,245,0.3)',
              fontFamily: "'Outfit', sans-serif", fontSize: '0.82rem', cursor: 'pointer', padding: '0.5rem' }}>
            ← Volver
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
