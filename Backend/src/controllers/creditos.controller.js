const Credito = require('../models/creditos.model');
const Pago = require('../models/pagos.model');

const getAll = async (req, res) => {
  try {
    const rows = await Credito.getAll();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { credito_id } = req.params;

    const credito = await Credito.getById(credito_id);
    if (!credito) {
      return res.status(404).json({ ok: false, msg: 'Crédito no encontrado' });
    }

    credito.pagos = await Pago.getByCredito(credito_id);
    res.json({ ok: true, data: credito });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const activo = Number(req.query.activo) === 1 ? 1 : undefined;
    const rows = await Credito.getByUsuario(usuario_id, activo);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { id_solicitud, monto_aprobado, tasa_interes = 2.50, plazo = 12, cuotas_totales = null } = req.body || {};

    if (!id_solicitud || monto_aprobado === undefined) {
      return res.status(400).json({ ok: false, msg: 'id_solicitud y monto_aprobado son requeridos' });
    }

    const solicitud = await Credito.findEstadoSolicitud(id_solicitud);
    if (!solicitud) {
      return res.status(404).json({ ok: false, msg: 'Solicitud no encontrada' });
    }

    const id_credito = await Credito.create({
      id_solicitud,
      monto_aprobado,
      tasa_interes,
      plazo,
      cuotas_totales: cuotas_totales || plazo,
    });

    await Credito.setSolicitudAprobada(id_solicitud);

    res.status(201).json({ ok: true, msg: 'Crédito creado exitosamente', id: id_credito });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { credito_id } = req.params;
    const body = req.body || {};

    const existe = await Credito.findById(credito_id);
    if (!existe) {
      return res.status(404).json({ ok: false, msg: 'Crédito no encontrado' });
    }

    await Credito.update(credito_id, body);
    res.json({ ok: true, msg: 'Crédito actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { credito_id } = req.params;
    const affected = await Credito.remove(credito_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Crédito no encontrado' });
    }
    res.json({ ok: true, msg: 'Crédito eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, getByUsuario, create, update, remove };