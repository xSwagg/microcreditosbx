const Log = require('../models/logs.model');
const Solicitud = require('../models/solicitudes.model');

const getAll = async (req, res) => {
  try {
    const rows = await Log.getAll();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getBySolicitud = async (req, res) => {
  try {
    const { solicitud_id } = req.params;
    const rows = await Log.getBySolicitud(solicitud_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { log_id } = req.params;
    const log = await Log.getById(log_id);
    if (!log) {
      return res.status(404).json({ ok: false, msg: 'Log no encontrado' });
    }
    res.json({ ok: true, data: log });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { solicitud_id, estado_anterior, estado_nuevo, usuario_responsable = 'sistema' } = req.body || {};

    if (!solicitud_id || !estado_anterior || !estado_nuevo) {
      return res.status(400).json({ ok: false, msg: 'solicitud_id, estado_anterior y estado_nuevo son requeridos' });
    }

    const solicitud = await Solicitud.findEstado(solicitud_id);
    if (!solicitud) {
      return res.status(404).json({ ok: false, msg: 'Solicitud no encontrada' });
    }

    const id = await Log.create({ solicitud_id, estado_anterior, estado_nuevo, usuario_responsable });
    res.status(201).json({ ok: true, msg: 'Log creado', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getBySolicitud, getById, create };