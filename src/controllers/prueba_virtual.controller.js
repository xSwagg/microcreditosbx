const Prueba = require('../models/prueba_virtual.model');

const registrar = async (req, res) => {
  try {
    const { id_usuario, puntaje } = req.body || {};

    if (!id_usuario || puntaje === undefined) {
      return res.status(400).json({ ok: false, msg: 'id_usuario y puntaje son requeridos' });
    }

    const usuario = await Prueba.findUsuario(id_usuario);
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    const aprobada = Number(puntaje) >= 60;
    await Prueba.create({ id_usuario, puntaje: Number(puntaje), aprobada: aprobada ? 1 : 0 });
    await Prueba.setCompletada(id_usuario, aprobada);

    res.status(201).json({ ok: true, msg: 'Prueba registrada', aprobada });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const rows = await Prueba.getByUsuario(usuario_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { registrar, getByUsuario };