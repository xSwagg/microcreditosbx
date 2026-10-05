const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const verifyToken = require('../middleware/auth.middleware');

// AUTENTICACIÓN
router.post('/registro', ctrl.registro);                  // POST   /api/registro
router.post('/login', ctrl.login);                        // POST   /api/login

// PERFIL
router.get('/perfil/:usuario_id', verifyToken, ctrl.getPerfil);        // GET    /api/perfil/:id
router.put('/perfil/:usuario_id', verifyToken, ctrl.updatePerfil);     // PUT    /api/perfil/:id
router.put('/perfil/:usuario_id/password', verifyToken, ctrl.updatePassword); // PUT /api/perfil/:id/password

// ADMIN - USUARIOS
router.get('/admin/usuarios', verifyToken, ctrl.getAllUsuarios);       // GET    /api/admin/usuarios
router.put('/admin/usuarios/:usuario_id/rol', verifyToken, ctrl.updateRol);  // PUT  /api/admin/usuarios/:id/rol?rol=
router.put('/admin/usuarios/:usuario_id', verifyToken, ctrl.updateUsuarioAdmin); // PUT /api/admin/usuarios/:id
router.delete('/admin/usuarios/:usuario_id', verifyToken, ctrl.deleteUsuario);  // DELETE /api/admin/usuarios/:id

module.exports = router;
