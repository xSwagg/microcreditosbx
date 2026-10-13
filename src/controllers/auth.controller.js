const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/jwt.config');
const model = require('../models/auth.model');

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
    const nombre = body.nombre;
    const apellido = body.apellido;
    const cedula = body.cedula;
    const correo = body.correo || body.email;
    const contrasena = body.contrasena || body.password;
    const telefono = body.telefono;

    if (!nombre || !cedula || !correo || !contrasena) {
      return res.status(400).json({
        ok: false,
        msg: 'nombre, cedula, correo y contrasena son obligatorios',
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
    const hashedPassword = await bcrypt.hash(contrasena, 10);

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
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/auth/login  (pública)
const login = async (req, res) => {
  try {
    const body = req.body || {};
    const correo = body.correo || body.email;
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

    // bcrypt.compare: compara el texto plano con el hash almacenado
    if (!(await bcrypt.compare(contrasena, usuario.contrasena))) {
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
        rol: usuario.rol,
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
