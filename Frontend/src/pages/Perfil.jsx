import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerPerfilCompleto, cambiarContrasena } from '../services/auth'

const formatoFecha = (valor) => {
  if (!valor) return '-'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return String(valor)
  return fecha.toLocaleDateString('es-CO')
}

const formatoDinero = (valor) => {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return '-'
  return numero.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  })
}

export default function Perfil() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [clave, setClave] = useState({
    contrasena_actual: '',
    contrasena_nueva: '',
  })
  const [cambiando, setCambiando] = useState(false)

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user) return

    obtenerPerfilCompleto(user.id_usuario)
      .then(setDatos)
      .catch((err) =>
        setError(err.response?.data?.msg || 'No se pudo cargar el perfil')
      )
  }, [user])

  if (loading || !user) {
    return (
      <div className="contenedor">
        <p className="contenedor">Cargando perfil...</p>
      </div>
    )
  }

  const perfil = datos || user

  const enviarClave = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    if (clave.contrasena_nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    setCambiando(true)

    try {
      const respuesta = await cambiarContrasena(user.id_usuario, clave)
      setMensaje(respuesta.msg || 'Contraseña actualizada')
      setClave({ contrasena_actual: '', contrasena_nueva: '' })
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo cambiar la contraseña')
    } finally {
      setCambiando(false)
    }
  }

  return (
    <div className="contenedor perfil">
      <div className="cabecera-perfil">
        <div>
          <h1>Mi perfil</h1>
          <p className="texto-gris">Datos de tu cuenta en Microcréditos BX.</p>
        </div>

        <button
          type="button"
          className="boton boton-claro"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {error && <p className="mensaje error">{error}</p>}
      {mensaje && <p className="mensaje exito">{mensaje}</p>}

      <div className="panel">
        <h2>Datos personales</h2>
        <div className="datos">
          <div><span>Nombre</span><strong>{perfil.nombre || '-'}</strong></div>
          <div><span>Apellido</span><strong>{perfil.apellido || '-'}</strong></div>
          <div><span>Cédula</span><strong>{perfil.cedula || '-'}</strong></div>
          <div><span>Correo</span><strong>{perfil.correo || '-'}</strong></div>
          <div><span>Teléfono</span><strong>{perfil.telefono || '-'}</strong></div>
          <div><span>Rol</span><strong>{perfil.rol || 'cliente'}</strong></div>
          <div><span>Nivel</span><strong>{perfil.nivel || 'basico'}</strong></div>
          <div><span>Registro</span><strong>{formatoFecha(perfil.fecha_registro)}</strong></div>
        </div>
      </div>

      <div className="panel">
        <h2>Mis solicitudes</h2>

        {!perfil.solicitudes?.length ? (
          <p className="texto-gris">Todavía no tienes solicitudes registradas.</p>
        ) : (
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {perfil.solicitudes.map((s) => (
                  <tr key={s.id_solicitud}>
                    <td>{s.id_solicitud}</td>
                    <td>{formatoDinero(s.monto)}</td>
                    <td>{formatoFecha(s.fecha)}</td>
                    <td>
                      <span className={`etiqueta ${s.estado}`}>{s.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h2>Mis créditos</h2>

        {!perfil.creditos?.length ? (
          <p className="texto-gris">No tienes créditos aprobados.</p>
        ) : (
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Monto</th>
                  <th>Saldo</th>
                  <th>Cuotas</th>
                  <th>Tasa</th>
                </tr>
              </thead>
              <tbody>
                {perfil.creditos.map((c) => (
                  <tr key={c.id_credito}>
                    <td>{c.id_credito}</td>
                    <td>{formatoDinero(c.monto_aprobado)}</td>
                    <td>{formatoDinero(c.saldo_pendiente)}</td>
                    <td>{c.cuotas_pagadas}/{c.cuotas_totales}</td>
                    <td>{c.tasa_interes}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h2>Notificaciones</h2>

        {!perfil.notificaciones?.length ? (
          <p className="texto-gris">No tienes notificaciones.</p>
        ) : (
          <ul className="notificaciones">
            {perfil.notificaciones.map((n) => (
              <li key={n.id_notificacion}>
                <p>{n.mensaje}</p>
                <small>
                  {formatoFecha(n.fecha_envio)} · {n.leida ? 'leída' : 'nueva'}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel">
        <h2>Cambiar contraseña</h2>

        <form className="formulario-clave" onSubmit={enviarClave}>
          <div>
            <label htmlFor="actual">Contraseña actual</label>
            <input
              id="actual"
              type="password"
              value={clave.contrasena_actual}
              onChange={(e) =>
                setClave({ ...clave, contrasena_actual: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label htmlFor="nueva">Contraseña nueva</label>
            <input
              id="nueva"
              type="password"
              value={clave.contrasena_nueva}
              onChange={(e) =>
                setClave({ ...clave, contrasena_nueva: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="boton" disabled={cambiando}>
            {cambiando ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
