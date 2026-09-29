const TipoCredito = require('../models/tipos_credito.model');

const getAll = async (req, res) => {
  try {
    const activo = req.query.activo === undefined
      ? undefined
      : (Number(req.query.activo) === 1 ? 1 : 0);
    const rows = await TipoCredito.getAll(activo);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { tipo_id } = req.params;
    const tipo = await TipoCredito.getById(tipo_id);
    if (!tipo) {
      return res.status(404).json({ ok: false, msg: 'Tipo de crédito no encontrado' });
    }
    res.json({ ok: true, data: tipo });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const simular = async (req, res) => {
  try {
    const { tipo_id } = req.params;
    const { monto, plazo } = req.body || {};

    if (monto === undefined || plazo === undefined) {
      return res.status(400).json({ ok: false, msg: 'monto y plazo son requeridos' });
    }

    const validacion = await TipoCredito.validarMonto(tipo_id, monto);
    if (!validacion.ok) {
      return res.status(400).json({ ok: false, msg: validacion.msg });
    }

    const tipo = validacion.data;
    const i = Number(tipo.tasa_interes) / 100;
    const n = Number(plazo);
    const cuota = i <= 0 ? Number(monto) / n : (Number(monto) * i) / (1 - Math.pow(1 + i, -n));

    res.json({
      ok: true,
      data: {
        id_tipo: tipo_id,
        monto: Number(monto),
        plazo,
        tasa_interes: tipo.tasa_interes,
        cuota_mensual: Number(cuota.toFixed(2)),
        total_pagar: Number((cuota * n).toFixed(2)),
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, descripcion = null, monto_minimo = 0, monto_maximo, tasa_interes = 2.50, plazo_maximo = 12 } = req.body || {};

    if (!nombre || monto_maximo === undefined) {
      return res.status(400).json({ ok: false, msg: 'nombre y monto_maximo son requeridos' });
    }
    if (Number(monto_maximo) <= Number(monto_minimo)) {
      return res.status(400).json({ ok: false, msg: 'monto_maximo debe ser mayor a monto_minimo' });
    }
    if (Number(plazo_maximo) <= 0) {
      return res.status(400).json({ ok: false, msg: 'plazo_maximo debe ser mayor a cero' });
    }

    const duplicado = await TipoCredito.findByNombre(nombre);
    if (duplicado) {
      return res.status(400).json({ ok: false, msg: 'Ya existe un tipo de crédito con ese nombre' });
    }

    const id = await TipoCredito.create({
      nombre, descripcion, monto_minimo, monto_maximo, tasa_interes, plazo_maximo,
    });
    res.status(201).json({ ok: true, msg: 'Tipo de crédito creado exitosamente', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { tipo_id } = req.params;
    const { nombre, descripcion, monto_minimo, monto_maximo, tasa_interes, plazo_maximo, activo } = req.body || {};

    const existe = await TipoCredito.getById(tipo_id);
    if (!existe) {
      return res.status(404).json({ ok: false, msg: 'Tipo de crédito no encontrado' });
    }

    const min_final = monto_minimo !== undefined ? Number(monto_minimo) : Number(existe.monto_minimo);
    const max_final = monto_maximo !== undefined ? Number(monto_maximo) : Number(existe.monto_maximo);
    if (max_final <= min_final) {
      return res.status(400).json({ ok: false, msg: 'monto_maximo debe ser mayor a monto_minimo' });
    }

    if (nombre !== undefined) {
      const duplicado = await TipoCredito.findByNombre(nombre, Number(tipo_id));
      if (duplicado) {
        return res.status(400).json({ ok: false, msg: 'Ya existe un tipo de crédito con ese nombre' });
      }
    }

    await TipoCredito.update(tipo_id, {
      nombre, descripcion, monto_minimo, monto_maximo, tasa_interes, plazo_maximo, activo,
    });
    res.json({ ok: true, msg: 'Tipo de crédito actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { tipo_id } = req.params;
    const affected = await TipoCredito.remove(tipo_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Tipo de crédito no encontrado' });
    }
    res.json({ ok: true, msg: 'Tipo de crédito eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, simular, create, update, remove };
