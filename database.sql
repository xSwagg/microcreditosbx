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
-- TABLA: oficina
-- ==============================================
CREATE TABLE IF NOT EXISTS oficina (
    id_oficina INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    direccion VARCHAR(150) NULL,
    telefono VARCHAR(20) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_oficina),
    UNIQUE INDEX idx_oficina_nombre (nombre)
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: empleado
-- ==============================================
CREATE TABLE IF NOT EXISTS empleado (
    id_empleado INT NOT NULL AUTO_INCREMENT,
    id_oficina INT NULL,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL DEFAULT 'asesor',
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    fecha_ingreso DATE NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_empleado),
    INDEX idx_empleado_oficina (id_oficina),
    CONSTRAINT fk_emp_oficina FOREIGN KEY (id_oficina) REFERENCES oficina (id_oficina) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: tipo_credito
-- ==============================================
CREATE TABLE IF NOT EXISTS tipo_credito (
    id_tipo INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    descripcion TEXT NULL,
    monto_minimo DECIMAL(12,2) NOT NULL DEFAULT 0,
    monto_maximo DECIMAL(12,2) NOT NULL,
    tasa_interes DECIMAL(5,2) NOT NULL DEFAULT 2.50,
    plazo_maximo INT NOT NULL DEFAULT 12,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_tipo),
    UNIQUE INDEX idx_tipo_nombre (nombre)
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: documento
-- ==============================================
CREATE TABLE IF NOT EXISTS documento (
    id_documento INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    nombre_archivo VARCHAR(150) NOT NULL,
    ruta VARCHAR(255) NULL,
    estado ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',
    observaciones TEXT NULL,
    fecha_carga DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_documento),
    INDEX idx_documento_usuario (id_usuario, estado),
    CONSTRAINT fk_doc_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: cuota
-- ==============================================
CREATE TABLE IF NOT EXISTS cuota (
    id_cuota INT NOT NULL AUTO_INCREMENT,
    id_credito INT NOT NULL,
    numero_cuota INT NOT NULL,
    monto_cuota DECIMAL(12,2) NOT NULL,
    monto_pagado DECIMAL(12,2) NOT NULL DEFAULT 0,
    fecha_vencimiento DATE NOT NULL,
    fecha_pago DATETIME NULL,
    estado ENUM('pendiente', 'pagada', 'vencida') NOT NULL DEFAULT 'pendiente',
    PRIMARY KEY (id_cuota),
    UNIQUE INDEX idx_cuota_credito_numero (id_credito, numero_cuota),
    INDEX idx_cuota_estado (estado),
    CONSTRAINT fk_cuota_credito FOREIGN KEY (id_credito) REFERENCES credito (id_credito) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: garantia
-- ==============================================
CREATE TABLE IF NOT EXISTS garantia (
    id_garantia INT NOT NULL AUTO_INCREMENT,
    id_credito INT NULL,
    id_usuario INT NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT NULL,
    valor_estimado DECIMAL(12,2) NOT NULL DEFAULT 0,
    estado ENUM('registrada', 'verificada', 'liberada') NOT NULL DEFAULT 'registrada',
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_garantia),
    INDEX idx_garantia_credito (id_credito),
    CONSTRAINT fk_gar_credito FOREIGN KEY (id_credito) REFERENCES credito (id_credito) ON DELETE CASCADE,
    CONSTRAINT fk_gar_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: evaluacion
-- ==============================================
CREATE TABLE IF NOT EXISTS evaluacion (
    id_evaluacion INT NOT NULL AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    id_empleado INT NULL,
    puntaje DECIMAL(5,2) NOT NULL DEFAULT 0,
    capacidad_pago DECIMAL(12,2) NULL,
    recomendacion ENUM('revision', 'aprobado', 'rechazado') NOT NULL DEFAULT 'revision',
    observaciones TEXT NULL,
    fecha_evaluacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_evaluacion),
    UNIQUE INDEX idx_evaluacion_solicitud (id_solicitud),
    CONSTRAINT fk_eval_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitud (id_solicitud) ON DELETE CASCADE,
    CONSTRAINT fk_eval_empleado FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: comision
-- ==============================================
CREATE TABLE IF NOT EXISTS comision (
    id_comision INT NOT NULL AUTO_INCREMENT,
    id_pago INT NOT NULL,
    concepto VARCHAR(100) NOT NULL,
    tipo ENUM('fija', 'porcentaje') NOT NULL DEFAULT 'fija',
    valor DECIMAL(12,2) NOT NULL,
    monto_cobrado DECIMAL(12,2) NOT NULL DEFAULT 0,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_comision),
    INDEX idx_comision_pago (id_pago),
    CONSTRAINT fk_com_pago FOREIGN KEY (id_pago) REFERENCES pago (id_pago) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==============================================
-- TABLA: parametro
-- ==============================================
CREATE TABLE IF NOT EXISTS parametro (
    id_parametro INT NOT NULL AUTO_INCREMENT,
    clave VARCHAR(50) NOT NULL,
    valor VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NULL,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_parametro),
    UNIQUE INDEX idx_parametro_clave (clave)
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

-- ==============================================
-- DATOS BASE: oficina
-- ==============================================
INSERT IGNORE INTO oficina (nombre, ciudad, direccion, telefono) VALUES
('Oficina Principal', 'Bogotá', 'Calle 100 # 20-30', '6017451200'),
('Oficina Norte', 'Medellín', 'Carrera 45 # 12-08', '6043215500'),
('Oficina Sur', 'Cali', 'Avenida 6N # 24-15', '6028893400');

-- ==============================================
-- DATOS BASE: tipo_credito
-- ==============================================
INSERT IGNORE INTO tipo_credito (nombre, descripcion, monto_minimo, monto_maximo, tasa_interes, plazo_maximo) VALUES
('Microcrédito Personal', 'Crédito de consumo personal a corto plazo', 500000, 5000000, 2.50, 24),
('Crédito Pequeño Empresa', 'Capital de trabajo para pequeños comercios', 1000000, 15000000, 2.20, 36),
('Crédito por Libranza', 'Descuento sobre nómina mensual', 2000000, 30000000, 1.80, 60);

-- ==============================================
-- DATOS BASE: parametro
-- ==============================================
INSERT IGNORE INTO parametro (clave, valor, descripcion) VALUES
('PUNTAJE_MINIMO_APROBACION', '60', 'Puntaje mínimo para aprobar una solicitud'),
('MONTO_MAXIMO_SIN_GARANTIA', '3000000', 'Monto máximo sin garantía registrada'),
('INTERES_MORA_PORCENTAJE', '1.50', 'Interés de mora mensual en créditos vencidos'),
('DIAS_VIGENCIA_SOLICITUD', '30', 'Días de vigencia de una solicitud antes de expirar');