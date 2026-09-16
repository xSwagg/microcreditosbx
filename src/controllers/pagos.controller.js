const Pago = require('../models/pagos.model');
const Notificacion = require('../models/notificaciones.model');

const getAll = async (req, res) => {
  try {
    const rows = await Pago.getAll();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { pago_id } = req.params;
    const pago = await Pago.getById(pago_id);
    if (!pago) {
      return res.status(404).json({ ok: false, msg: 'Pago no encontrado' });
    }
    res.json({ ok: true, data: pago });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getByCredito = async (req, res) => {
  try {
    const { credito_id } = req.params;
    const rows = await Pago.getByCredito(credito_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const registrar = async (req, res) => {
  try {
    const { correo, monto, id_metodo = null } = req.body || {};

    if (!correo || monto === undefined) {
      return res.status(400).json({ ok: false, msg: 'correo y monto son requeridos' });
    }
    if (monto <= 0) {
      return res.status(400).json({ ok: false, msg: 'El monto debe ser mayor a cero' });
    }

    const credito = await Pago.findCreditoActivoByCorreo(correo);
    if (!credito) {
      return res.status(404).json({ ok: false, msg: 'No tienes créditos activos' });
    }

    const nuevo_saldo = Number(credito.saldo_pendiente) - Number(monto);

    await Pago.create({ id_credito: credito.id_credito, id_metodo, monto });
    await Pago.aplicarPagoCredito({ id_credito: credito.id_credito, nuevo_saldo });

    const saldo_final = Math.max(nuevo_saldo, 0);

    await Notificacion.create({
      id_usuario: credito.id_usuario,
      tipo: 'pago_recibido',
      mensaje: `Se ha recibido tu pago de $${Number(monto).toLocaleString('es-CO')}. Saldo pendiente: $${Math.round(saldo_final).toLocaleString('es-CO')}`,
    });

    res.json({ ok: true, msg: `Pago de ${monto} registrado`, saldo_restante: saldo_final });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { pago_id } = req.params;
    const affected = await Pago.remove(pago_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Pago no encontrado' });
    }
    res.json({ ok: true, msg: 'Pago eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, getByCredito, registrar, remove };