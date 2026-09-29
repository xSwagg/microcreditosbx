const Oficina = require('../models/oficinas.model');

const getAll = async (req, res) => {
  try {
    const activo = req.query.activo === undefined
      ? undefined
      : (Number(req.query.activo) === 1 ? 1 : 0);
    const rows = await Oficina.getAll(activo);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { oficina_id } = req.params;
    const oficina = await Oficina.getById(oficina_id);
    if (!oficina) {
      return res.status(404).json({ ok: false, msg: 'Oficina no encontrada' });
    }
    oficina.empleados = await Oficina.countEmpleados(oficina_id);
    res.json({ ok: true, data: oficina });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, ciudad, direccion = null, telefono = null } = req.body || {};

    if (!nombre || !ciudad) {
      return res.status(400).json({ ok: false, msg: 'nombre y ciudad son requeridos' });
    }

    const duplicado = await Oficina.findByNombre(nombre);
    if (duplicado) {
      return res.status(400).json({ ok: false, msg: 'Ya existe una oficina con ese nombre' });
    }

    const id = await Oficina.create({ nombre, ciudad, direccion, telefono });
    res.status(201).json({ ok: true, msg: 'Oficina creada exitosamente', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { oficina_id } = req.params;
    const { nombre, ciudad, direccion, telefono } = req.body || {};

    const existe = await Oficina.getById(oficina_id);
    if (!existe) {
      return res.status(404).json({ ok: false, msg: 'Oficina no encontrada' });
    }

    if (nombre !== undefined) {
      const duplicado = await Oficina.findByNombre(nombre, Number(oficina_id));
      if (duplicado) {
        return res.status(400).json({ ok: false, msg: 'Ya existe una oficina con ese nombre' });
      }
    }

    await Oficina.update(oficina_id, { nombre, ciudad, direccion, telefono });
    res.json({ ok: true, msg: 'Oficina actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const activar = async (req, res) => {
  try {
    const { oficina_id } = req.params;
    const { activo = 1 } = req.body || {};

    const affected = await Oficina.update(oficina_id, { activo: activo ? 1 : 0 });
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Oficina no encontrada' });
    }

    res.json({ ok: true, msg: activo ? 'Oficina activada' : 'Oficina desactivada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { oficina_id } = req.params;
    const affected = await Oficina.remove(oficina_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Oficina no encontrada' });
    }
    res.json({ ok: true, msg: 'Oficina eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, create, update, activar, remove };
