import { useState } from 'react'
import Navbar from '../components/Navbar'
import NuevoRegistro from '../components/NuevoRegistro'
import TablaMikele from '../components/TablaMikele'

function MikeleDashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>🍨 Mikele</h1>
          <p>Registra y gestiona los pesos de recepción</p>
        </div>
        <div className="dashboard-grid">
          <NuevoRegistro onRegistroCreado={() => setRefreshKey(k => k + 1)} />
          <TablaMikele refreshKey={refreshKey} />
        </div>
      </main>
    </div>
  )
}

export default MikeleDashboard
