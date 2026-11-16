require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();

// Orígenes permitidos en producción. Se pueden ampliar con la variable de
// entorno CORS_ORIGINS (separados por coma), por ejemplo:
//   CORS_ORIGINS=https://microcreditosbx.vercel.app,https://midominio.com
const origenesProduccion = (process.env.CORS_ORIGINS || 'https://microcreditosbx.vercel.app')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

// En desarrollo el frontend puede abrirse en 5173, 5174, etc.
// Se permite cualquier puerto de localhost/127.0.0.1 y las peticiones sin
// origin (Postman, curl, Thunder Client).
const esOrigenLocal = (origin) =>
  !origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

// Previews y dominio de producción del proyecto en Vercel.
const esOrigenVercel = (origin) =>
  /^https:\/\/microcreditosbx(-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

const esOrigenPermitido = (origin) =>
  esOrigenLocal(origin) ||
  esOrigenVercel(origin) ||
  origenesProduccion.includes(origin);

// Middleware para parsear JSON
app.use(cors({
  origin: (origin, callback) => callback(null, esOrigenPermitido(origin)),
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Rutas
const authRouter = require('./routes/auth.routes');
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

// Autenticación (register y login son públicas, /me es privada)
app.use('/api/auth', authRouter);

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
    msg: 'MicrocreditosBX API (Node/Express). Docs: /api/auth/register, /api/auth/login, ...',
    entidades: [
      'auth', 'usuarios', 'bancos', 'solicitudes', 'creditos', 'pagos', 'metodos_pago',
      'notificaciones', 'logs', 'prueba_virtual', 'oficinas', 'empleados',
      'tipos_credito', 'documentos', 'cuotas', 'garantias', 'evaluaciones',
      'comisiones', 'parametros', 'legacy',
    ],
  });
});

module.exports = app;
