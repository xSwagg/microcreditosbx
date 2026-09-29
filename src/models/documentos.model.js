const pool = require('../config/db');

const COLS = `
  id_documento, id_usuario, tipo_documento, nombre_archivo, ruta,
  estado, observaciones, fecha_carga`;

const getAll = async ({ id_usuario, estado } = {}) => {
  const cond = [];
  const values = [];
  if (id_usuario !== undefined) { cond.push('d.id_usuario = ?'); values.push(id_usuario); }
  if (estado && estado !== 'todos') { cond.push('d.estado = ?'); values.push(estado); }
  const where = cond.length ? ` WHERE ${cond.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT ${COLS}, u.nombre, u.apellido, u.correo
     FROM documento d
     JOIN usuario u ON d.id_usuario = u.id_usuario${where}
     ORDER BY d.fecha_carga DESC`,
    values
  );
  return rows;
};

const getById = async (documento_id) => {
  const [rows] = await pool.query(
    `SELECT ${COLS}, u.nombre, u.apellido, u.correo
     FROM documento d
     JOIN usuario u ON d.id_usuario = u.id_usuario
     WHERE d.id_documento = ?`,
    [documento_id]
  );
  return rows[0];
};

const getByUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM documento WHERE id_usuario = ? ORDER BY fecha_carga DESC`,
    [usuario_id]
  );
  return rows;
};

const findById = async (documento_id) => {
  const [rows] = await pool.query(
    'SELECT id_documento FROM documento WHERE id_documento = ?',
    [documento_id]
  );
  return rows[0];
};

const findDuplicado = async ({ id_usuario, tipo_documento, nombre_archivo }) => {
  const [rows] = await pool.query(
    `SELECT id_documento FROM documento
     WHERE id_usuario = ? AND tipo_documento = ? AND nombre_archivo = ?`,
    [id_usuario, tipo_documento, nombre_archivo]
  );
  return rows[0];
};

const create = async ({ id_usuario, tipo_documento, nombre_archivo, ruta = null, observaciones = null }) => {
  const [result] = await pool.query(
    `INSERT INTO documento (id_usuario, tipo_documento, nombre_archivo, ruta, observaciones)
     VALUES (?, ?, ?, ?, ?)`,
    [id_usuario, tipo_documento, nombre_archivo, ruta, observaciones]
  );
  return result.insertId;
};

const update = async (documento_id, { tipo_documento, nombre_archivo, ruta, estado, observaciones }) => {
  const fields = [];
  const values = [];
  if (tipo_documento !== undefined) { fields.push('tipo_documento = ?'); values.push(tipo_documento); }
  if (nombre_archivo !== undefined) { fields.push('nombre_archivo = ?'); values.push(nombre_archivo); }
  if (ruta !== undefined) { fields.push('ruta = ?'); values.push(ruta); }
  if (estado !== undefined) { fields.push('estado = ?'); values.push(estado); }
  if (observaciones !== undefined) { fields.push('observaciones = ?'); values.push(observaciones); }
  if (fields.length === 0) return 0;
  values.push(documento_id);
  const [result] = await pool.query(
    `UPDATE documento SET ${fields.join(', ')} WHERE id_documento = ?`,
    values
  );
  return result.affectedRows;
};

const remove = async (documento_id) => {
  const [result] = await pool.query('DELETE FROM documento WHERE id_documento = ?', [documento_id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, getByUsuario, findById, findDuplicado, create, update, remove };
