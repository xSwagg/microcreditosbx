import api from '../api/axios'

export const registrar = (datos) =>
  api.post('/auth/register', datos).then((r) => r.data)

export const iniciarSesion = (correo, contrasena) =>
  api.post('/auth/login', { correo, contrasena }).then((r) => r.data)

export const obtenerPerfil = () => api.get('/auth/me').then((r) => r.data.data)

// Perfil completo: datos + solicitudes + créditos + notificaciones.
export const obtenerPerfilCompleto = (id) =>
  api.get(`/perfil/${id}`).then((r) => r.data.data)

export const cambiarContrasena = (id, datos) =>
  api.put(`/perfil/${id}/password`, datos).then((r) => r.data)
