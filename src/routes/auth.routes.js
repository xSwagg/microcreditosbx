const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

// Rutas públicas (no requieren token)
router.post('/register', ctrl.register); // POST /api/auth/register
router.post('/login', ctrl.login);       // POST /api/auth/login

// Rutas privadas (requieren token)
router.get('/me', verifyToken, ctrl.me); // GET  /api/auth/me

module.exports = router;
