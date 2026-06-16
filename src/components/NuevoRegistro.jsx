import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRole } from '../context/AuthContext'

function NuevoRegistro({ onRegistroCreado }) {
  const { role } = useRole()
  const [productos, setProductos] = useState([])
  const [producto, setProducto] = useState('')
  const [peso, setPeso] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProductos()
  }, [])

  async function fetchProductos() {
    const { data, error } = await supabase
      .from('Gelatos')
      .select('gelato')
      .order('gelato')

    if (!error && data) {
      setProductos(data)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const registro = {
      producto,
      creado_por_rol: role,
      estado: 'pendiente',
    }

    if (role === 'laboratorio') {
      registro.transferencia = parseFloat(peso)
    } else {
      registro.recepcion = parseFloat(peso)
    }

    const { error: insertError } = await supabase
      .from('Transferencias')
      .insert(registro)

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess('¡Registro creado!')
      setProducto('')
      setPeso('')
      if (onRegistroCreado) onRegistroCreado()
    }

    setLoading(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  const isLab = role === 'laboratorio'
  const pesoLabel = isLab ? 'Peso de Transferencia' : 'Peso de Recepción'
  const emoji = isLab ? '🔬' : '🍨'

  return (
    <div className="card nuevo-registro">
      <h2>{emoji} Nuevo Registro</h2>
      <form onSubmit={handleSubmit} id="form-nuevo-registro">
        <div className="form-group">
          <label htmlFor="select-producto">Producto</label>
          <select
            id="select-producto"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            required
          >
            <option value="">Seleccionar producto...</option>
            {productos.map((p, i) => (
              <option key={i} value={p.gelato}>
                {p.gelato}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="input-peso">{pesoLabel} (g)</label>
          <input
            id="input-peso"
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Ej: 6500"
            required
            min="0"
            step="1"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" id="btn-crear-registro" className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="btn-loading">
              <span className="loading-spinner-sm" />
              Guardando...
            </span>
          ) : (
            'Crear Registro'
          )}
        </button>
      </form>
    </div>
  )
}

export default NuevoRegistro
