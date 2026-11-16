const pool = require('../config/db');

const BASE_COLUMNS = `
  e.id_empleado, e.id_oficina, e.nombre, e.cargo, e.correo, e.telefono,
  e.fecha_ingreso, e.activo,
  o.nombre AS oficina`;

const FROM = `
  FROM empleado e
  LEFT JOIN oficina o ON e.id_oficina = o.id_oficina`;

const getAll = async ({ id_oficina, activo } = {}) => {
  const cond = [];
  const values = [];
  if (id_oficina !== undefined) { cond.push('e.id_oficina = ?'); values.push(id_oficina); }
  if (activo !== undefined) { cond.push('e.activo = ?'); values.push(activo); }
  const where = cond.length ? ` WHERE ${cond.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT ${BASE_COLUMNS} ${FROM}${where} ORDER BY e.nombre`,
    values
  );
  return rows;
};

const getById = async (empleado_id) => {
  const [rows] = await pool.query(
    `SELECT ${BASE_COLUMNS} ${FROM} WHERE e.id_empleado = ?`,
    [empleado_id]
  );
  return rows[0];
};

const findByCorreo = async (correo, id_excluido = null) => {
  const [rows] = await pool.query(
    `SELECT id_empleado FROM empleado
     WHERE correo = ? AND (? IS NULL OR id_empleado != ?)`,
    [correo, id_excluido, id_excluido]
  );
  return rows[0];
};

const create = async ({ id_oficina, nombre, cargo, correo, telefono = null, fecha_ingreso }) => {
  const [result] = await pool.query(
    `INSERT INTO empleado (id_oficina, nombre, cargo, correo, telefono, fecha_ingreso)
     VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE))`,
    [id_oficina ?? null, nombre, cargo, correo, telefono, fecha_ingreso ?? null]
  );
  return result.insertId;
};

const update = async (empleado_id, { id_oficina, nombre, cargo, correo, telefono, fecha_ingreso, activo }) => {
  const fields = [];
  const values = [];
  if (id_oficina !== undefined) { fields.push('id_oficina = ?'); values.push(id_oficina); }
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (cargo !== undefined) { fields.push('cargo = ?'); values.push(cargo); }
  if (correo !== undefined) { fields.push('correo = ?'); values.push(correo); }
  if (telefono !== undefined) { fields.push('telefono = ?'); values.push(telefono); }
  if (fecha_ingreso !== undefined) { fields.push('fecha_ingreso = ?'); values.push(fecha_ingreso); }
  if (activo !== undefined) { fields.push('activo = ?'); values.push(activo); }
  if (fields.length === 0) return 0;
  values.push(empleado_id);
  const [result] = await pool.query(
    `UPDATE empleado SET ${fields.join(', ')} WHERE id_empleado = ?`,
    values
  );
  return result.affectedRows;
};

const remove = async (empleado_id) => {
  const [result] = await pool.query('DELETE FROM empleado WHERE id_empleado = ?', [empleado_id]);
  return result.affectedRows;
};

const countEvaluaciones = async (empleado_id) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM evaluacion WHERE id_empleado = ?',
    [empleado_id]
  );
  return rows[0].total;
};

module.exports = { getAll, getById, findByCorreo, create, update, remove, countEvaluaciones };
