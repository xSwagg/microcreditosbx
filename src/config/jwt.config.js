require('dotenv').config(); // Carga JWT_SECRET, JWT_EXPIRES desde .env

/*
 * CONFIGURACIÓN JWT (JSON Web Token)
 * -----------------------------------
 * Un JWT tiene 3 partes (Base64Url encoded, separadas por '.'):
 *   1. Header:    { "alg": "HS256", "typ": "JWT" }        → algoritmo y tipo
 *   2. Payload:   { "id": 1, "correo": "x@y.com", "rol": "cliente", "iat": 123, "exp": 456 } → datos + timestamps
 *   3. Signature: HMAC_SHA256(base64(header) + "." + base64(payload), secret) → firma que garantiza integridad
 *
 * El SECRET es la llave que firma y verifica. Si se filtra, cualquiera puede crear tokens válidos.
 * Por eso: NUNCA en código, SIEMPRE en variable de entorno (.env).
 *
 * expiresIn: tiempo de vida del token. Formatos: '24h', '7d', '30m', '1y', o segundos (número).
 *   - Corto (15m-1h): más seguro, pero usuario debe re-logearse seguido.
 *   - Largo (24h-7d): mejor UX, pero si roban token tienen más tiempo.
 *   - Patrón pro: access token corto (15m) + refresh token largo (7d) en httpOnly cookie.
 */

const config = {
  jwt: {
    // secret: clave para firmar/verificar. MÍNIMO 32 chars aleatorios en producción.
    // En dev usamos fallback inseguro SOLO para que la app arranque sin .env.
    secret: process.env.JWT_SECRET || 'your-super-secret-key',

    // expiresIn: expiración del token. '24h' = 24 horas desde emisión.
    expiresIn: process.env.JWT_EXPIRES || '24h',
  },
};

// Alerta en consola si no hay .env (útil en dev, en prod debe fallar)
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET no está definido en .env — se usará valor INSEGURO por defecto');
  console.warn('   En producción define JWT_SECRET con 32+ caracteres aleatorios');
}

module.exports = config;
