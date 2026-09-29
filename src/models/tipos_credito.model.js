const pool = require('../config/db');

const COLS = `
  id_tipo, nombre, descripcion, monto_minimo, monto_maximo,
  tasa_interes, plazo_maximo, activo`;

const getAll = async (activo) => {
  const where = activo === undefined ? '' : ' WHERE activo = ?';
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM tipo_credito${where} ORDER BY nombre`,
    activo === undefined ? [] : [activo]
  );
  return rows;
};

const getById = async (tipo_id) => {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM tipo_credito WHERE id_tipo = ?`,
    [tipo_id]
  );
  return rows[0];
};

const findByNombre = async (nombre, id_excluido = null) => {
  const [rows] = await pool.query(
    `SELECT id_tipo FROM tipo_credito
     WHERE nombre = ? AND (? IS NULL OR id_tipo != ?)`,
    [nombre, id_excluido, id_excluido]
  );
  return rows[0];
};

const create = async ({ nombre, descripcion = null, monto_minimo = 0, monto_maximo, tasa_interes = 2.50, plazo_maximo = 12 }) => {
  const [result] = await pool.query(
    `INSERT INTO tipo_credito (nombre, descripcion, monto_minimo, monto_maximo, tasa_interes, plazo_maximo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, monto_minimo, monto_maximo, tasa_interes, plazo_maximo]
  );
  return result.insertId;
};

const update = async (tipo_id, { nombre, descripcion, monto_minimo, monto_maximo, tasa_interes, plazo_maximo, activo }) => {
  const fields = [];
  const values = [];
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
  if (monto_minimo !== undefined) { fields.push('monto_minimo = ?'); values.push(monto_minimo); }
  if (monto_maximo !== undefined) { fields.push('monto_maximo = ?'); values.push(monto_maximo); }
  if (tasa_interes !== undefined) { fields.push('tasa_interes = ?'); values.push(tasa_interes); }
  if (plazo_maximo !== undefined) { fields.push('plazo_maximo = ?'); values.push(plazo_maximo); }
  if (activo !== undefined) { fields.push('activo = ?'); values.push(activo); }
  if (fields.length === 0) return 0;
  values.push(tipo_id);
  const [result] = await pool.query(
    `UPDATE tipo_credito SET ${fields.join(', ')} WHERE id_tipo = ?`,
    values
  );
  return result.affectedRows;
};

const remove = async (tipo_id) => {
  const [result] = await pool.query('DELETE FROM tipo_credito WHERE id_tipo = ?', [tipo_id]);
  return result.affectedRows;
};

const validarMonto = async (tipo_id, monto) => {
  const [rows] = await pool.query(
    'SELECT monto_minimo, monto_maximo, tasa_interes, plazo_maximo FROM tipo_credito WHERE id_tipo = ? AND activo = 1',
    [tipo_id]
  );
  const tipo = rows[0];
  if (!tipo) return { ok: false, msg: 'Tipo de crédito no encontrado' };
  const valor = Number(monto);
  if (valor < Number(tipo.monto_minimo) || valor > Number(tipo.monto_maximo)) {
    return { ok: false, msg: `El monto debe estar entre ${tipo.monto_minimo} y ${tipo.monto_maximo}` };
  }
  return { ok: true, data: tipo };
};

module.exports = { getAll, getById, findByNombre, create, update, remove, validarMonto };
