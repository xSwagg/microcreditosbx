const pool = require('../config/db');

const BASE_COLUMNS = `
  s.id_solicitud, s.monto, s.fecha, s.estado, s.id_banco,
  u.nombre, u.apellido, u.correo, u.cedula,
  b.nombre_banco`;

const getAll = async (estado) => {
  const select = `FROM solicitud s
    JOIN usuario u ON s.id_usuario = u.id_usuario
    LEFT JOIN entidad_bancaria b ON s.id_banco = b.id_banco`;

  if (estado && estado !== 'todas') {
    const [rows] = await pool.query(
      `SELECT ${BASE_COLUMNS} ${select} WHERE s.estado = ? ORDER BY s.fecha DESC`,
      [estado]
    );
    return rows;
  }
  const [rows] = await pool.query(`SELECT ${BASE_COLUMNS} ${select} ORDER BY s.fecha DESC`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${BASE_COLUMNS}, u.id_usuario
     FROM solicitud s
     JOIN usuario u ON s.id_usuario = u.id_usuario
     LEFT JOIN entidad_bancaria b ON s.id_banco = b.id_banco
     WHERE s.id_solicitud = ?`,
    [id]
  );
  return rows[0];
};

const getCreditosBySolicitud = async (solicitud_id) => {
  const [rows] = await pool.query(
    `SELECT id_credito, monto_aprobado, tasa_interes, plazo,
            cuotas_totales, cuotas_pagadas, saldo_pendiente, fecha_aprobacion
     FROM credito WHERE id_solicitud = ?`,
    [solicitud_id]
  );
  return rows;
};

const getByUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT id_solicitud, monto, fecha, estado, id_banco
     FROM solicitud WHERE id_usuario = ? ORDER BY fecha DESC`,
    [usuario_id]
  );
  return rows;
};

const findUsuarioByCorreo = async (correo) => {
  const [rows] = await pool.query('SELECT id_usuario FROM usuario WHERE correo = ?', [correo]);
  return rows[0];
};

const findEstado = async (id) => {
  const [rows] = await pool.query('SELECT id_solicitud, id_usuario, monto, estado, id_banco FROM solicitud WHERE id_solicitud = ?', [id]);
  return rows[0];
};

const create = async ({ id_usuario, monto }) => {
  const [result] = await pool.query(
    'INSERT INTO solicitud (id_usuario, monto) VALUES (?, ?)',
    [id_usuario, monto]
  );
  return result.insertId;
};

const updateEstado = async (id, estado) => {
  const [result] = await pool.query('UPDATE solicitud SET estado = ? WHERE id_solicitud = ?', [estado, id]);
  return result.affectedRows;
};

const updateAprobada = async (id, id_banco) => {
  const [result] = await pool.query(
    `UPDATE solicitud SET estado = 'aprobado', id_banco = COALESCE(?, id_banco)
     WHERE id_solicitud = ?`,
    [id_banco ?? null, id]
  );
  return result.affectedRows;
};

const createCredito = async ({ solicitud_id, monto_aprobado, tasa_interes, plazo }) => {
  const [result] = await pool.query(
    `INSERT INTO credito (id_solicitud, monto_aprobado, tasa_interes, plazo, cuotas_totales, saldo_pendiente)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [solicitud_id, monto_aprobado, tasa_interes, plazo, plazo, monto_aprobado]
  );
  return result.insertId;
};

module.exports = {
  getAll, getById, getCreditosBySolicitud, getByUsuario,
  findUsuarioByCorreo, findEstado, create, updateEstado, updateAprobada, createCredito,
};