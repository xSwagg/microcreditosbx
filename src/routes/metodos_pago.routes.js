const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/metodos_pago.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/metodos_pago', ctrl.getAll);                  // GET    /api/metodos_pago
router.get('/metodos_pago/:metodo_id', ctrl.getById);     // GET    /api/metodos_pago/:id
router.post('/admin/metodos_pago', verifyToken, ctrl.create);          // POST   /api/admin/metodos_pago
router.put('/admin/metodos_pago/:metodo_id', verifyToken, ctrl.update); // PUT   /api/admin/metodos_pago/:id
router.delete('/admin/metodos_pago/:metodo_id', verifyToken, ctrl.remove); // DELETE /api/admin/metodos_pago/:id

module.exports = router;
