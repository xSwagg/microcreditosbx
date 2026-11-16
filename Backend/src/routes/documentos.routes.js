const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/documentos.controller');
const verifyToken = require('../middleware/auth.middleware');

// DOCUMENTOS (público)
router.get('/documentos', ctrl.getAll);                              // GET    /api/documentos?usuario=&estado=
router.get('/documentos/:documento_id', ctrl.getById);               // GET    /api/documentos/:id
router.get('/usuario/:usuario_id/documentos', ctrl.getByUsuario);     // GET    /api/usuario/:id/documentos
router.post('/usuario/:usuario_id/documentos', ctrl.createForUsuario); // POST  /api/usuario/:id/documentos

// ADMIN - DOCUMENTOS
router.post('/admin/documentos', verifyToken, ctrl.create);                        // POST   /api/admin/documentos
router.put('/admin/documentos/:documento_id/revision', verifyToken, ctrl.revisar); // PUT    /api/admin/documentos/:id/revision
router.delete('/admin/documentos/:documento_id', verifyToken, ctrl.remove);        // DELETE /api/admin/documentos/:id

module.exports = router;

