import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await login(correo, contrasena)
      navigate('/perfil')
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo iniciar sesión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="centro">
      <div className="formulario-caja">
        <h1>Iniciar sesión</h1>
        <p className="texto-gris">
          Ingresa con el correo y la contraseña de tu cuenta.
        </p>

        {error && <p className="mensaje error">{error}</p>}

        <form onSubmit={enviar}>
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Tu contraseña"
            required
          />

          <button type="submit" className="boton boton-ancho" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="pie-formulario">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
