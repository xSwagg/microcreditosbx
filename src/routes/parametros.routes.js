const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/parametros.controller');

// PARÁMETROS (público)
router.get('/parametros', ctrl.getAll);                                // GET    /api/parametros
router.get('/parametros/clave/:clave', ctrl.getByClave);               // GET    /api/parametros/clave/:clave
router.get('/parametros/:parametro_id', ctrl.getById);                 // GET    /api/parametros/:id

// ADMIN - PARÁMETROS
router.post('/admin/parametros', ctrl.create);                         // POST   /api/admin/parametros
router.put('/admin/parametros/upsert', ctrl.upsert);                   // PUT    /api/admin/parametros/upsert
router.put('/admin/parametros/:parametro_id', ctrl.update);            // PUT    /api/admin/parametros/:id
router.delete('/admin/parametros/:parametro_id', ctrl.remove);         // DELETE /api/admin/parametros/:id

module.exports = router;
