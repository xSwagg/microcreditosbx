const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/comisiones.controller');

// COMISIONES (público)
router.get('/comisiones', ctrl.getAll);                              // GET    /api/comisiones?pago=
router.get('/comisiones/pago/:pago_id', ctrl.getByPago);             // GET    /api/comisiones/pago/:id
router.get('/comisiones/:comision_id', ctrl.getById);                // GET    /api/comisiones/:id

// ADMIN - COMISIONES
router.post('/admin/comisiones', ctrl.create);                       // POST   /api/admin/comisiones
router.put('/admin/comisiones/:comision_id', ctrl.update);           // PUT    /api/admin/comisiones/:id
router.delete('/admin/comisiones/:comision_id', ctrl.remove);        // DELETE /api/admin/comisiones/:id

module.exports = router;
