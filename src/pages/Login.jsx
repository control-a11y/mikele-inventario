import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isRegister) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('¡Cuenta creada! Ahora inicia sesión.')
        setIsRegister(false)
        setPassword('')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#08080f',
    padding: '1.5rem',
    fontFamily: "'Outfit', sans-serif",
  }

  const cardStyle = {
    width: '100%',
    maxWidth: '440px',
    background: '#14142a',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: '#f0f0f5',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: '48px',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'rgba(240,240,245,0.55)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  }

  const btnStyle = {
    width: '100%',
    padding: '0.9rem 1.5rem',
    background: 'linear-gradient(135deg, #6b8aff, #ff6b8a)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '48px',
    opacity: loading ? 0.6 : 1,
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ fontSize: '3.5rem' }}>🍨</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ff6b8a', margin: '0.5rem 0 0.25rem' }}>
            Mikele
          </h1>
          <p style={{ color: 'rgba(240,240,245,0.55)', fontSize: '0.95rem', margin: 0 }}>
            Control de Inventario
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle} htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem',
              background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff7070',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem',
              background: 'rgba(107,207,127,0.12)', border: '1px solid rgba(107,207,127,0.25)', color: '#6bcf7f',
            }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Procesando...' : (isRegister ? 'Crear Cuenta' : 'Iniciar Sesión')}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess('') }}
            style={{
              background: 'none', border: 'none', color: 'rgba(240,240,245,0.55)',
              fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿Primera vez? Crear cuenta'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
