const pool = require('../config/db');

const COLS = 'id_oficina, nombre, ciudad, direccion, telefono, activo, fecha_creacion';

const getAll = async (activo) => {
  const where = activo === undefined ? '' : ' WHERE activo = ?';
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM oficina${where} ORDER BY nombre`,
    activo === undefined ? [] : [activo]
  );
  return rows;
};

const getById = async (oficina_id) => {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM oficina WHERE id_oficina = ?`,
    [oficina_id]
  );
  return rows[0];
};

const findByNombre = async (nombre, id_excluido = null) => {
  const [rows] = await pool.query(
    `SELECT id_oficina FROM oficina
     WHERE nombre = ? AND (? IS NULL OR id_oficina != ?)`,
    [nombre, id_excluido, id_excluido]
  );
  return rows[0];
};

const create = async ({ nombre, ciudad, direccion = null, telefono = null }) => {
  const [result] = await pool.query(
    'INSERT INTO oficina (nombre, ciudad, direccion, telefono) VALUES (?, ?, ?, ?)',
    [nombre, ciudad, direccion, telefono]
  );
  return result.insertId;
};

const update = async (oficina_id, { nombre, ciudad, direccion, telefono, activo }) => {
  const fields = [];
  const values = [];
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (ciudad !== undefined) { fields.push('ciudad = ?'); values.push(ciudad); }
  if (direccion !== undefined) { fields.push('direccion = ?'); values.push(direccion); }
  if (telefono !== undefined) { fields.push('telefono = ?'); values.push(telefono); }
  if (activo !== undefined) { fields.push('activo = ?'); values.push(activo); }
  if (fields.length === 0) return 0;
  values.push(oficina_id);
  const [result] = await pool.query(
    `UPDATE oficina SET ${fields.join(', ')} WHERE id_oficina = ?`,
    values
  );
  return result.affectedRows;
};

const remove = async (oficina_id) => {
  const [result] = await pool.query('DELETE FROM oficina WHERE id_oficina = ?', [oficina_id]);
  return result.affectedRows;
};

const countEmpleados = async (oficina_id) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM empleado WHERE id_oficina = ?',
    [oficina_id]
  );
  return rows[0].total;
};

module.exports = { getAll, getById, findByNombre, create, update, remove, countEmpleados };
