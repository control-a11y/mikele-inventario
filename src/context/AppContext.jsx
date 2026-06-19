import { createContext, useContext, useState } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

export function useRole() {
  const { role } = useContext(AppContext)
  return { role }
}

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const saved = localStorage.getItem('mikele-usuario')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Mapear el rol de la base de datos ('transferencia', 'recepcion')
  // a los roles que espera el resto de la aplicación ('laboratorio', 'mikele')
  const role = usuario ? (usuario.rol === 'transferencia' ? 'laboratorio' : 'mikele') : null

  async function login(username, password) {
    try {
      const { data, error } = await supabase.rpc('login_usuario', {
        p_nombre: username.trim(),
        p_password: password
      })

      if (error) throw error

      if (data && data.length > 0) {
        const userSession = data[0]
        setUsuario(userSession)
        localStorage.setItem('mikele-usuario', JSON.stringify(userSession))
        return { data: userSession }
      } else {
        return { error: { message: 'Usuario o contraseña incorrectos.' } }
      }
    } catch (err) {
      return { error: { message: err.message || 'Error al iniciar sesión' } }
    }
  }

  async function register(username, password, selectedRol) {
    try {
      const { error } = await supabase.rpc('registrar_usuario', {
        p_nombre: username.trim(),
        p_password: password,
        p_rol: selectedRol // 'transferencia' o 'recepcion'
      })

      if (error) throw error

      return { success: true }
    } catch (err) {
      return { error: { message: err.message || 'Error al registrar usuario' } }
    }
  }

  async function changePassword(username, oldPassword, newPassword) {
    try {
      const { data, error } = await supabase.rpc('cambiar_password_usuario', {
        p_nombre: username.trim(),
        p_old_password: oldPassword,
        p_new_password: newPassword
      })

      if (error) throw error

      if (data === true) {
        // Actualizar sesión local con el flag de cambio de contraseña en false
        if (usuario && usuario.nombre.toLowerCase() === username.toLowerCase()) {
          const updatedUser = { ...usuario, debe_cambiar_password: false }
          setUsuario(updatedUser)
          localStorage.setItem('mikele-usuario', JSON.stringify(updatedUser))
        }
        return { success: true }
      } else {
        return { error: { message: 'La contraseña actual no es correcta.' } }
      }
    } catch (err) {
      return { error: { message: err.message || 'Error al cambiar contraseña' } }
    }
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem('mikele-usuario')
  }

  return (
    <AppContext.Provider value={{
      usuario,
      role,
      login,
      register,
      changePassword,
      logout
    }}>
      {children}
    </AppContext.Provider>
  )
}
