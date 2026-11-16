const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config/jwt.config');
const model = require('../models/auth.model'); // autenticacion en la base de datos 

// La base puede traer usuarios antiguos guardados con SHA-256.
// Los usuarios nuevos se guardan con bcrypt.
const passwordValida = async (password, hashGuardado) => {
  if (!hashGuardado) return false;
  if (hashGuardado.startsWith('$2')) {
    return bcrypt.compare(password, hashGuardado);
  }
  const sha256 = crypto.createHash('sha256').update(password).digest('hex');
  return sha256 === hashGuardado;
};

// Genera el token firmado con el secret del .env
const generarToken = (usuario) =>
  jwt.sign(
    {
      id: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol || 'cliente',
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

// POST /api/auth/register  (pública)
const register = async (req, res) => {
  try {
    const body = req.body || {};
    const nombre = String(body.nombre || '').trim();
    const apellido = String(body.apellido || '').trim();
    const cedula = String(body.cedula || '').trim();
    const correo = String(body.correo || body.email || '').trim().toLowerCase();
    const contrasena = body.contrasena || body.password;
    const telefono = String(body.telefono || '').trim();

    if (!nombre || !cedula || !correo || !contrasena) {
      return res.status(400).json({
        ok: false,
        msg: 'nombre, cedula, correo y contrasena son obligatorios',
      });
    }

    if (typeof contrasena !== 'string' || contrasena.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    const existente = await model.findByCorreoOCedula(correo, cedula);
    if (existente) {
      return res.status(409).json({
        ok: false,
        msg: 'El correo o la cédula ya están registrados',
      });
    }

    // bcrypt: nunca se guarda la contraseña en texto plano
    const hashedPassword = await bcrypt.hash(contrasena, 10); // encripta la contraseña para seguridad del usuario

    const usuario = await model.create({
      nombre,
      apellido,
      cedula,
      correo,
      contrasena: hashedPassword,
      telefono,
    });

    // Se entrega el token para que quede autenticado tras registrarse
    res.status(201).json({
      ok: true,
      msg: 'Usuario registrado exitosamente',
      id: usuario.id_usuario,
      token: generarToken({ ...usuario, rol: 'cliente' }),
      data: usuario,
    });
  } catch (err) {
    // Si otra petición registró el mismo correo/cédula entre la validación
    // y el INSERT, MySQL devuelve ER_DUP_ENTRY.
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        ok: false,
        msg: 'El correo o la cédula ya están registrados',
      });
    }
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/auth/login  (pública)
const login = async (req, res) => {
  try {
    const body = req.body || {};
    const correo = String(body.correo || body.email || '').trim().toLowerCase();
    const contrasena = body.contrasena || body.password;

    if (!correo || !contrasena) {
      return res.status(400).json({
        ok: false,
        msg: 'correo y contrasena son obligatorios',
      });
    }

    const usuario = await model.findByCorreo(correo);

    if (!usuario) {
      return res.status(401).json({ ok: false, msg: 'Credenciales incorrectas' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ ok: false, msg: 'Usuario desactivado' });
    }

    // Compara el texto plano con el hash almacenado (bcrypt o SHA-256).
    if (!(await passwordValida(contrasena, usuario.contrasena))) {
      return res.status(401).json({ ok: false, msg: 'Credenciales incorrectas' });
    }

    res.json({
      ok: true,
      token: generarToken(usuario),
      data: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: usuario.rol || 'cliente',
        nivel: usuario.nivel,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/auth/me  (privada: requiere token)
const me = async (req, res) => {
  try {
    const perfil = await model.getPerfil(req.user.id);
    if (!perfil) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }
    res.json({ ok: true, data: perfil });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { register, login, me };
