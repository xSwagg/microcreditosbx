const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/oficinas.controller');

// OFICINAS (público)
router.get('/oficinas', ctrl.getAll);                          // GET    /api/oficinas?activo=
router.get('/oficinas/:oficina_id', ctrl.getById);            // GET    /api/oficinas/:id

// ADMIN - OFICINAS
router.post('/admin/oficinas', ctrl.create);                   // POST   /api/admin/oficinas
router.put('/admin/oficinas/:oficina_id', ctrl.update);        // PUT    /api/admin/oficinas/:id
router.put('/admin/oficinas/:oficina_id/activo', ctrl.activar); // PUT  /api/admin/oficinas/:id/activo
router.delete('/admin/oficinas/:oficina_id', ctrl.remove);     // DELETE /api/admin/oficinas/:id

module.exports = router;
