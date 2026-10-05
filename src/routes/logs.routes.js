const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/logs.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/logs', ctrl.getAll);                       // GET    /api/logs
router.get('/logs/solicitud/:solicitud_id', ctrl.getBySolicitud); // GET /api/logs/solicitud/:id
router.get('/logs/:log_id', ctrl.getById);              // GET    /api/logs/:id
router.post('/admin/logs', verifyToken, ctrl.create);                // POST   /api/admin/logs

module.exports = router;
