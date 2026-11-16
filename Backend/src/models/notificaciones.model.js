const pool = require('../config/db');

const getByUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT id_notificacion, tipo, mensaje, leida, fecha_envio
     FROM notificacion WHERE id_usuario = ? ORDER BY fecha_envio DESC`,
    [usuario_id]
  );
  return rows;
};

const getById = async (notificacion_id) => {
  const [rows] = await pool.query(
    'SELECT id_notificacion, tipo, mensaje, leida, fecha_envio FROM notificacion WHERE id_notificacion = ?',
    [notificacion_id]
  );
  return rows[0];
};

const create = async ({ id_usuario, tipo, mensaje }) => {
  const [result] = await pool.query(
    'INSERT INTO notificacion (id_usuario, tipo, mensaje) VALUES (?, ?, ?)',
    [id_usuario, tipo, mensaje]
  );
  return result.insertId;
};

const setLeida = async (notificacion_id, leida) => {
  const [result] = await pool.query(
    'UPDATE notificacion SET leida = ? WHERE id_notificacion = ?',
    [leida, notificacion_id]
  );
  return result.affectedRows;
};

const remove = async (notificacion_id) => {
  const [result] = await pool.query('DELETE FROM notificacion WHERE id_notificacion = ?', [notificacion_id]);
  return result.affectedRows;
};

module.exports = { getByUsuario, getById, create, setLeida, remove };