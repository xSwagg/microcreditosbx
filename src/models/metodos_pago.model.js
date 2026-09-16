const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT id_metodo, nombre_metodo FROM metodo_pago ORDER BY nombre_metodo'
  );
  return rows;
};

const getById = async (metodo_id) => {
  const [rows] = await pool.query(
    'SELECT id_metodo, nombre_metodo FROM metodo_pago WHERE id_metodo = ?',
    [metodo_id]
  );
  return rows[0];
};

const create = async ({ nombre_metodo }) => {
  const [result] = await pool.query(
    'INSERT INTO metodo_pago (nombre_metodo) VALUES (?)',
    [nombre_metodo]
  );
  return result.insertId;
};

const update = async (metodo_id, { nombre_metodo }) => {
  const [result] = await pool.query(
    'UPDATE metodo_pago SET nombre_metodo = ? WHERE id_metodo = ?',
    [nombre_metodo, metodo_id]
  );
  return result.affectedRows;
};

const remove = async (metodo_id) => {
  const [result] = await pool.query('DELETE FROM metodo_pago WHERE id_metodo = ?', [metodo_id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, create, update, remove };