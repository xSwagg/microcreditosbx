const Notificacion = require('../models/notificaciones.model');

const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const rows = await Notificacion.getByUsuario(usuario_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const setLeida = async (req, res) => {
  try {
    const { notificacion_id } = req.params;
    const { leida = 1 } = req.body || {};

    const affected = await Notificacion.setLeida(notificacion_id, leida);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Notificación no encontrada' });
    }

    res.json({ ok: true, msg: 'Notificación actualizada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { id_usuario, tipo, mensaje } = req.body || {};
    if (!id_usuario || !tipo || !mensaje) {
      return res.status(400).json({ ok: false, msg: 'id_usuario, tipo y mensaje son requeridos' });
    }

    const id = await Notificacion.create({ id_usuario, tipo, mensaje });
    res.status(201).json({ ok: true, msg: 'Notificación creada', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { notificacion_id } = req.params;
    const affected = await Notificacion.remove(notificacion_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Notificación no encontrada' });
    }
    res.json({ ok: true, msg: 'Notificación eliminada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getByUsuario, setLeida, create, remove };