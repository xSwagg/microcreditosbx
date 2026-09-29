const pool = require('../config/db');

const BASE_COLUMNS = `
  ev.id_evaluacion, ev.id_solicitud, ev.id_empleado, ev.puntaje,
  ev.capacidad_pago, ev.recomendacion, ev.observaciones, ev.fecha_evaluacion,
  e.nombre AS asesor, o.nombre AS oficina`;

const FROM = `
  FROM evaluacion ev
  JOIN solicitud s ON ev.id_solicitud = s.id_solicitud
  JOIN usuario u ON s.id_usuario = u.id_usuario
  LEFT JOIN empleado e ON ev.id_empleado = e.id_empleado
  LEFT JOIN oficina o ON e.id_oficina = o.id_oficina`;

const BASE_SELECT = `
  SELECT ${BASE_COLUMNS}, u.nombre, u.apellido, u.correo, s.monto, s.estado AS estado_solicitud ${FROM}`;

const getAll = async ({ recomendacion } = {}) => {
  const where = (recomendacion && recomendacion !== 'todas') ? ' WHERE ev.recomendacion = ?' : '';
  const [rows] = await pool.query(
    `${BASE_SELECT}${where} ORDER BY ev.fecha_evaluacion DESC`,
    recomendacion && recomendacion !== 'todas' ? [recomendacion] : []
  );
  return rows;
};

const getById = async (evaluacion_id) => {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE ev.id_evaluacion = ?`, [evaluacion_id]);
  return rows[0];
};

const getBySolicitud = async (solicitud_id) => {
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE ev.id_solicitud = ? ORDER BY ev.fecha_evaluacion DESC`,
    [solicitud_id]
  );
  return rows;
};

const findBySolicitud = async (solicitud_id) => {
  const [rows] = await pool.query(
    `SELECT id_evaluacion, id_solicitud, id_empleado, puntaje, recomendacion
     FROM evaluacion WHERE id_solicitud = ?`,
    [solicitud_id]
  );
  return rows[0];
};

const findSolicitud = async (solicitud_id) => {
  const [rows] = await pool.query(
    'SELECT id_solicitud, id_usuario, monto, estado FROM solicitud WHERE id_solicitud = ?',
    [solicitud_id]
  );
  return rows[0];
};

const findEmpleado = async (empleado_id) => {
  const [rows] = await pool.query(
    'SELECT id_empleado, nombre FROM empleado WHERE id_empleado = ? AND activo = 1',
    [empleado_id]
  );
  return rows[0];
};

const create = async ({ id_solicitud, id_empleado = null, puntaje, capacidad_pago = null, recomendacion, observaciones = null }) => {
  const [result] = await pool.query(
    `INSERT INTO evaluacion (id_solicitud, id_empleado, puntaje, capacidad_pago, recomendacion, observaciones)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_solicitud, id_empleado, puntaje, capacidad_pago, recomendacion, observaciones]
  );
  return result.insertId;
};

const update = async (evaluacion_id, { id_empleado, puntaje, capacidad_pago, recomendacion, observaciones }) => {
  const fields = [];
  const values = [];
  if (id_empleado !== undefined) { fields.push('id_empleado = ?'); values.push(id_empleado); }
  if (puntaje !== undefined) { fields.push('puntaje = ?'); values.push(puntaje); }
  if (capacidad_pago !== undefined) { fields.push('capacidad_pago = ?'); values.push(capacidad_pago); }
  if (recomendacion !== undefined) { fields.push('recomendacion = ?'); values.push(recomendacion); }
  if (observaciones !== undefined) { fields.push('observaciones = ?'); values.push(observaciones); }
  if (fields.length === 0) return 0;
  values.push(evaluacion_id);
  const [result] = await pool.query(
    `UPDATE evaluacion SET ${fields.join(', ')} WHERE id_evaluacion = ?`,
    values
  );
  return result.affectedRows;
};

const remove = async (evaluacion_id) => {
  const [result] = await pool.query('DELETE FROM evaluacion WHERE id_evaluacion = ?', [evaluacion_id]);
  return result.affectedRows;
};

module.exports = {
  getAll, getById, getBySolicitud, findBySolicitud,
  findSolicitud, findEmpleado, create, update, remove,
};
