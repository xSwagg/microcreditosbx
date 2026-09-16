-- ==============================================
-- MicrocreditosBX - Base de datos MySQL
-- Base de datos: micropsev2
-- Importar este archivo en MySQL (phpMyAdmin/Workbench/CLI)
-- para crear la base de datos y todas sus tablas.
-- ==============================================

CREATE DATABASE IF NOT EXISTS micropsev2 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE micropsev2;

-- ==============================================
-- TABLA: usuario
-- ==============================================
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NULL,
    prueba_virtual_completada TINYINT(1) NOT NULL DEFAULT 0,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_usuario),
    UNIQUE INDEX idx_usuario_cedula (cedula)
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: perfil
-- ==============================================
CREATE TABLE IF NOT EXISTS perfil (
    id_usuario INT NOT NULL,
    foto VARCHAR(255) NULL DEFAULT 'default_avatar.png',
    nivel VARCHAR(30) NULL DEFAULT 'basico',
    rol ENUM('cliente', 'asesor', 'administrador') NOT NULL DEFAULT 'cliente',
    PRIMARY KEY (id_usuario),
    CONSTRAINT fk_perfil_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: entidad_bancaria
-- ==============================================
CREATE TABLE IF NOT EXISTS entidad_bancaria (
    id_banco INT NOT NULL AUTO_INCREMENT,
    nombre_banco VARCHAR(100) NOT NULL,
    respuesta ENUM('aprobado', 'rechazado', 'pendiente') NOT NULL DEFAULT 'pendiente',
    fecha_respuesta DATETIME NULL,
    observaciones TEXT NULL,
    PRIMARY KEY (id_banco)
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: solicitud
-- ==============================================
CREATE TABLE IF NOT EXISTS solicitud (
    id_solicitud INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_banco INT NULL,
    monto DECIMAL(12,2) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',
    PRIMARY KEY (id_solicitud),
    INDEX idx_solicitud_estado (estado),
    CONSTRAINT fk_sol_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_sol_banco FOREIGN KEY (id_banco) REFERENCES entidad_bancaria (id_banco) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: credito
-- ==============================================
CREATE TABLE IF NOT EXISTS credito (
    id_credito INT NOT NULL AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    monto_aprobado DECIMAL(12,2) NOT NULL,
    tasa_interes DECIMAL(5,2) NOT NULL,
    plazo INT NOT NULL COMMENT 'Plazo en meses',
    cuotas_totales INT NOT NULL DEFAULT 0,
    cuotas_pagadas INT NOT NULL DEFAULT 0,
    saldo_pendiente DECIMAL(12,2) NOT NULL,
    fecha_aprobacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_credito),
    INDEX idx_credito_saldo (saldo_pendiente),
    CONSTRAINT fk_cred_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitud (id_solicitud) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: metodo_pago
-- ==============================================
CREATE TABLE IF NOT EXISTS metodo_pago (
    id_metodo INT NOT NULL AUTO_INCREMENT,
    nombre_metodo VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_metodo)
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: pago
-- ==============================================
CREATE TABLE IF NOT EXISTS pago (
    id_pago INT NOT NULL AUTO_INCREMENT,
    id_credito INT NOT NULL,
    id_metodo INT NULL,
    monto_pago DECIMAL(12,2) NOT NULL,
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_pago),
    CONSTRAINT fk_pago_credito FOREIGN KEY (id_credito) REFERENCES credito (id_credito) ON DELETE CASCADE,
    CONSTRAINT fk_pago_metodo FOREIGN KEY (id_metodo) REFERENCES metodo_pago (id_metodo) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: notificacion
-- ==============================================
CREATE TABLE IF NOT EXISTS notificacion (
    id_notificacion INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    leida TINYINT(1) NOT NULL DEFAULT 0,
    fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_notificacion),
    INDEX idx_notificacion_usuario (id_usuario, leida),
    CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: estado_solicitud_log
-- ==============================================
CREATE TABLE IF NOT EXISTS estado_solicitud_log (
    id_log INT NOT NULL AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    estado_anterior VARCHAR(20) NOT NULL,
    estado_nuevo VARCHAR(20) NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_responsable VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_log),
    CONSTRAINT fk_log_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitud (id_solicitud) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: prueba_virtual
-- ==============================================
CREATE TABLE IF NOT EXISTS prueba_virtual (
    id_prueba INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    fecha_completada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    puntaje DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    aprobada TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id_prueba),
    CONSTRAINT fk_prueba_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- DATOS BASE: metodo_pago
-- ==============================================
INSERT IGNORE INTO metodo_pago (nombre_metodo) VALUES
('PSE'),
('Nequi'),
('Daviplata'),
('Transferencia bancaria'),
('Efectivo');