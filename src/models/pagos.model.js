const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT p.id_pago, p.id_credito, p.monto_pago, p.fecha_pago,
            m.nombre_metodo, u.nombre, u.correo
     FROM pago p
     LEFT JOIN metodo_pago m ON p.id_metodo = m.id_metodo
     JOIN credito c ON p.id_credito = c.id_credito
     JOIN solicitud s ON c.id_solicitud = s.id_solicitud
     JOIN usuario u ON s.id_usuario = u.id_usuario
     ORDER BY p.fecha_pago DESC`
  );
  return rows;
};

const getById = async (pago_id) => {
  const [rows] = await pool.query(
    `SELECT p.id_pago, p.id_credito, p.monto_pago, p.fecha_pago,
            m.nombre_metodo, u.nombre, u.correo
     FROM pago p
     LEFT JOIN metodo_pago m ON p.id_metodo = m.id_metodo
     JOIN credito c ON p.id_credito = c.id_credito
     JOIN solicitud s ON c.id_solicitud = s.id_solicitud
     JOIN usuario u ON s.id_usuario = u.id_usuario
     WHERE p.id_pago = ?`,
    [pago_id]
  );
  return rows[0];
};

const getByCredito = async (credito_id) => {
  const [rows] = await pool.query(
    `SELECT p.id_pago, p.monto_pago, p.fecha_pago, m.nombre_metodo
     FROM pago p LEFT JOIN metodo_pago m ON p.id_metodo = m.id_metodo
     WHERE p.id_credito = ? ORDER BY p.fecha_pago DESC`,
    [credito_id]
  );
  return rows;
};

const findByCredito = async (credito_id) => {
  const [rows] = await pool.query('SELECT id_credito FROM credito WHERE id_credito = ?', [credito_id]);
  return rows[0];
};

const findCreditoActivoByCorreo = async (correo) => {
  const [rows] = await pool.query(
    `SELECT u.id_usuario, c.id_credito, c.saldo_pendiente
     FROM credito c
     JOIN solicitud s ON c.id_solicitud = s.id_solicitud
     JOIN usuario u ON s.id_usuario = u.id_usuario
     WHERE u.correo = ? AND c.saldo_pendiente > 0 LIMIT 1`,
    [correo]
  );
  return rows[0];
};

const create = async ({ id_credito, id_metodo, monto }) => {
  const [result] = await pool.query(
    'INSERT INTO pago (id_credito, id_metodo, monto_pago) VALUES (?, ?, ?)',
    [id_credito, id_metodo ?? null, monto]
  );
  return result.insertId;
};

const aplicarPagoCredito = async ({ id_credito, nuevo_saldo }) => {
  await pool.query(
    'UPDATE credito SET saldo_pendiente = ?, cuotas_pagadas = cuotas_pagadas + 1 WHERE id_credito = ?',
    [Math.max(nuevo_saldo, 0), id_credito]
  );
};

const remove = async (pago_id) => {
  const [result] = await pool.query('DELETE FROM pago WHERE id_pago = ?', [pago_id]);
  return result.affectedRows;
};

module.exports = {
  getAll, getById, getByCredito, findByCredito, findCreditoActivoByCorreo,
  create, aplicarPagoCredito, remove,
};