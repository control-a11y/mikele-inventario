import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function RoleSelector() {
  const { usuario, role, login, register, changePassword, logout } = useApp()
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedRol, setSelectedRol] = useState('transferencia')

  // Password change state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if logged in and doesn't need password change
  useEffect(() => {
    if (usuario && !usuario.debe_cambiar_password && role) {
      navigate(`/${role}`)
    }
  }, [usuario, role, navigate])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const { data, error: loginErr } = await login(username, password)
      if (loginErr) throw loginErr
      
      if (data.debe_cambiar_password) {
        setSuccess('Inicio de sesión correcto. Por seguridad, debes cambiar tu contraseña.')
        setOldPassword(password) // Prefill old password for convenience
      } else {
        const destRole = data.rol === 'transferencia' ? 'laboratorio' : 'mikele'
        navigate(`/${destRole}`)
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const { error: regErr } = await register(username, password, selectedRol)
      if (regErr) throw regErr

      setSuccess(`¡Usuario "${username}" creado correctamente! Ahora puedes iniciar sesión.`)
      setIsRegister(false)
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.')
    } finally {
      setLoading(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 4) {
      setError('La nueva contraseña debe tener al menos 4 caracteres.')
      return
    }

    if (newPassword === '1234') {
      setError('Por favor elige una contraseña diferente de "1234".')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('La confirmación de la nueva contraseña no coincide.')
      return
    }

    setLoading(true)
    try {
      const { error: pwdErr } = await changePassword(usuario.nombre, oldPassword, newPassword)
      if (pwdErr) throw pwdErr

      setSuccess('Contraseña cambiada con éxito. Redirigiendo...')
      setTimeout(() => {
        const destRole = usuario.rol === 'transferencia' ? 'laboratorio' : 'mikele'
        navigate(`/${destRole}`)
      }, 1500)
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  // Styles (copied/adapted for consistency)
  const pageStyle = {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#08080f', padding: '1.5rem', fontFamily: "'Outfit', sans-serif",
    position: 'relative', overflow: 'hidden',
  }
  const cardStyle = {
    width: '100%', maxWidth: 440, background: '#14142a',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20,
    padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    position: 'relative', zIndex: 1,
  }
  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
    color: '#f0f0f5', fontFamily: "'Outfit', sans-serif", fontSize: '1rem',
    outline: 'none', boxSizing: 'border-box', minHeight: 48,
  }
  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.85rem', fontWeight: 500,
    color: 'rgba(240,240,245,0.55)', marginBottom: '0.5rem',
    textTransform: 'uppercase', letterSpacing: '0.02em',
  }
  const btnStyle = {
    width: '100%', padding: '0.9rem 1.5rem',
    background: 'linear-gradient(135deg, #6b8aff, #ff6b8a)',
    border: 'none', borderRadius: 12, color: '#fff',
    fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 600,
    cursor: 'pointer', minHeight: 48, opacity: loading ? 0.6 : 1,
    transition: 'all 0.2s',
  }

  // Si está logueado pero DEBE cambiar contraseña, forzar este formulario
  if (usuario && usuario.debe_cambiar_password) {
    return (
      <div style={pageStyle}>
        <div className="login-bg-orbs" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, background: '#6b8aff', top: -80, right: -60 }} />
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, background: '#ff6b8a', bottom: -60, left: -40 }} />
        </div>

        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem' }}>🔒</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ff6b8a', margin: '0.5rem 0 0.25rem' }}>Cambiar Contraseña</h1>
            <p style={{ color: 'rgba(240,240,245,0.55)', fontSize: '0.9rem', margin: 0 }}>Debes cambiar tu contraseña temporal por seguridad.</p>
          </div>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Usuario</label>
              <input type="text" value={usuario.nombre} disabled style={{ ...inputStyle, opacity: 0.6 }} />
            </div>
            <div>
              <label style={labelStyle}>Contraseña Temporal</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                placeholder="Ingresa la contraseña actual (ej: 1234)" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Nueva Contraseña</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Confirmar Nueva Contraseña</label>
              <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="Confirmar nueva contraseña" required style={inputStyle} />
            </div>

            {error && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem',
              background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff7070' }}>{error}</div>}
            {success && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem',
              background: 'rgba(107,207,127,0.12)', border: '1px solid rgba(107,207,127,0.25)', color: '#6bcf7f' }}>{success}</div>}

            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Guardando...' : 'Actualizar Contraseña'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'rgba(240,240,245,0.4)',
              fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', cursor: 'pointer', padding: '0.5rem' }}>
              ❌ Cancelar y Salir
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      {/* Background orbs */}
      <div className="login-bg-orbs" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, background: '#6b8aff', top: -80, right: -60 }} />
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, background: '#ff6b8a', bottom: -60, left: -40 }} />
      </div>

      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🍨</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ff6b8a', margin: '0 0 0.25rem' }}>Mikele</h1>
          <p style={{ color: 'rgba(240,240,245,0.55)', fontSize: '0.95rem', margin: 0 }}>
            {isRegister ? 'Crear nueva cuenta de usuario' : 'Inicia sesión para gestionar inventario'}
          </p>
        </div>

        {isRegister ? (
          // FORMULARIO DE REGISTRO
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Nombre de Usuario</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Nombre (ej: Romel)" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Crea una contraseña" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Confirmar Contraseña</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rol de la Vista</label>
              <select value={selectedRol} onChange={e => setSelectedRol(e.target.value)} style={selectStyle}>
                <option value="transferencia">🔬 Laboratorio (Transferencias)</option>
                <option value="recepcion">🍨 Mikele (Recepciones)</option>
              </select>
            </div>

            {error && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem',
              background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff7070' }}>{error}</div>}
            {success && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem',
              background: 'rgba(107,207,127,0.12)', border: '1px solid rgba(107,207,127,0.25)', color: '#6bcf7f' }}>{success}</div>}

            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Creando usuario...' : 'Crear Usuario'}
            </button>
          </form>
        ) : (
          // FORMULARIO DE LOGIN
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Nombre de Usuario</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Tu usuario (ej: Laboratorio)" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña" required style={inputStyle} />
            </div>

            {error && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem',
              background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff7070' }}>{error}</div>}
            {success && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem',
              background: 'rgba(107,207,127,0.12)', border: '1px solid rgba(107,207,127,0.25)', color: '#6bcf7f' }}>{success}</div>}

            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess('') }}
            style={{ background: 'none', border: 'none', color: 'rgba(240,240,245,0.4)',
              fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', cursor: 'pointer', padding: '0.5rem' }}>
            {isRegister ? '¿Ya tienes cuenta? Iniciar Sesión' : '¿No tienes cuenta? Crear una'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelector
