const pool = require('../config/db');

// ? = placeholder seguro (evita SQL Injection)

// Busca un usuario por correo incluyendo su rol/nivel (necesarios para el token)
const findByCorreo = async (correo) => {
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.nombre, u.apellido, u.cedula, u.correo,
            u.contrasena, u.telefono, u.activo,
            p.rol, p.nivel
       FROM usuario u
       LEFT JOIN perfil p ON p.id_usuario = u.id_usuario
      WHERE u.correo = ?`,
    [correo]
  );
  return rows[0]; // undefined si no existe
};

// Verifica si ya existe el correo o la cédula
const findByCorreoOCedula = async (correo, cedula) => {
  const [rows] = await pool.query(
    'SELECT id_usuario FROM usuario WHERE correo = ? OR cedula = ?',
    [correo, cedula]
  );
  return rows[0];
};

// Perfil sin datos sensibles (nunca devolver contrasena)
const getPerfil = async (id) => {
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.cedula,
            u.telefono, u.fecha_registro, u.prueba_virtual_completada, u.activo,
            p.foto, p.nivel, p.rol
       FROM usuario u
       LEFT JOIN perfil p ON p.id_usuario = u.id_usuario
      WHERE u.id_usuario = ?`,
    [id]
  );
  return rows[0];
};

// Crea usuario + perfil dentro de una transacción
const create = async ({ nombre, apellido, cedula, correo, contrasena, telefono }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [usuario] = await conn.query(
      `INSERT INTO usuario (nombre, apellido, cedula, correo, contrasena, telefono)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido || '', cedula, correo, contrasena, telefono || '']
    );

    await conn.query('INSERT INTO perfil (id_usuario) VALUES (?)', [usuario.insertId]);

    await conn.commit();

    return { id_usuario: usuario.insertId, nombre, apellido, correo };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = { findByCorreo, findByCorreoOCedula, getPerfil, create };
