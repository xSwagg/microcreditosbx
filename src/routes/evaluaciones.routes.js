const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/evaluaciones.controller');

// EVALUACIONES (público)
router.get('/evaluaciones', ctrl.getAll);                              // GET    /api/evaluaciones?recomendacion=
router.get('/evaluaciones/solicitud/:solicitud_id', ctrl.getBySolicitud); // GET /api/evaluaciones/solicitud/:id
router.get('/evaluaciones/:evaluacion_id', ctrl.getById);              // GET    /api/evaluaciones/:id

// ADMIN - EVALUACIONES
router.post('/admin/evaluaciones', ctrl.create);                        // POST   /api/admin/evaluaciones
router.put('/admin/evaluaciones/:evaluacion_id', ctrl.update);          // PUT    /api/admin/evaluaciones/:id
router.delete('/admin/evaluaciones/:evaluacion_id', ctrl.remove);       // DELETE /api/admin/evaluaciones/:id

module.exports = router;
