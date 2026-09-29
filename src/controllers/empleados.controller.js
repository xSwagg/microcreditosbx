const Empleado = require('../models/empleados.model');

const CARGOS = ['asesor', 'analista', 'coordinador', 'administrador'];

const getAll = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.oficina !== undefined) filtros.id_oficina = req.query.oficina;
    if (req.query.activo !== undefined) filtros.activo = Number(req.query.activo) === 1 ? 1 : 0;

    const rows = await Empleado.getAll(filtros);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { empleado_id } = req.params;
    const empleado = await Empleado.getById(empleado_id);
    if (!empleado) {
      return res.status(404).json({ ok: false, msg: 'Empleado no encontrado' });
    }
    empleado.evaluaciones = await Empleado.countEvaluaciones(empleado_id);
    res.json({ ok: true, data: empleado });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { id_oficina, nombre, cargo = 'asesor', correo, telefono = null, fecha_ingreso = null } = req.body || {};

    if (!nombre || !correo) {
      return res.status(400).json({ ok: false, msg: 'nombre y correo son requeridos' });
    }
    if (!CARGOS.includes(cargo)) {
      return res.status(400).json({ ok: false, msg: 'cargo inválido' });
    }

    const duplicado = await Empleado.findByCorreo(correo);
    if (duplicado) {
      return res.status(400).json({ ok: false, msg: 'El correo ya está registrado' });
    }

    const id = await Empleado.create({ id_oficina, nombre, cargo, correo, telefono, fecha_ingreso });
    res.status(201).json({ ok: true, msg: 'Empleado creado exitosamente', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { empleado_id } = req.params;
    const { id_oficina, nombre, cargo, correo, telefono, fecha_ingreso } = req.body || {};

    const existe = await Empleado.getById(empleado_id);
    if (!existe) {
      return res.status(404).json({ ok: false, msg: 'Empleado no encontrado' });
    }
    if (cargo !== undefined && !CARGOS.includes(cargo)) {
      return res.status(400).json({ ok: false, msg: 'cargo inválido' });
    }

    if (correo !== undefined) {
      const duplicado = await Empleado.findByCorreo(correo, Number(empleado_id));
      if (duplicado) {
        return res.status(400).json({ ok: false, msg: 'El correo ya está registrado' });
      }
    }

    await Empleado.update(empleado_id, { id_oficina, nombre, cargo, correo, telefono, fecha_ingreso });
    res.json({ ok: true, msg: 'Empleado actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const activar = async (req, res) => {
  try {
    const { empleado_id } = req.params;
    const { activo = 1 } = req.body || {};

    const affected = await Empleado.update(empleado_id, { activo: activo ? 1 : 0 });
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Empleado no encontrado' });
    }

    res.json({ ok: true, msg: activo ? 'Empleado activado' : 'Empleado desactivado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { empleado_id } = req.params;
    const affected = await Empleado.remove(empleado_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Empleado no encontrado' });
    }
    res.json({ ok: true, msg: 'Empleado eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, create, update, activar, remove };
