const jwt = require('jsonwebtoken');
const config = require('../config/jwt.config');

// Middleware de autenticación: valida el JWT de la request
// y expone los datos del usuario en req.user
const verifyToken = (req, res, next) => {
  const header = req.headers['x-access-token'] || req.headers['authorization'];

  if (!header) {
    return res.status(403).json({ ok: false, msg: 'Token no proporcionado' });
  }

  // Acepta "Bearer <token>" o el token solo
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ ok: false, msg: 'Token expirado' });
    }
    return res.status(401).json({ ok: false, msg: 'Token inválido' });
  }
};

module.exports = verifyToken;
