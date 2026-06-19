import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { role, clearRole, isAdmin, adminUser, adminSignOut, selectRole } = useApp()
  const navigate = useNavigate()

  function handleChangeView() {
    clearRole()
    navigate('/')
  }

  function handleViewSwitch(view) {
    selectRole(view)
    navigate(`/${view}`)
  }

  async function handleAdminLogout() {
    await adminSignOut()
  }

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
                className={`nav-tab ${role === 'laboratorio' ? 'active' : ''}`}
                onClick={() => handleViewSwitch('laboratorio')}
              >
                🔬 Lab
              </button>
              <button
                className={`nav-tab ${role === 'mikele' ? 'active' : ''}`}
                onClick={() => handleViewSwitch('mikele')}
              >
                🍨 Mikele
              </button>
            </div>
            <button className="btn-logout" onClick={handleAdminLogout}>Salir Admin</button>
          </>
        ) : (
          <>
            <span className={`navbar-role ${role === 'laboratorio' ? 'role-laboratorio' : 'role-mikele'}`}>
              {role === 'laboratorio' ? '🔬 Laboratorio' : '🍨 Mikele'}
            </span>
            <button className="btn-switch" onClick={handleChangeView}>↩ Cambiar Vista</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
