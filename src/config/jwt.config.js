require('dotenv').config();

// Configuración de JWT
// El secret NUNCA se escribe en el código: se lee del .env
const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRES || '24h',
  },
};

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET no está definido en el .env (se usará un valor inseguro)');
}

module.exports = config;
