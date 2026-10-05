const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/comisiones.controller');
const verifyToken = require('../middleware/auth.middleware');

// COMISIONES (público)
router.get('/comisiones', ctrl.getAll);                              // GET    /api/comisiones?pago=
router.get('/comisiones/pago/:pago_id', ctrl.getByPago);             // GET    /api/comisiones/pago/:id
router.get('/comisiones/:comision_id', ctrl.getById);                // GET    /api/comisiones/:id

// ADMIN - COMISIONES
router.post('/admin/comisiones', verifyToken, ctrl.create);                       // POST   /api/admin/comisiones
router.put('/admin/comisiones/:comision_id', verifyToken, ctrl.update);           // PUT    /api/admin/comisiones/:id
router.delete('/admin/comisiones/:comision_id', verifyToken, ctrl.remove);        // DELETE /api/admin/comisiones/:id

module.exports = router;

