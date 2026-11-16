import axios from 'axios'

// Si no existe Frontend/.env se usa el backend local por defecto.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

// Agrega el token guardado a todas las peticiones.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token venció o es inválido, se cierra la sesión.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const esRutaAuth = err.config?.url?.includes('/auth/')
    if (err.response?.status === 401 && !esRutaAuth) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default api
