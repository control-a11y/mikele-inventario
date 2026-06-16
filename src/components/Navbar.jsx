import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { user, permissions, activeView, setActiveView, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  function handleViewSwitch(view) {
    setActiveView(view)
    navigate(`/${view}`)
  }

  const isAdmin = permissions?.views.length > 1

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🍨</span>
        <span className="navbar-title">Mikele</span>
      </div>
      <div className="navbar-info">
        {isAdmin ? (
          <>
            <span className="navbar-role role-admin">👑 Admin</span>
            <div className="nav-tabs">
              <button
                className={`nav-tab ${activeView === 'laboratorio' ? 'active' : ''}`}
                onClick={() => handleViewSwitch('laboratorio')}
              >
                🔬 Lab
              </button>
              <button
                className={`nav-tab ${activeView === 'mikele' ? 'active' : ''}`}
                onClick={() => handleViewSwitch('mikele')}
              >
                🍨 Mikele
              </button>
            </div>
          </>
        ) : (
          <span className={`navbar-role ${activeView === 'laboratorio' ? 'role-laboratorio' : 'role-mikele'}`}>
            {activeView === 'laboratorio' ? '🔬 Laboratorio' : '🍨 Mikele'}
          </span>
        )}
        <span className="navbar-email">{user?.email}</span>
        <button id="btn-logout" className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar
