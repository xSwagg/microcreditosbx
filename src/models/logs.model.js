const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT l.id_log, l.id_solicitud, l.estado_anterior, l.estado_nuevo,
            l.fecha_cambio, l.usuario_responsable, u.nombre AS usuario_nombre
     FROM estado_solicitud_log l
     JOIN solicitud s ON l.id_solicitud = s.id_solicitud
     JOIN usuario u ON s.id_usuario = u.id_usuario
     ORDER BY l.fecha_cambio DESC`
  );
  return rows;
};

const getBySolicitud = async (solicitud_id) => {
  const [rows] = await pool.query(
    `SELECT id_log, id_solicitud, estado_anterior, estado_nuevo, fecha_cambio, usuario_responsable
     FROM estado_solicitud_log WHERE id_solicitud = ? ORDER BY fecha_cambio DESC`,
    [solicitud_id]
  );
  return rows;
};

const getById = async (log_id) => {
  const [rows] = await pool.query(
    `SELECT id_log, id_solicitud, estado_anterior, estado_nuevo, fecha_cambio, usuario_responsable
     FROM estado_solicitud_log WHERE id_log = ?`,
    [log_id]
  );
  return rows[0];
};

const create = async ({ solicitud_id, estado_anterior, estado_nuevo, usuario_responsable = 'sistema' }) => {
  const [result] = await pool.query(
    `INSERT INTO estado_solicitud_log (id_solicitud, estado_anterior, estado_nuevo, usuario_responsable)
     VALUES (?, ?, ?, ?)`,
    [solicitud_id, estado_anterior, estado_nuevo, usuario_responsable]
  );
  return result.insertId;
};

module.exports = { getAll, getBySolicitud, getById, create };