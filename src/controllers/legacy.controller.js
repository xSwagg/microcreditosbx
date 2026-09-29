const Legacy = require('../models/legacy.model');
const ctrlUsuario = require('../controllers/usuarios.controller');
const ctrlSolicitud = require('../controllers/solicitudes.controller');
const ctrlPago = require('../controllers/pagos.controller');

const registrar = async (req, res) => {
  return ctrlUsuario.registro(req, res);
};

const solicitar = async (req, res) => {
  return ctrlSolicitud.crear(req, res);
};

const pagar = async (req, res) => {
  return ctrlPago.registrar(req, res);
};

const verSolicitudes = async (req, res) => {
  try {
    const { correo } = req.params;

    const usuario = await Legacy.findUsuarioByCorreo(correo);
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    const solicitudes = await Legacy.getSolicitudesPorCorreo(correo);

    res.json({ ok: true, solicitudes });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const verCredito = async (req, res) => {
  try {
    const { correo } = req.params;

    const credito = await Legacy.getCreditoActivoPorCorreo(correo);
    if (!credito) {
      return res.json({ ok: true, mensaje: 'No tienes créditos activos' });
    }

    res.json(credito);
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { registrar, solicitar, pagar, verSolicitudes, verCredito };
