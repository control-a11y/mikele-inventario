import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function TablaMikele({ refreshKey }) {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    fetchRegistros()
  }, [refreshKey])

  async function fetchRegistros() {
    setLoading(true)
    const { data, error } = await supabase
      .from('Transferencias')
      .select('id, created_at, producto, transferencia, recepcion, estado, creado_por_rol, creado_por')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const sorted = [...data].sort((a, b) => {
        const aNeed = a.recepcion == null ? 0 : 1
        const bNeed = b.recepcion == null ? 0 : 1
        if (aNeed !== bNeed) return aNeed - bNeed
        return new Date(b.created_at) - new Date(a.created_at)
      })
      setRegistros(sorted)
    }
    setLoading(false)
  }

  async function handleSave(id, record) {
    if (!editValue) return
    setSavingId(id)
    const updates = { recepcion: parseFloat(editValue) }
    if (record.transferencia != null) {
      updates.estado = 'completado'
    }

    const { error } = await supabase
      .from('Transferencias')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setEditingId(null)
      setEditValue('')
      fetchRegistros()
    }
    setSavingId(null)
  }

  function handleKeyDown(e, id, record) {
    if (e.key === 'Enter') handleSave(id, record)
    if (e.key === 'Escape') { setEditingId(null); setEditValue('') }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  const pendientes = registros.filter(r => r.recepcion == null)

  if (loading) {
    return (
      <div className="card tabla-container">
        <h2>🍨 Recepciones</h2>
        <div className="loading-center"><div className="loading-spinner" /></div>
      </div>
    )
  }

  return (
    <div className="card tabla-container">
      <div className="tabla-header">
        <h2>🍨 Recepciones</h2>
        <button className="btn-refresh" onClick={fetchRegistros} title="Actualizar">🔄</button>
      </div>

      {pendientes.length > 0 && (
        <div className="section-badge section-pending">
          ⚡ {pendientes.length} pendiente{pendientes.length > 1 ? 's' : ''} de tu peso
        </div>
      )}

      {registros.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <p>No hay registros aún.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-wrapper desktop-only">
            <table id="tabla-mikele">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Peso Recepción</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((r) => {
                  const needsMine = r.recepcion == null
                  const isEditing = editingId === r.id
                  const isMine = r.creado_por_rol === 'mikele'

                  return (
                    <tr key={r.id} className={`${r.estado === 'completado' ? 'row-completed' : ''} ${needsMine ? 'row-needs-input' : ''}`}>
                      <td className="td-producto">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{r.producto}</span>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>
                            Creado por: {r.creado_por || (r.creado_por_rol === 'laboratorio' ? 'Laboratorio' : 'Mikele')}
                          </span>
                        </div>
                        {!isMine && needsMine && <span className="tag-from" style={{ marginTop: '0.25rem' }}>de Laboratorio</span>}
                      </td>
                      <td className="td-peso">
                        {isEditing ? (
                          <div className="inline-edit-wrapper">
                            <input type="number" className="inline-edit" value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, r.id, r)} autoFocus placeholder="Peso en g" />
                            <div className="inline-edit-actions">
                              <button className="btn-icon btn-save" onClick={() => handleSave(r.id, r)} disabled={savingId === r.id}>
                                {savingId === r.id ? '⏳' : '💾'}
                              </button>
                              <button className="btn-icon btn-cancel" onClick={() => { setEditingId(null); setEditValue('') }}>✖</button>
                            </div>
                          </div>
                        ) : needsMine ? (
                          <button className="btn-fill-weight" onClick={() => { setEditingId(r.id); setEditValue('') }}>
                            + Agregar peso
                          </button>
                        ) : (
                          <span className="peso-value">{Number(r.recepcion).toLocaleString('es-MX')} g</span>
                        )}
                      </td>
                      <td className="td-fecha">{formatDate(r.created_at)}</td>
                      <td>
                        <span className={`badge badge-${r.estado}`}>
                          {r.estado === 'pendiente' ? '⏳ Pendiente' : '✅ Completado'}
                        </span>
                      </td>
                      <td className="td-actions">
                        {!isEditing && !needsMine && (
                          <button className="btn-icon btn-edit" onClick={() => { setEditingId(r.id); setEditValue(r.recepcion || '') }} title="Editar">✏️</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="cards-list mobile-only">
            {registros.map((r) => {
              const needsMine = r.recepcion == null
              const isEditing = editingId === r.id
              const isMine = r.creado_por_rol === 'mikele'

              return (
                <div key={r.id} className={`record-card ${needsMine ? 'card-needs-input' : ''} ${r.estado === 'completado' ? 'card-completed' : ''}`}>
                  <div className="record-card-header">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="record-card-producto">{r.producto}</span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>
                        Creado por: {r.creado_por || (r.creado_por_rol === 'laboratorio' ? 'Laboratorio' : 'Mikele')}
                      </span>
                    </div>
                    <span className={`badge badge-${r.estado}`}>
                      {r.estado === 'pendiente' ? '⏳' : '✅'}
                    </span>
                  </div>
                  <div className="record-card-body">
                    <div className="record-card-field">
                      <span className="record-card-label">Peso Recepción</span>
                      {isEditing ? (
                        <div className="mobile-edit-group">
                          <input type="number" className="mobile-edit-input" value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, r.id, r)} autoFocus placeholder="Peso en g" />
                          <div className="mobile-edit-actions">
                            <button className="btn-mobile-save" onClick={() => handleSave(r.id, r)} disabled={savingId === r.id}>
                              {savingId === r.id ? 'Guardando...' : '💾 Guardar'}
                            </button>
                            <button className="btn-mobile-cancel" onClick={() => { setEditingId(null); setEditValue('') }}>Cancelar</button>
                          </div>
                        </div>
                      ) : needsMine ? (
                        <button className="btn-fill-weight-mobile" onClick={() => { setEditingId(r.id); setEditValue('') }}>
                          + Agregar peso
                        </button>
                      ) : (
                        <div className="record-card-value-row">
                          <span className="peso-value">{Number(r.recepcion).toLocaleString('es-MX')} g</span>
                          <button className="btn-icon btn-edit" onClick={() => { setEditingId(r.id); setEditValue(r.recepcion || '') }}>✏️</button>
                        </div>
                      )}
                    </div>
                    <div className="record-card-meta">
                      <span className="record-card-date">{formatDate(r.created_at)}</span>
                      {!isMine && needsMine && <span className="tag-from">de Laboratorio</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default TablaMikele
