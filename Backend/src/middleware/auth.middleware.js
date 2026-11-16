const jwt = require('jsonwebtoken');
const config = require('../config/jwt.config');

/*
 * MIDDLEWARE DE AUTENTICACIÓN JWT
 * --------------------------------
 * Flujo:
 *   1. Cliente envía token en header:  Authorization: Bearer <token>
 *      (o header legacy: x-access-token: <token>)
 *   2. Middleware extrae el token del header
 *   3. jwt.verify(token, secret) → valida firma Y expiración (exp en payload)
 *   4. Si OK: decoded = { id, correo, rol, iat, exp } → lo guarda en req.user
 *   5. next() → pasa al controlador, que ya tiene req.user disponible
 *
 * Códigos de estado HTTP:
 *   - 403 Forbidden: no hay token (cliente no se autenticó)
 *   - 401 Unauthorized: token inválido, malformed, o expirado (cliente autenticado pero token malo)
 *
 * Diferencia clave:
 *   403 = "No sé quién eres, no te dejo entrar"
 *   401 = "Sé quién dices ser, pero tu credencial no es válida/ha expirado"
 */

const verifyToken = (req, res, next) => {
  // Acepta dos headers por compatibilidad:
  // - Authorization: Bearer <token>  (estándar OAuth2/RFC 6750)
  // - x-access-token: <token>        (legacy, algunos clientes antiguos)
  const raw = req.headers['x-access-token'] || req.headers['authorization'];
  // Algunos proxies repiten el header y Node lo entrega como array.
  const header = Array.isArray(raw) ? raw[0] : raw;

  // Sin header = no hay credenciales
  if (!header) {
    return res.status(403).json({ ok: false, msg: 'Token no proporcionado' });
  }

  // Extrae token puro: quita "Bearer " si viene (sin importar mayúsculas)
  // Ej: "Bearer eyJhbGciOi..." → "eyJhbGciOi..."
  const token = header.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return res.status(403).json({ ok: false, msg: 'Token no proporcionado' });
  }

  try {
    // jwt.verify hace 2 cosas:
    // 1. Verifica la firma (HMAC con secret) → asegura que NO fue modificado
    // 2. Verifica exp (expiración) → asegura que NO está vencido
    // Si algo falla, lanza: JsonWebTokenError, TokenExpiredError, NotBeforeError
    const decoded = jwt.verify(token, config.jwt.secret);

    // Un token válido siempre debe identificar a un usuario.
    if (!decoded || !decoded.id) {
      return res.status(401).json({ ok: false, msg: 'Token inválido' });
    }

    // decoded = payload del JWT: { id, correo, rol, iat, exp }
    // Lo exponemos en req.user para que los controladores lo usen:
    //   req.user.id   → id_usuario
    //   req.user.correo → email
    //   req.user.rol  → 'cliente' | 'asesor' | 'administrador'
    req.user = decoded;

    next(); // Token válido → continua al controlador
  } catch (error) {
    // Manejo granular de errores de JWT
    if (error.name === 'TokenExpiredError') {
      // exp < ahora → token vencido
      return res.status(401).json({ ok: false, msg: 'Token expirado' });
    }
    // Cualquier otro error: firma inválida, token malformed, algoritmo incorrecto, etc.
    return res.status(401).json({ ok: false, msg: 'Token inválido' });
  }
};

module.exports = verifyToken;

//Revisa que el token JWT sea válido ANTES de dejarte entrar a las rutas privadas.
//Si no tienes token o está vencido/inválido → te rechaza en la puerta (401/403). 
//Si es válido → te deja pasar y te pone una pulsera (req.user) con tus datoS