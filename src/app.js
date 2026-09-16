const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
const usuariosRouter = require('./routes/usuarios.routes');
const bancosRouter = require('./routes/bancos.routes');
const solicitudesRouter = require('./routes/solicitudes.routes');
const creditosRouter = require('./routes/creditos.routes');
const pagosRouter = require('./routes/pagos.routes');
const metodosPagoRouter = require('./routes/metodos_pago.routes');
const notificacionesRouter = require('./routes/notificaciones.routes');
const pruebaVirtualRouter = require('./routes/prueba_virtual.routes');
const logsRouter = require('./routes/logs.routes');
const legacyRouter = require('./routes/legacy.routes');

app.use('/api', usuariosRouter);
app.use('/api', bancosRouter);
app.use('/api', solicitudesRouter);
app.use('/api', creditosRouter);
app.use('/api', pagosRouter);
app.use('/api', metodosPagoRouter);
app.use('/api', notificacionesRouter);
app.use('/api', pruebaVirtualRouter);
app.use('/api', logsRouter);
app.use('/', legacyRouter);

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'MicrocreditosBX API (Node/Express). Docs: /api/registro, /api/login, ...' });
});

module.exports = app;