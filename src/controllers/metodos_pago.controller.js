const MetodoPago = require('../models/metodos_pago.model');

const getAll = async (req, res) => {
  try {
    const rows = await MetodoPago.getAll();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { metodo_id } = req.params;
    const metodo = await MetodoPago.getById(metodo_id);
    if (!metodo) {
      return res.status(404).json({ ok: false, msg: 'Método de pago no encontrado' });
    }
    res.json({ ok: true, data: metodo });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre_metodo } = req.body || {};
    if (!nombre_metodo) {
      return res.status(400).json({ ok: false, msg: 'nombre_metodo es requerido' });
    }

    const id = await MetodoPago.create({ nombre_metodo });
    res.status(201).json({ ok: true, msg: 'Método de pago creado exitosamente', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { metodo_id } = req.params;
    const { nombre_metodo } = req.body || {};

    if (!nombre_metodo) {
      return res.status(400).json({ ok: false, msg: 'nombre_metodo es requerido' });
    }

    const affected = await MetodoPago.update(metodo_id, { nombre_metodo });
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Método de pago no encontrado' });
    }
    res.json({ ok: true, msg: 'Método de pago actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { metodo_id } = req.params;
    const affected = await MetodoPago.remove(metodo_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Método de pago no encontrado' });
    }
    res.json({ ok: true, msg: 'Método de pago eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };