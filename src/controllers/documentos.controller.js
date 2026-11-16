const Documento = require('../models/documentos.model');
const Notificacion = require('../models/notificaciones.model');
const Usuario = require('../models/usuarios.model');

const ESTADOS = ['pendiente', 'aprobado', 'rechazado'];

const getAll = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.usuario !== undefined) filtros.id_usuario = req.query.usuario;
    if (req.query.estado !== undefined) filtros.estado = req.query.estado;

    const rows = await Documento.getAll(filtros);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { documento_id } = req.params;
    const documento = await Documento.getById(documento_id);
    if (!documento) {
      return res.status(404).json({ ok: false, msg: 'Documento no encontrado' });
    }
    res.json({ ok: true, data: documento });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const rows = await Documento.getByUsuario(usuario_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { id_usuario, tipo_documento, nombre_archivo, ruta = null, observaciones = null } = req.body || {};

    if (!id_usuario || !tipo_documento || !nombre_archivo) {
      return res.status(400).json({ ok: false, msg: 'id_usuario, tipo_documento y nombre_archivo son requeridos' });
    }

    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    const duplicado = await Documento.findDuplicado({ id_usuario, tipo_documento, nombre_archivo });
    if (duplicado) {
      return res.status(400).json({ ok: false, msg: 'El documento ya fue cargado' });
    }

    const id = await Documento.create({ id_usuario, tipo_documento, nombre_archivo, ruta, observaciones });
    res.status(201).json({ ok: true, msg: 'Documento cargado exitosamente', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const createForUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { tipo_documento, nombre_archivo, ruta = null, observaciones = null } = req.body || {};

    if (!tipo_documento || !nombre_archivo) {
      return res.status(400).json({ ok: false, msg: 'tipo_documento y nombre_archivo son requeridos' });
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    const duplicado = await Documento.findDuplicado({ id_usuario: usuario_id, tipo_documento, nombre_archivo });
    if (duplicado) {
      return res.status(400).json({ ok: false, msg: 'El documento ya fue cargado' });
    }

    const id = await Documento.create({ id_usuario: usuario_id, tipo_documento, nombre_archivo, ruta, observaciones });
    res.status(201).json({ ok: true, msg: 'Documento cargado exitosamente', id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const revisar = async (req, res) => {
  try {
    const { documento_id } = req.params;
    const { estado, observaciones = null } = req.body || {};

    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ ok: false, msg: 'estado inválido' });
    }

    const documento = await Documento.getById(documento_id);
    if (!documento) {
      return res.status(404).json({ ok: false, msg: 'Documento no encontrado' });
    }

    await Documento.update(documento_id, { estado, observaciones });

    const mensajes = {
      aprobado: `Tu documento (${documento.tipo_documento}) fue aprobado.`,
      rechazado: `Tu documento (${documento.tipo_documento}) fue rechazado.`,
      pendiente: `Tu documento (${documento.tipo_documento}) quedó en revisión.`,
    };
    await Notificacion.create({
      id_usuario: documento.id_usuario,
      tipo: `documento_${estado}`,
      mensaje: mensajes[estado],
    });

    res.json({ ok: true, msg: 'Documento actualizado correctamente', estado });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { documento_id } = req.params;
    const affected = await Documento.remove(documento_id);
    if (affected === 0) {
      return res.status(404).json({ ok: false, msg: 'Documento no encontrado' });
    }
    res.json({ ok: true, msg: 'Documento eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, getByUsuario, create, createForUsuario, revisar, remove };
