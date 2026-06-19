import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { usuario, role, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const isLab = role === 'laboratorio'
  const displayRole = isLab ? '🔬 Laboratorio' : '🍨 Recepción'
  const badgeClass = isLab ? 'role-laboratorio' : 'role-mikele'

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🍨</span>
        <span className="navbar-title">Mikele</span>
      </div>
      <div className="navbar-info">
        {usuario && (
          <>
            <span className={`navbar-role ${badgeClass}`}>
              {displayRole}: <strong>{usuario.nombre}</strong>
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
