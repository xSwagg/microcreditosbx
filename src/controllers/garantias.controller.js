const Garantia = require('../models/garantias.model');
const Notificacion = require('../models/notificaciones.model');

const ESTADOS = ['registrada', 'verificada', 'liberada'];

const getAll = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.credito !== undefined) filtros.id_credito = req.query.credito;
    if (req.query.usuario !== undefined) filtros.id_usuario = req.query.usuario;
    if (req.query.estado !== undefined) filtros.estado = req.query.estado;

    const rows = await Garantia.getAll(filtros);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { garantia_id } = req.params;
    const garantia = await Garantia.getById(garantia_id);
    if (!garantia) {
      return res.status(404).json({ ok: false, msg: 'Garantía no encontrada' });
    }
    res.json({ ok: true, data: garantia });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getByCredito = async (req, res) => {
  try {
    const { credito_id } = req.params;
    const rows = await Garantia.getByCredito(credito_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { id_usuario, id_credito = null, tipo, descripcion = null, valor_estimado = 0 } = req.body || {};

    if (!id_usuario || !tipo) {
      return res.status(400).json({ ok: false, msg: 'id_usuario y tipo son requeridos' });
    }
    if (Number(valor_estimado) < 0) {
      return res.status(400).json({ ok: false, msg: 'valor_estimado no puede ser negativo' });
    }

    const usuario = await Garantia.findUsuario(id_usuario);
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    const id = await Garantia.create({ id_usuario, id_credito, tipo, descripcion, valor_estimado });
    res.status(201).json({ ok: true, msg: 'Garantía registrada exitosamente', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { garantia_id } = req.params;
    const { tipo, descripcion, valor_estimado } = req.body || {};

    if (valor_estimado !== undefined && Number(valor_estimado) < 0) {
      return res.status(400).json({ ok: false, msg: 'valor_estimado no puede ser negativo' });
    }

    const affected = await Garantia.update(garantia_id, { tipo, descripcion, valor_estimado });
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Garantía no encontrada' });
    }

    res.json({ ok: true, msg: 'Garantía actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { garantia_id } = req.params;
    const { estado } = req.body || {};

    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ ok: false, msg: 'estado inválido' });
    }

    const garantia = await Garantia.findById(garantia_id);
    if (!garantia) {
      return res.status(404).json({ ok: false, msg: 'Garantía no encontrada' });
    }

    await Garantia.update(garantia_id, { estado });

    if (estado === 'liberada') {
      await Notificacion.create({
        id_usuario: garantia.id_usuario,
        tipo: 'garantia_liberada',
        mensaje: 'Tu garantía fue liberada tras la cancelación del crédito.',
      });
    }
    res.json({ ok: true, msg: 'Estado de la garantía actualizado', estado });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { garantia_id } = req.params;
    const affected = await Garantia.remove(garantia_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Garantía no encontrada' });
    }
    res.json({ ok: true, msg: 'Garantía eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, getByCredito, create, update, cambiarEstado, remove };
