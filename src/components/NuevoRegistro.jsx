import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'

function NuevoRegistro({ onRegistroCreado }) {
  const { usuario, role } = useApp()
  const [productos, setProductos] = useState([])
  const [producto, setProducto] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
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
    
    if (!producto) {
      setError('Por favor selecciona un sabor de la lista.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    const registro = {
      producto,
      creado_por: usuario.nombre,
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
      setSearchTerm('')
      setPeso('')
      if (onRegistroCreado) onRegistroCreado()
    }

    setLoading(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  const isLab = role === 'laboratorio'
  const pesoLabel = isLab ? 'Peso de Transferencia' : 'Peso de Recepción'
  const emoji = isLab ? '🔬' : '🍨'

  // Filtrar los sabores por término de búsqueda
  const filteredProductos = productos.filter((p) =>
    p.gelato.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="card nuevo-registro">
      <h2>{emoji} Nuevo Registro</h2>
      <form onSubmit={handleSubmit} id="form-nuevo-registro">
        <div className="form-group" style={{ position: 'relative' }}>
          <label htmlFor="input-search-producto">Producto (Sabor)</label>
          <div className="searchable-dropdown">
            <input
              id="input-search-producto"
              type="text"
              className="searchable-dropdown-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setProducto('') // Reiniciar hasta que hagan clic en uno
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 250)}
              placeholder="Escribe para buscar sabor..."
              required
              autoComplete="off"
            />
            {isOpen && (
              <div className="searchable-dropdown-menu">
                {filteredProductos.length === 0 ? (
                  <div className="searchable-dropdown-no-results">No se encontraron sabores</div>
                ) : (
                  filteredProductos.map((p, i) => (
                    <div
                      key={i}
                      className={`searchable-dropdown-item ${producto === p.gelato ? 'selected' : ''}`}
                      onClick={() => {
                        setProducto(p.gelato)
                        setSearchTerm(p.gelato)
                        setIsOpen(false)
                      }}
                    >
                      {p.gelato}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
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

        {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginTop: '1rem' }}>{success}</div>}

        <button type="submit" id="btn-crear-registro" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
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
