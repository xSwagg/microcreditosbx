const pool = require('../config/db');

// Consultas de compatibilidad con la SPA antigua.
// Devuelven el shape original que espera el frontend previo.

const findUsuarioByCorreo = async (correo) => {
  const [rows] = await pool.query('SELECT id_usuario FROM usuario WHERE correo = ?', [correo]);
  return rows[0];
};

const getSolicitudesPorCorreo = async (correo) => {
  const [rows] = await pool.query(
    `SELECT id_solicitud, monto, fecha, estado
     FROM solicitud WHERE id_usuario = ? ORDER BY fecha DESC`,
    [correo]
  );
  return rows;
};

const getCreditoActivoPorCorreo = async (correo) => {
  const [rows] = await pool.query(
    `SELECT c.monto_aprobado, c.saldo_pendiente, c.cuotas_totales, c.cuotas_pagadas
     FROM credito c
     JOIN solicitud s ON c.id_solicitud = s.id_solicitud
     JOIN usuario u ON s.id_usuario = u.id_usuario
     WHERE u.correo = ? AND c.saldo_pendiente > 0 LIMIT 1`,
    [correo]
  );
  return rows[0];
};

module.exports = { findUsuarioByCorreo, getSolicitudesPorCorreo, getCreditoActivoPorCorreo };
