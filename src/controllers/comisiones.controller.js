const Comision = require('../models/comisiones.model');

const TIPOS = ['fija', 'porcentaje'];

const getAll = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.pago !== undefined) filtros.id_pago = req.query.pago;

    const rows = await Comision.getAll(filtros);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { comision_id } = req.params;
    const comision = await Comision.getById(comision_id);
    if (!comision) {
      return res.status(404).json({ ok: false, msg: 'Comisión no encontrada' });
    }
    res.json({ ok: true, data: comision });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getByPago = async (req, res) => {
  try {
    const { pago_id } = req.params;

    const existe = await Comision.findPago(pago_id);
    if (!existe) {
      return res.status(404).json({ ok: false, msg: 'Pago no encontrado' });
    }

    const comisiones = await Comision.getByPago(pago_id);
    const total = await Comision.totalesPorPago(pago_id);

    res.json({ ok: true, data: { comisiones, total_comisiones: total } });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { id_pago, concepto, tipo, valor } = req.body || {};

    if (!id_pago || !concepto || !tipo || valor === undefined) {
      return res.status(400).json({ ok: false, msg: 'id_pago, concepto, tipo y valor son requeridos' });
    }
    if (!TIPOS.includes(tipo)) {
      return res.status(400).json({ ok: false, msg: 'tipo inválido' });
    }
    if (Number(valor) < 0) {
      return res.status(400).json({ ok: false, msg: 'El valor no puede ser negativo' });
    }
    if (tipo === 'porcentaje' && Number(valor) > 100) {
      return res.status(400).json({ ok: false, msg: 'El porcentaje no puede superar 100' });
    }

    const pago = await Comision.findPago(id_pago);
    if (!pago) {
      return res.status(404).json({ ok: false, msg: 'Pago no encontrado' });
    }

    const id = await Comision.create({ id_pago, concepto, tipo, valor });
    const comision = await Comision.getById(id);

    res.status(201).json({ ok: true, msg: 'Comisión registrada exitosamente', id, data: comision });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { comision_id } = req.params;
    const { concepto, tipo, valor } = req.body || {};

    if (tipo !== undefined && !TIPOS.includes(tipo)) {
      return res.status(400).json({ ok: false, msg: 'tipo inválido' });
    }
    if (valor !== undefined && Number(valor) < 0) {
      return res.status(400).json({ ok: false, msg: 'El valor no puede ser negativo' });
    }

    const affected = await Comision.update(comision_id, { concepto, tipo, valor });
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Comisión no encontrada' });
    }

    res.json({ ok: true, msg: 'Comisión actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { comision_id } = req.params;
    const affected = await Comision.remove(comision_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Comisión no encontrada' });
    }
    res.json({ ok: true, msg: 'Comisión eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, getByPago, create, update, remove };
