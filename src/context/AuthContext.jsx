import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const USERS_MAP = {
  'control@yoops.hn': { label: 'Admin', views: ['laboratorio', 'mikele'] },
  'administracion@yoops.hn': { label: 'Laboratorio', views: ['laboratorio'] },
  'mikelempsps@gmail.com': { label: 'Mikele', views: ['mikele'] },
  'willa.ia26@gmail.com': { label: 'Admin', views: ['laboratorio', 'mikele'] },
}

export const APPROVED_EMAILS = Object.keys(USERS_MAP)

const AuthContext = createContext({
  user: null, permissions: null, activeView: null,
  setActiveView: () => {}, loading: true,
  signIn: async () => {}, signUp: async () => {}, signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function useRole() {
  const ctx = useContext(AuthContext)
  return { role: ctx?.activeView || null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState(null)
  const [activeView, setActiveView] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const { data } = await supabase.auth.getSession()
        if (mounted && data?.session?.user) {
          const ok = setupUser(data.session.user)
          if (!ok) {
            // Email not approved — sign out silently
            await supabase.auth.signOut()
          }
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return
        if (session?.user) {
          const ok = setupUser(session.user)
          if (!ok) {
            supabase.auth.signOut()
            return
          }
        } else {
          setUser(null)
          setPermissions(null)
          setActiveView(null)
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  function setupUser(authUser) {
    const email = (authUser.email || '').toLowerCase()
    const perms = USERS_MAP[email] || null
    if (!perms) {
      // Not an approved email
      setUser(null)
      setPermissions(null)
      setActiveView(null)
      return false
    }
    setUser(authUser)
    setPermissions(perms)
    setActiveView(prev => prev || perms.views[0])
    return true
  }

  async function signIn(email, password) {
    const normalized = (email || '').toLowerCase().trim()
    if (!USERS_MAP[normalized]) {
      return { data: null, error: { message: 'Este correo no tiene acceso al sistema.' } }
    }
    return await supabase.auth.signInWithPassword({ email: normalized, password })
  }

  async function signUp(email, password) {
    const normalized = (email || '').toLowerCase().trim()
    if (!USERS_MAP[normalized]) {
      return { data: null, error: { message: 'Este correo no tiene acceso al sistema.' } }
    }
    return await supabase.auth.signUp({ email: normalized, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setPermissions(null)
    setActiveView(null)
  }

  return (
    <AuthContext.Provider value={{ user, permissions, activeView, setActiveView, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
