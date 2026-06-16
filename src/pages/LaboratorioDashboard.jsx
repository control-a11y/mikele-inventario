import { useState } from 'react'
import Navbar from '../components/Navbar'
import NuevoRegistro from '../components/NuevoRegistro'
import TablaLaboratorio from '../components/TablaLaboratorio'

function LaboratorioDashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>🔬 Laboratorio</h1>
          <p>Registra y gestiona los pesos de transferencia</p>
        </div>
        <div className="dashboard-grid">
          <NuevoRegistro onRegistroCreado={() => setRefreshKey(k => k + 1)} />
          <TablaLaboratorio refreshKey={refreshKey} />
        </div>
      </main>
    </div>
  )
}

export default LaboratorioDashboard
