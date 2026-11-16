import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FORMULARIO_INICIAL = {
  nombre: '',
  apellido: '',
  cedula: '',
  correo: '',
  telefono: '',
  contrasena: '',
  confirmar: '',
}

export default function Register() {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [tardando, setTardando] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const cambiar = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const enviar = async (e) => {
    e.preventDefault()
    setError('')

    if (formulario.contrasena !== formulario.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    setEnviando(true)
    setTardando(false)
    // Si Render está dormido, avisar al usuario en vez de dejarlo esperando.
    const aviso = setTimeout(() => setTardando(true), 8000)

    try {
      await register({
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        cedula: formulario.cedula,
        correo: formulario.correo,
        telefono: formulario.telefono,
        contrasena: formulario.contrasena,
      })
      // La cuenta ya existe: se envía al login con el correo precargado.
      navigate('/login', {
        replace: true,
        state: { registrado: true, correo: formulario.correo },
      })
    } catch (err) {
      setError(
        err.code === 'ECONNABORTED'
          ? 'El servidor tardó demasiado en responder. Intenta de nuevo.'
          : err.response?.data?.msg || 'No se pudo crear la cuenta',
      )
    } finally {
      clearTimeout(aviso)
      setTardando(false)
      setEnviando(false)
    }
  }

  return (
    <div className="centro">
      <div className="formulario-caja formulario-ancho">
        <h1>Crear cuenta</h1>
        <p className="texto-gris">Completa tus datos personales.</p>

        {error && <p className="mensaje error">{error}</p>}

        <form onSubmit={enviar}>
          <div className="fila">
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiar}
                required
              />
            </div>
            <div>
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                value={formulario.apellido}
                onChange={cambiar}
              />
            </div>
          </div>

          <div className="fila">
            <div>
              <label htmlFor="cedula">Cédula</label>
              <input
                id="cedula"
                name="cedula"
                value={formulario.cedula}
                onChange={cambiar}
                required
              />
            </div>
            <div>
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                value={formulario.telefono}
                onChange={cambiar}
              />
            </div>
          </div>

          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={formulario.correo}
            onChange={cambiar}
            placeholder="correo@ejemplo.com"
            required
          />

          <div className="fila">
            <div>
              <label htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                value={formulario.contrasena}
                onChange={cambiar}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmar">Confirmar contraseña</label>
              <input
                id="confirmar"
                name="confirmar"
                type="password"
                value={formulario.confirmar}
                onChange={cambiar}
                required
              />
            </div>
          </div>

          <button type="submit" className="boton boton-ancho" disabled={enviando}>
            {enviando ? 'Creando cuenta...' : 'Registrarme'}
          </button>

          {tardando && (
            <p className="texto-gris" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              El servidor está iniciando; la primera vez puede tardar hasta un minuto.
            </p>
          )}
        </form>

        <p className="pie-formulario">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
