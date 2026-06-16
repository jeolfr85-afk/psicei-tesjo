-- ============================================
-- PSICEI - Migraciones de Base de Datos
-- Ejecutar en MySQL sobre la base 'ejemplo1'
-- ============================================

-- 1. Agregar columna id si no existe
ALTER TABLE registrod ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST;

-- 2. Agregar columna de rol
ALTER TABLE registrod ADD COLUMN role ENUM('user','admin') NOT NULL DEFAULT 'user';

-- 3. Columnas para recuperación de contraseña
ALTER TABLE registrod ADD COLUMN reset_token VARCHAR(64) DEFAULT NULL;
ALTER TABLE registrod ADD COLUMN reset_expiry DATETIME DEFAULT NULL;

-- 4. Columnas faltantes que usa index.php
ALTER TABLE registrod ADD COLUMN Apellido_Materno VARCHAR(100) DEFAULT NULL;
ALTER TABLE registrod ADD COLUMN Numero_de_telefono VARCHAR(20) DEFAULT NULL;
ALTER TABLE registrod ADD COLUMN Subarea VARCHAR(200) DEFAULT NULL;

-- 5. Crear usuario admin de prueba (cambiar contraseña después)
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO registrod (Nombre, Apellido_Paterno, Correo_Institucional, Nombre_Usuario, Contrasena, Area, role)
VALUES ('Administrador', 'Sistema', 'admin@tesjo.mx', 'admin',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'Dirección Académica', 'admin')
ON DUPLICATE KEY UPDATE role='admin';
