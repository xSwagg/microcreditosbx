const Cuota = require('../models/cuotas.model');
const Credito = require('../models/creditos.model');
const Log = require('../models/logs.model');

const getAll = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.credito !== undefined) filtros.id_credito = req.query.credito;
    if (req.query.estado !== undefined) filtros.estado = req.query.estado;

    const rows = await Cuota.getAll(filtros);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { cuota_id } = req.params;
    const cuota = await Cuota.getById(cuota_id);
    if (!cuota) {
      return res.status(404).json({ ok: false, msg: 'Cuota no encontrada' });
    }
    res.json({ ok: true, data: cuota });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getByCredito = async (req, res) => {
  try {
    const { credito_id } = req.params;

    const existe = await Credito.findById(credito_id);
    if (!existe) {
      return res.status(404).json({ ok: false, msg: 'Crédito no encontrado' });
    }

    const [cuotas, resumen] = await Promise.all([
      Cuota.getByCredito(credito_id),
      Cuota.getResumen(credito_id),
    ]);

    res.json({ ok: true, data: { cuotas, resumen } });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const generarPlan = async (req, res) => {
  try {
    const { credito_id } = req.params;

    const credito = await Credito.getById(credito_id);
    if (!credito) {
      return res.status(404).json({ ok: false, msg: 'Crédito no encontrado' });
    }

    const existentes = await Cuota.getByCredito(credito_id);
    if (existentes.length > 0) {
      return res.status(400).json({ ok: false, msg: 'El crédito ya tiene un plan de pagos generado' });
    }

    const cuotas = await Cuota.generarPlan({
      id_credito: credito_id,
      monto: credito.monto_aprobado,
      tasa_interes: credito.tasa_interes,
      plazo: credito.plazo,
    });

    await Log.create({
      solicitud_id: credito.id_solicitud,
      estado_anterior: 'aprobado',
      estado_nuevo: 'plan_generado',
      usuario_responsable: 'admin@micropse.com',
    });

    res.status(201).json({ ok: true, msg: 'Plan de pagos generado exitosamente', total_cuotas: cuotas.length });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const pagar = async (req, res) => {
  try {
    const { cuota_id } = req.params;
    const { monto_pagado, fecha_pago = null } = req.body || {};

    if (monto_pagado === undefined || Number(monto_pagado) <= 0) {
      return res.status(400).json({ ok: false, msg: 'monto_pagado es requerido y debe ser mayor a cero' });
    }

    const cuota = await Cuota.getById(cuota_id);
    if (!cuota) {
      return res.status(404).json({ ok: false, msg: 'Cuota no encontrada' });
    }
    if (cuota.estado === 'pagada') {
      return res.status(400).json({ ok: false, msg: 'La cuota ya fue pagada' });
    }
    if (Number(monto_pagado) > Number(cuota.monto_cuota)) {
      return res.status(400).json({ ok: false, msg: 'El monto supera el valor de la cuota' });
    }

    await Cuota.registrarPago(cuota_id, { monto_pagado, fecha_pago });
    const resumen = await Cuota.getResumen(cuota.id_credito);

    res.json({ ok: true, msg: 'Cuota pagada exitosamente', resumen });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const marcarVencidas = async (req, res) => {
  try {
    const affected = await Cuota.marcarVencidas();
    res.json({ ok: true, msg: 'Cuotas vencidas actualizadas', affected });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { cuota_id } = req.params;
    const affected = await Cuota.remove(cuota_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Cuota no encontrada' });
    }
    res.json({ ok: true, msg: 'Cuota eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, getByCredito, generarPlan, pagar, marcarVencidas, remove };
