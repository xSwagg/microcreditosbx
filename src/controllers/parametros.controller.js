const Parametro = require('../models/parametros.model');

const getAll = async (req, res) => {
  try {
    const rows = await Parametro.getAll();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { parametro_id } = req.params;
    const parametro = await Parametro.getById(parametro_id);
    if (!parametro) {
      return res.status(404).json({ ok: false, msg: 'Parámetro no encontrado' });
    }
    res.json({ ok: true, data: parametro });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getByClave = async (req, res) => {
  try {
    const { clave } = req.params;
    const parametro = await Parametro.findByClave(clave);
    if (!parametro) {
      return res.status(404).json({ ok: false, msg: 'Parámetro no encontrado' });
    }
    res.json({ ok: true, data: parametro });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { clave, valor, descripcion = null } = req.body || {};

    if (!clave || valor === undefined) {
      return res.status(400).json({ ok: false, msg: 'clave y valor son requeridos' });
    }

    const existente = await Parametro.findByClave(clave);
    if (existente) {
      return res.status(400).json({ ok: false, msg: 'Ya existe un parámetro con esa clave' });
    }

    const id = await Parametro.create({ clave, valor, descripcion });
    res.status(201).json({ ok: true, msg: 'Parámetro creado exitosamente', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { parametro_id } = req.params;
    const { clave, valor, descripcion } = req.body || {};

    if (clave !== undefined) {
      const duplicado = await Parametro.findByClaveOtro(clave, parametro_id);
      if (duplicado) {
        return res.status(400).json({ ok: false, msg: 'Ya existe un parámetro con esa clave' });
      }
    }

    const affected = await Parametro.update(parametro_id, { clave, valor, descripcion });
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Parámetro no encontrado' });
    }

    res.json({ ok: true, msg: 'Parámetro actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const upsert = async (req, res) => {
  try {
    const { clave, valor, descripcion = null } = req.body || {};

    if (!clave || valor === undefined) {
      return res.status(400).json({ ok: false, msg: 'clave y valor son requeridos' });
    }

    const parametro = await Parametro.upsert({ clave, valor, descripcion });
    res.json({ ok: true, msg: 'Parámetro guardado exitosamente', data: parametro });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { parametro_id } = req.params;
    const affected = await Parametro.remove(parametro_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Parámetro no encontrado' });
    }
    res.json({ ok: true, msg: 'Parámetro eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, getByClave, create, update, upsert, remove };
