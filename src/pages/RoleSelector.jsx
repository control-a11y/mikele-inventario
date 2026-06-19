import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function RoleSelector() {
  const { selectRole, isAdmin } = useApp()
  const navigate = useNavigate()

  function handleSelect(role) {
    selectRole(role)
    navigate(`/${role}`)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#08080f', padding: '1.5rem', fontFamily: "'Outfit', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, background: '#6b8aff', top: -80, right: -60 }} />
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, background: '#ff6b8a', bottom: -60, left: -40 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.2, background: '#f0d68a', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 500,
        background: 'rgba(18,18,35,0.95)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20, padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3.5rem' }}>🍨</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ff6b8a', margin: '0.5rem 0 0.25rem' }}>Mikele</h1>
          <p style={{ color: 'rgba(240,240,245,0.55)', fontSize: '0.95rem', margin: 0 }}>Selecciona tu vista</p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button onClick={() => handleSelect('laboratorio')} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
            padding: '1.8rem 1rem', background: 'rgba(107,138,255,0.08)',
            border: '1px solid rgba(107,138,255,0.2)', borderRadius: 16,
            color: '#f0f0f5', cursor: 'pointer', transition: 'all 0.3s',
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(107,138,255,0.18)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(107,138,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <span style={{ fontSize: '2.5rem' }}>🔬</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Laboratorio</span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(240,240,245,0.4)' }}>Transferencias</span>
          </button>

          <button onClick={() => handleSelect('mikele')} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
            padding: '1.8rem 1rem', background: 'rgba(255,107,138,0.08)',
            border: '1px solid rgba(255,107,138,0.2)', borderRadius: 16,
            color: '#f0f0f5', cursor: 'pointer', transition: 'all 0.3s',
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,107,138,0.18)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,107,138,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <span style={{ fontSize: '2.5rem' }}>🍨</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Mikele</span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(240,240,245,0.4)' }}>Recepciones</span>
          </button>
        </div>

        {/* Admin link */}
        {!isAdmin && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => navigate('/admin')} style={{
              background: 'none', border: 'none', color: 'rgba(240,240,245,0.3)',
              fontFamily: "'Outfit', sans-serif", fontSize: '0.82rem', cursor: 'pointer',
              padding: '0.5rem',
            }}>
              🔑 Acceso Admin
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            textAlign: 'center', marginTop: '1.5rem', padding: '0.75rem',
            background: 'rgba(240,214,138,0.08)', borderRadius: 12,
            border: '1px solid rgba(240,214,138,0.15)',
          }}>
            <span style={{ color: '#f0d68a', fontSize: '0.88rem' }}>👑 Sesión Admin activa</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleSelector
