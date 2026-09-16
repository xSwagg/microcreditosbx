const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/creditos.controller');

// CRÉDITOS (público)
router.get('/creditos', ctrl.getAll);                          // GET    /api/creditos
router.get('/creditos/usuario/:usuario_id', ctrl.getByUsuario); // GET  /api/creditos/usuario/:id?activo=
router.get('/creditos/:credito_id', ctrl.getById);            // GET    /api/creditos/:id

// ADMIN - CRÉDITOS
router.post('/admin/creditos', ctrl.create);                  // POST   /api/admin/creditos
router.put('/admin/creditos/:credito_id', ctrl.update);       // PUT    /api/admin/creditos/:id
router.delete('/admin/creditos/:credito_id', ctrl.remove);    // DELETE /api/admin/creditos/:id

module.exports = router;