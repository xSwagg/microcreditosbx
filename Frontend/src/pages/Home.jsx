import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="contenedor portada">
      <div className="portada-texto">
        <h1>Créditos rápidos para tus proyectos</h1>
        <p>Microcréditos BX es un sistema para solicitar y administrar créditos de consumo. Regístrate, completa tu perfil y revisa el estado de tus solicitudes desde cualquier lugar.</p>

        <div className="acciones">
          {user ? (
            <Link to="/perfil" className="boton">Ir a mi perfil</Link>
          ) : (
            <>
              <Link to="/register" className="boton">Crear una cuenta</Link>
              <Link to="/login" className="boton boton-claro">Ya tengo cuenta</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
