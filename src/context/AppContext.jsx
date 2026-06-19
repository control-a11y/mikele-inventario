import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_EMAILS = ['control@yoops.hn', 'willa.ia26@gmail.com']

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

export function useRole() {
  const { role } = useContext(AppContext)
  return { role }
}

export function AppProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('mikele-role'))
  const [adminUser, setAdminUser] = useState(null)
  const [adminLoading, setAdminLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        const email = (data.session.user.email || '').toLowerCase()
        if (ADMIN_EMAILS.includes(email)) {
          setAdminUser(data.session.user)
        } else {
          supabase.auth.signOut()
        }
      }
      setAdminLoading(false)
    }).catch(() => setAdminLoading(false))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = (session.user.email || '').toLowerCase()
        if (ADMIN_EMAILS.includes(email)) {
          setAdminUser(session.user)
        }
      } else {
        setAdminUser(null)
      }
    })

    return () => listener?.subscription?.unsubscribe()
  }, [])

  const isAdmin = !!adminUser

  function selectRole(r) {
    setRole(r)
    localStorage.setItem('mikele-role', r)
  }

  function clearRole() {
    setRole(null)
    localStorage.removeItem('mikele-role')
  }

  async function adminSignIn(email, password) {
    const normalized = (email || '').toLowerCase().trim()
    if (!ADMIN_EMAILS.includes(normalized)) {
      return { error: { message: 'Este correo no tiene acceso de administrador.' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalized, password })
    return { data, error }
  }

  async function adminSignUp(email, password) {
    const normalized = (email || '').toLowerCase().trim()
    if (!ADMIN_EMAILS.includes(normalized)) {
      return { error: { message: 'Este correo no tiene acceso de administrador.' } }
    }
    const { data, error } = await supabase.auth.signUp({ email: normalized, password })
    return { data, error }
  }

  async function adminSignOut() {
    await supabase.auth.signOut()
    setAdminUser(null)
  }

  return (
    <AppContext.Provider value={{
      role, selectRole, clearRole,
      isAdmin, adminUser, adminLoading,
      adminSignIn, adminSignUp, adminSignOut,
    }}>
      {children}
    </AppContext.Provider>
  )
}
