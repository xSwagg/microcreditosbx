const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pagos.controller');

// PAGOS
router.get('/pagos', ctrl.getAll);                          // GET    /api/pagos
router.get('/pagos/credito/:credito_id', ctrl.getByCredito); // GET  /api/pagos/credito/:id
router.get('/pagos/:pago_id', ctrl.getById);               // GET    /api/pagos/:id
router.post('/pagos', ctrl.registrar);                      // POST   /api/pagos
router.delete('/admin/pagos/:pago_id', ctrl.remove);        // DELETE /api/admin/pagos/:id

module.exports = router;