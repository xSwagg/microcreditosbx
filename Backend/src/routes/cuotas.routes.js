const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cuotas.controller');
const verifyToken = require('../middleware/auth.middleware');

// CUOTAS (público)
router.get('/cuotas', ctrl.getAll);                              // GET    /api/cuotas?credito=&estado=
router.get('/cuotas/credito/:credito_id', ctrl.getByCredito);     // GET    /api/cuotas/credito/:id
router.get('/cuotas/:cuota_id', ctrl.getById);                    // GET    /api/cuotas/:id
router.put('/cuotas/:cuota_id/pago', ctrl.pagar);                 // PUT    /api/cuotas/:id/pago

// ADMIN - CUOTAS
router.post('/admin/cuotas/credito/:credito_id', verifyToken, ctrl.generarPlan);    // POST /api/admin/cuotas/credito/:id
router.put('/admin/cuotas/marcar-vencidas', verifyToken, ctrl.marcarVencidas);      // PUT  /api/admin/cuotas/marcar-vencidas
router.delete('/admin/cuotas/:cuota_id', verifyToken, ctrl.remove);                 // DELETE /api/admin/cuotas/:id

module.exports = router;

