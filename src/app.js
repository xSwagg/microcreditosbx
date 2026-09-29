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
const oficinasRouter = require('./routes/oficinas.routes');
const empleadosRouter = require('./routes/empleados.routes');
const tiposCreditoRouter = require('./routes/tipos_credito.routes');
const documentosRouter = require('./routes/documentos.routes');
const cuotasRouter = require('./routes/cuotas.routes');
const garantiasRouter = require('./routes/garantias.routes');
const evaluacionesRouter = require('./routes/evaluaciones.routes');
const comisionesRouter = require('./routes/comisiones.routes');
const parametrosRouter = require('./routes/parametros.routes');
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
app.use('/api', oficinasRouter);
app.use('/api', empleadosRouter);
app.use('/api', tiposCreditoRouter);
app.use('/api', documentosRouter);
app.use('/api', cuotasRouter);
app.use('/api', garantiasRouter);
app.use('/api', evaluacionesRouter);
app.use('/api', comisionesRouter);
app.use('/api', parametrosRouter);
app.use('/', legacyRouter);

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'MicrocreditosBX API (Node/Express). Docs: /api/registro, /api/login, ...',
    entidades: [
      'usuarios', 'bancos', 'solicitudes', 'creditos', 'pagos', 'metodos_pago',
      'notificaciones', 'logs', 'prueba_virtual', 'oficinas', 'empleados',
      'tipos_credito', 'documentos', 'cuotas', 'garantias', 'evaluaciones',
      'comisiones', 'parametros', 'legacy',
    ],
  });
});

module.exports = app;
