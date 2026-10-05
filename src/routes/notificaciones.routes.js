const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificaciones.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/notificaciones/:usuario_id', ctrl.getByUsuario);        // GET /api/notificaciones/:id
router.put('/notificaciones/:notificacion_id/leida', ctrl.setLeida); // PUT /api/notificaciones/:id/leida
router.post('/admin/notificaciones', verifyToken, ctrl.create);                  // POST /api/admin/notificaciones
router.delete('/admin/notificaciones/:notificacion_id', verifyToken, ctrl.remove); // DELETE /api/admin/notificaciones/:id

module.exports = router;
