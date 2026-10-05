const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/empleados.controller');
const verifyToken = require('../middleware/auth.middleware');

// EMPLEADOS (público)
router.get('/empleados', ctrl.getAll);                            // GET    /api/empleados?oficina=&activo=
router.get('/empleados/:empleado_id', ctrl.getById);              // GET    /api/empleados/:id

// ADMIN - EMPLEADOS
router.post('/admin/empleados', verifyToken, ctrl.create);                      // POST   /api/admin/empleados
router.put('/admin/empleados/:empleado_id', verifyToken, ctrl.update);           // PUT    /api/admin/empleados/:id
router.put('/admin/empleados/:empleado_id/activo', verifyToken, ctrl.activar);  // PUT    /api/admin/empleados/:id/activo
router.delete('/admin/empleados/:empleado_id', verifyToken, ctrl.remove);        // DELETE /api/admin/empleados/:id

module.exports = router;

