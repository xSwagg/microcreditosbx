const pool = require('../config/db');

const BASE_COLUMNS = `
  g.id_garantia, g.id_credito, g.id_usuario, g.tipo, g.descripcion,
  g.valor_estimado, g.estado, g.fecha_registro,
  u.nombre, u.apellido, u.correo`;

const FROM = `
  FROM garantia g
  LEFT JOIN usuario u ON g.id_usuario = u.id_usuario`;

const getAll = async ({ id_credito, id_usuario, estado } = {}) => {
  const cond = [];
  const values = [];
  if (id_credito !== undefined) { cond.push('g.id_credito = ?'); values.push(id_credito); }
  if (id_usuario !== undefined) { cond.push('g.id_usuario = ?'); values.push(id_usuario); }
  if (estado && estado !== 'todas') { cond.push('g.estado = ?'); values.push(estado); }
  const where = cond.length ? ` WHERE ${cond.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT ${BASE_COLUMNS} ${FROM}${where} ORDER BY g.fecha_registro DESC`,
    values
  );
  return rows;
};

const getById = async (garantia_id) => {
  const [rows] = await pool.query(
    `SELECT ${BASE_COLUMNS} ${FROM} WHERE g.id_garantia = ?`,
    [garantia_id]
  );
  return rows[0];
};

const getByCredito = async (credito_id) => {
  const [rows] = await pool.query(
    `SELECT ${BASE_COLUMNS} ${FROM} WHERE g.id_credito = ? ORDER BY g.fecha_registro DESC`,
    [credito_id]
  );
  return rows;
};

const findById = async (garantia_id) => {
  const [rows] = await pool.query(
    'SELECT id_garantia, id_credito, id_usuario, tipo, valor_estimado, estado FROM garantia WHERE id_garantia = ?',
    [garantia_id]
  );
  return rows[0];
};

const findUsuario = async (usuario_id) => {
  const [rows] = await pool.query('SELECT id_usuario FROM usuario WHERE id_usuario = ?', [usuario_id]);
  return rows[0];
};

const create = async ({ id_credito = null, id_usuario, tipo, descripcion = null, valor_estimado = 0 }) => {
  const [result] = await pool.query(
    `INSERT INTO garantia (id_credito, id_usuario, tipo, descripcion, valor_estimado)
     VALUES (?, ?, ?, ?, ?)`,
    [id_credito, id_usuario, tipo, descripcion, valor_estimado]
  );
  return result.insertId;
};

const update = async (garantia_id, { tipo, descripcion, valor_estimado, estado }) => {
  const fields = [];
  const values = [];
  if (tipo !== undefined) { fields.push('tipo = ?'); values.push(tipo); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
  if (valor_estimado !== undefined) { fields.push('valor_estimado = ?'); values.push(valor_estimado); }
  if (estado !== undefined) { fields.push('estado = ?'); values.push(estado); }
  if (fields.length === 0) return 0;
  values.push(garantia_id);
  const [result] = await pool.query(
    `UPDATE garantia SET ${fields.join(', ')} WHERE id_garantia = ?`,
    values
  );
  return result.affectedRows;
};

const remove = async (garantia_id) => {
  const [result] = await pool.query('DELETE FROM garantia WHERE id_garantia = ?', [garantia_id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, getByCredito, findById, findUsuario, create, update, remove };
