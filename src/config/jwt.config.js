require('dotenv').config();

const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRES || '24h',
  },
};

module.exports = config;
