const pool = require('../config/db');

const COLS = 'id_parametro, clave, valor, descripcion, fecha_actualizacion';

const getAll = async () => {
  const [rows] = await pool.query(`SELECT ${COLS} FROM parametro ORDER BY clave`);
  return rows;
};

const getById = async (parametro_id) => {
  const [rows] = await pool.query(`SELECT ${COLS} FROM parametro WHERE id_parametro = ?`, [parametro_id]);
  return rows[0];
};

const findByClave = async (clave) => {
  const [rows] = await pool.query(`SELECT ${COLS} FROM parametro WHERE clave = ?`, [clave]);
  return rows[0];
};

const findByClaveOtro = async (clave, id_excluido) => {
  const [rows] = await pool.query(
    'SELECT id_parametro FROM parametro WHERE clave = ? AND id_parametro != ?',
    [clave, id_excluido]
  );
  return rows[0];
};

const getValor = async (clave, por_defecto = null) => {
  const param = await findByClave(clave);
  return param ? param.valor : por_defecto;
};

const create = async ({ clave, valor, descripcion = null }) => {
  const [result] = await pool.query(
    'INSERT INTO parametro (clave, valor, descripcion) VALUES (?, ?, ?)',
    [clave, valor, descripcion]
  );
  return result.insertId;
};

const update = async (parametro_id, { clave, valor, descripcion }) => {
  const fields = [];
  const values = [];
  if (clave !== undefined) { fields.push('clave = ?'); values.push(clave); }
  if (valor !== undefined) { fields.push('valor = ?'); values.push(valor); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
  if (fields.length === 0) return 0;
  values.push(parametro_id);
  const [result] = await pool.query(
    `UPDATE parametro SET ${fields.join(', ')} WHERE id_parametro = ?`,
    values
  );
  return result.affectedRows;
};

const upsert = async ({ clave, valor, descripcion = null }) => {
  await pool.query(
    `INSERT INTO parametro (clave, valor, descripcion) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE valor = VALUES(valor), descripcion = COALESCE(VALUES(descripcion), descripcion)`,
    [clave, valor, descripcion]
  );
  return findByClave(clave);
};

const remove = async (parametro_id) => {
  const [result] = await pool.query('DELETE FROM parametro WHERE id_parametro = ?', [parametro_id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, findByClave, findByClaveOtro, getValor, create, update, upsert, remove };
