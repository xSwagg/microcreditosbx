const pool = require('../config/db');

const COLS = `
  id_cuota, id_credito, numero_cuota, monto_cuota, monto_pagado,
  fecha_vencimiento, fecha_pago, estado`;

// Fórmula de amortización mensual: cuota = monto * i / (1 - (1 + i)^-n)
const calcularMontoCuota = (monto, tasa_interes, plazo) => {
  const n = Number(plazo);
  const i = Number(tasa_interes) / 100;
  if (n <= 0) return 0;
  if (i <= 0) return Number(monto) / n;
  return (Number(monto) * i) / (1 - Math.pow(1 + i, -n));
};

const getAll = async ({ id_credito, estado } = {}) => {
  const cond = [];
  const values = [];
  if (id_credito !== undefined) { cond.push('q.id_credito = ?'); values.push(id_credito); }
  if (estado && estado !== 'todas') { cond.push('q.estado = ?'); values.push(estado); }
  const where = cond.length ? ` WHERE ${cond.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT ${COLS}, u.nombre, u.correo
     FROM cuota q
     JOIN credito c ON q.id_credito = c.id_credito
     JOIN solicitud s ON c.id_solicitud = s.id_solicitud
     JOIN usuario u ON s.id_usuario = u.id_usuario${where}
     ORDER BY q.id_credito, q.numero_cuota`,
    values
  );
  return rows;
};

const getById = async (cuota_id) => {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM cuota WHERE id_cuota = ?`,
    [cuota_id]
  );
  return rows[0];
};

const getByCredito = async (credito_id) => {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM cuota WHERE id_credito = ? ORDER BY numero_cuota`,
    [credito_id]
  );
  return rows;
};

const findByCredito = async (credito_id) => {
  const [rows] = await pool.query(
    'SELECT id_credito FROM credito WHERE id_credito = ?',
    [credito_id]
  );
  return rows[0];
};

const findById = async (cuota_id) => {
  const [rows] = await pool.query(
    'SELECT id_cuota FROM cuota WHERE id_cuota = ?',
    [cuota_id]
  );
  return rows[0];
};

const generarPlan = async ({ id_credito, monto, tasa_interes, plazo, fecha_inicio = new Date() }) => {
  const monto_cuota = calcularMontoCuota(monto, tasa_interes, plazo);
  const n = Number(plazo);

  const values = [];
  const placeholders = [];
  for (let i = 1; i <= n; i++) {
    const vencimiento = new Date(fecha_inicio);
    vencimiento.setMonth(vencimiento.getMonth() + i);
    placeholders.push('(?, ?, ?, ?, ?, ?)');
    values.push(id_credito, i, monto_cuota.toFixed(2), vencimiento.toISOString().slice(0, 10));
  }

  await pool.query(
    `INSERT INTO cuota (id_credito, numero_cuota, monto_cuota, fecha_vencimiento)
     VALUES ${placeholders.join(', ')}`,
    values
  );

  return getByCredito(id_credito);
};

const registrarPago = async (cuota_id, { monto_pagado, fecha_pago = null }) => {
  const [result] = await pool.query(
    `UPDATE cuota
     SET monto_pagado = ?,
         fecha_pago = COALESCE(?, CURRENT_TIMESTAMP),
         estado = CASE WHEN ? >= monto_cuota THEN 'pagada' ELSE 'pendiente' END
     WHERE id_cuota = ?`,
    [monto_pagado, fecha_pago, monto_pagado, cuota_id]
  );
  return result.affectedRows;
};

const marcarVencidas = async () => {
  const [result] = await pool.query(
    `UPDATE cuota SET estado = 'vencida'
     WHERE estado = 'pendiente' AND fecha_vencimiento < CURRENT_DATE`
  );
  return result.affectedRows;
};

const getResumen = async (credito_id) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total_cuotas,
            SUM(CASE WHEN estado = 'pagada' THEN 1 ELSE 0 END) AS cuotas_pagadas,
            SUM(CASE WHEN estado = 'vencida' THEN 1 ELSE 0 END) AS cuotas_vencidas,
            COALESCE(SUM(monto_cuota), 0) AS monto_total,
            COALESCE(SUM(monto_pagado), 0) AS monto_pagado,
            COALESCE(SUM(monto_cuota - monto_pagado), 0) AS saldo
     FROM cuota WHERE id_credito = ?`,
    [credito_id]
  );
  return rows[0];
};

const remove = async (cuota_id) => {
  const [result] = await pool.query('DELETE FROM cuota WHERE id_cuota = ?', [cuota_id]);
  return result.affectedRows;
};

module.exports = {
  getAll, getById, getByCredito, findByCredito, findById,
  generarPlan, registrarPago, marcarVencidas, getResumen, remove,
};
