const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/garantias.controller');
const verifyToken = require('../middleware/auth.middleware');

// GARANTÍAS (público)
router.get('/garantias', ctrl.getAll);                              // GET    /api/garantias?credito=&usuario=&estado=
router.get('/garantias/credito/:credito_id', ctrl.getByCredito);     // GET    /api/garantias/credito/:id
router.get('/garantias/:garantia_id', ctrl.getById);                 // GET    /api/garantias/:id

// ADMIN - GARANTÍAS
router.post('/admin/garantias', verifyToken, ctrl.create);                        // POST   /api/admin/garantias
router.put('/admin/garantias/:garantia_id', verifyToken, ctrl.update);            // PUT    /api/admin/garantias/:id
router.put('/admin/garantias/:garantia_id/estado', verifyToken, ctrl.cambiarEstado); // PUT  /api/admin/garantias/:id/estado
router.delete('/admin/garantias/:garantia_id', verifyToken, ctrl.remove);         // DELETE /api/admin/garantias/:id

module.exports = router;

