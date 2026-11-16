import { createContext, useContext, useEffect, useState } from 'react'
import { registrar, iniciarSesion, obtenerPerfil } from '../services/auth'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  // Al recargar la página se recupera la sesión con el token guardado.
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    obtenerPerfil()
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false))
  }, [])

  const login = async (correo, contrasena) => {
    const { token } = await iniciarSesion(correo, contrasena)
    localStorage.setItem('token', token)
    const perfil = await obtenerPerfil()
    setUser(perfil)
    return perfil
  }

  // El registro no inicia sesión: la cuenta se crea y el usuario
  // vuelve al login para entrar con sus credenciales.
  const register = async (datos) => registrar(datos)

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
