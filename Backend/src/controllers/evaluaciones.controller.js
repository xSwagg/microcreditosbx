const Evaluacion = require('../models/evaluaciones.model');
const Notificacion = require('../models/notificaciones.model');

const RECOMENDACIONES = ['revision', 'aprobado', 'rechazado'];

const getAll = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.recomendacion !== undefined) filtros.recomendacion = req.query.recomendacion;

    const rows = await Evaluacion.getAll(filtros);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { evaluacion_id } = req.params;
    const evaluacion = await Evaluacion.getById(evaluacion_id);
    if (!evaluacion) {
      return res.status(404).json({ ok: false, msg: 'Evaluación no encontrada' });
    }
    res.json({ ok: true, data: evaluacion });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getBySolicitud = async (req, res) => {
  try {
    const { solicitud_id } = req.params;
    const rows = await Evaluacion.getBySolicitud(solicitud_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { id_solicitud, id_empleado = null, puntaje, capacidad_pago = null, recomendacion, observaciones = null } = req.body || {};

    if (!id_solicitud || puntaje === undefined || !recomendacion) {
      return res.status(400).json({ ok: false, msg: 'id_solicitud, puntaje y recomendacion son requeridos' });
    }
    if (!RECOMENDACIONES.includes(recomendacion)) {
      return res.status(400).json({ ok: false, msg: 'recomendación inválida' });
    }
    if (Number(puntaje) < 0 || Number(puntaje) > 100) {
      return res.status(400).json({ ok: false, msg: 'El puntaje debe estar entre 0 y 100' });
    }

    const solicitud = await Evaluacion.findSolicitud(id_solicitud);
    if (!solicitud) {
      return res.status(404).json({ ok: false, msg: 'Solicitud no encontrada' });
    }

    const existente = await Evaluacion.findBySolicitud(id_solicitud);
    if (existente) {
      return res.status(400).json({ ok: false, msg: 'La solicitud ya fue evaluada' });
    }

    if (id_empleado !== null) {
      const empleado = await Evaluacion.findEmpleado(id_empleado);
      if (!empleado) {
        return res.status(404).json({ ok: false, msg: 'Empleado no encontrado o inactivo' });
      }
    }

    const id = await Evaluacion.create({
      id_solicitud, id_empleado, puntaje: Number(puntaje), capacidad_pago, recomendacion, observaciones,
    });

    await Notificacion.create({
      id_usuario: solicitud.id_usuario,
      tipo: 'solicitud_evaluada',
      mensaje: `Tu solicitud #${id_solicitud} fue evaluada por el comité de crédito.`,
    });

    res.status(201).json({ ok: true, msg: 'Evaluación registrada exitosamente', id, recomendacion });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { evaluacion_id } = req.params;
    const { id_empleado, puntaje, capacidad_pago, recomendacion, observaciones } = req.body || {};

    if (recomendacion !== undefined && !RECOMENDACIONES.includes(recomendacion)) {
      return res.status(400).json({ ok: false, msg: 'recomendación inválida' });
    }
    if (puntaje !== undefined && (Number(puntaje) < 0 || Number(puntaje) > 100)) {
      return res.status(400).json({ ok: false, msg: 'El puntaje debe estar entre 0 y 100' });
    }

    const affected = await Evaluacion.update(evaluacion_id, {
      id_empleado, puntaje, capacidad_pago, recomendacion, observaciones,
    });
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Evaluación no encontrada' });
    }

    res.json({ ok: true, msg: 'Evaluación actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { evaluacion_id } = req.params;
    const affected = await Evaluacion.remove(evaluacion_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Evaluación no encontrada' });
    }
    res.json({ ok: true, msg: 'Evaluación eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, getBySolicitud, create, update, remove };
