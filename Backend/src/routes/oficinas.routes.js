const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/oficinas.controller');
const verifyToken = require('../middleware/auth.middleware');

// OFICINAS (público)
router.get('/oficinas', ctrl.getAll);                          // GET    /api/oficinas?activo=
router.get('/oficinas/:oficina_id', ctrl.getById);            // GET    /api/oficinas/:id

// ADMIN - OFICINAS
router.post('/admin/oficinas', verifyToken, ctrl.create);                   // POST   /api/admin/oficinas
router.put('/admin/oficinas/:oficina_id', verifyToken, ctrl.update);        // PUT    /api/admin/oficinas/:id
router.put('/admin/oficinas/:oficina_id/activo', verifyToken, ctrl.activar); // PUT  /api/admin/oficinas/:id/activo
router.delete('/admin/oficinas/:oficina_id', verifyToken, ctrl.remove);     // DELETE /api/admin/oficinas/:id

module.exports = router;

