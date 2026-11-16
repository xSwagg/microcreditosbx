const pool = require('../config/db');

const BASE_COLUMNS = `
  cm.id_comision, cm.id_pago, cm.concepto, cm.tipo, cm.valor,
  cm.monto_cobrado, cm.fecha_registro,
  p.monto_pago, p.fecha_pago, m.nombre_metodo`;

const FROM = `
  FROM comision cm
  JOIN pago p ON cm.id_pago = p.id_pago
  LEFT JOIN metodo_pago m ON p.id_metodo = m.id_metodo`;

const calcularMontoCobrado = (tipo, valor, base) => {
  const v = Number(valor);
  if (Number(tipo) === 2) return Math.round(Number(base) * v) / 100;
  return v;
};

const getAll = async ({ id_pago } = {}) => {
  const where = id_pago !== undefined ? ' WHERE cm.id_pago = ?' : '';
  const [rows] = await pool.query(
    `SELECT ${BASE_COLUMNS} ${FROM}${where} ORDER BY cm.fecha_registro DESC`,
    id_pago !== undefined ? [id_pago] : []
  );
  return rows;
};

const getById = async (comision_id) => {
  const [rows] = await pool.query(`${BASE_COLUMNS} ${FROM} WHERE cm.id_comision = ?`, [comision_id]);
  return rows[0];
};

const getByPago = async (pago_id) => {
  const [rows] = await pool.query(
    `${BASE_COLUMNS} ${FROM} WHERE cm.id_pago = ? ORDER BY cm.fecha_registro`,
    [pago_id]
  );
  return rows;
};

const findById = async (comision_id) => {
  const [rows] = await pool.query(
    'SELECT id_comision, id_pago, concepto, tipo, valor FROM comision WHERE id_comision = ?',
    [comision_id]
  );
  return rows[0];
};

const findPago = async (pago_id) => {
  const [rows] = await pool.query(
    'SELECT id_pago, monto_pago FROM pago WHERE id_pago = ?',
    [pago_id]
  );
  return rows[0];
};

const create = async ({ id_pago, concepto, tipo, valor }) => {
  const pago = await findPago(id_pago);
  const monto_cobrado = calcularMontoCobrado(tipo, valor, pago ? pago.monto_pago : 0);
  const [result] = await pool.query(
    `INSERT INTO comision (id_pago, concepto, tipo, valor, monto_cobrado)
     VALUES (?, ?, ?, ?, ?)`,
    [id_pago, concepto, tipo, valor, monto_cobrado]
  );
  return result.insertId;
};

const update = async (comision_id, { concepto, tipo, valor }) => {
  const actual = await findById(comision_id);
  if (!actual) return 0;

  const pago = await findPago(actual.id_pago);
  const tipo_final = tipo !== undefined ? tipo : actual.tipo;
  const valor_final = valor !== undefined ? valor : actual.valor;

  const fields = [];
  const values = [];
  if (concepto !== undefined) { fields.push('concepto = ?'); values.push(concepto); }
  if (tipo !== undefined) { fields.push('tipo = ?'); values.push(tipo); }
  if (valor !== undefined) { fields.push('valor = ?'); values.push(valor); }
  fields.push('monto_cobrado = ?');
  values.push(calcularMontoCobrado(tipo_final, valor_final, pago ? pago.monto_pago : 0));
  values.push(comision_id);

  const [result] = await pool.query(
    `UPDATE comision SET ${fields.join(', ')} WHERE id_comision = ?`,
    values
  );
  return result.affectedRows;
};

const remove = async (comision_id) => {
  const [result] = await pool.query('DELETE FROM comision WHERE id_comision = ?', [comision_id]);
  return result.affectedRows;
};

const totalesPorPago = async (pago_id) => {
  const [rows] = await pool.query(
    'SELECT COALESCE(SUM(monto_cobrado), 0) AS total FROM comision WHERE id_pago = ?',
    [pago_id]
  );
  return rows[0].total;
};

module.exports = { getAll, getById, getByPago, findById, findPago, create, update, remove, totalesPorPago };
