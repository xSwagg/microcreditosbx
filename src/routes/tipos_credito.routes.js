const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tipos_credito.controller');
const verifyToken = require('../middleware/auth.middleware');

// TIPOS DE CRÉDITO (público)
router.get('/tipos_credito', ctrl.getAll);                          // GET    /api/tipos_credito?activo=
router.get('/tipos_credito/:tipo_id', ctrl.getById);                // GET    /api/tipos_credito/:id
router.post('/tipos_credito/:tipo_id/simular', ctrl.simular);       // POST   /api/tipos_credito/:id/simular

// ADMIN - TIPOS DE CRÉDITO
router.post('/admin/tipos_credito', verifyToken, ctrl.create);                   // POST   /api/admin/tipos_credito
router.put('/admin/tipos_credito/:tipo_id', verifyToken, ctrl.update);            // PUT    /api/admin/tipos_credito/:id
router.delete('/admin/tipos_credito/:tipo_id', verifyToken, ctrl.remove);         // DELETE /api/admin/tipos_credito/:id

module.exports = router;

