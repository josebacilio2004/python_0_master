-- ========================================================
-- SCHEMA Y SEEDER PARA SUPABASE (POSTGRESQL) / LOCAL DB
-- Proyecto: Python Master Game & SQL Interactive Learning
-- ========================================================

-- 1. Tabla de Usuarios / Clientes (Para retos de Autenticación, Saldos y Consultas)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    rol VARCHAR(50) DEFAULT 'estudiante',
    saldo NUMERIC(10, 2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Productos / Inventario (Para retos de Tienda Online y Sistema de Inventario)
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Tabla de Reservas de Hotel (Para retos de Reserva de Hoteles en Python y SQL)
CREATE TABLE IF NOT EXISTS reservas_hotel (
    id SERIAL PRIMARY KEY,
    cliente_nombre VARCHAR(120) NOT NULL,
    habitacion_tipo VARCHAR(50) NOT NULL,
    noches INTEGER NOT NULL,
    precio_noche NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'confirmada',
    fecha_reserva DATE DEFAULT CURRENT_DATE
);

-- 4. Tabla de Pedidos (Para retos de INNER JOIN y Agregaciones)
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1,
    total NUMERIC(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pagado',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Empleados (Para retos de Sistema de RH, ChatGPT & Zona Fit)
CREATE TABLE IF NOT EXISTS empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    departamento VARCHAR(80) NOT NULL,
    salario NUMERIC(10, 2) NOT NULL,
    fecha_ingreso DATE NOT NULL
);

-- ========================================================
-- DATOS SEMILLA (SEED DATA)
-- ========================================================

-- Limpieza preventiva para recarga limpia
TRUNCATE TABLE pedidos, reservas_hotel, productos, usuarios, empleados RESTART IDENTITY CASCADE;

-- Inserción de Usuarios
INSERT INTO usuarios (nombre, email, rol, saldo, activo) VALUES
('Carlos Mendoza', 'carlos.mendoza@empresa.com', 'admin', 1540.50, TRUE),
('Ana Gómez', 'ana.gomez@empresa.com', 'cliente_vip', 2890.00, TRUE),
('Mateo Fernández', 'mateo.fernandez@empresa.com', 'cliente', 120.00, TRUE),
('Lucía Morales', 'lucia.morales@empresa.com', 'cliente_vip', 4500.75, TRUE),
('Santiago Herrera', 'santiago.herrera@empresa.com', 'cliente', 0.00, FALSE),
('Valentina Ríos', 'valentina.rios@empresa.com', 'editor', 820.30, TRUE),
('Joaquín Paredes', 'joaquin.paredes@empresa.com', 'cliente', 310.00, TRUE),
('Elena Torres', 'elena.torres@empresa.com', 'cliente_vip', 3400.20, TRUE);

-- Inserción de Productos
INSERT INTO productos (nombre, categoria, precio, stock, sku) VALUES
('Laptop Pro 16"', 'Computación', 1499.99, 15, 'COMP-LAP-001'),
('Mouse Ergonómico Inalámbrico', 'Accesorios', 45.50, 80, 'ACC-MOU-002'),
('Teclado Mecánico RGB', 'Accesorios', 89.90, 45, 'ACC-TEC-003'),
('Monitor 4K 27" IPS', 'Monitores', 389.00, 22, 'MON-4K-004'),
('Auriculares Noise Cancelling', 'Audio', 199.99, 30, 'AUD-NOI-005'),
('Servidor Rack 1U 64GB', 'Servidores', 2850.00, 6, 'SRV-RCK-006'),
('Memoria RAM DDR5 32GB', 'Componentes', 129.50, 65, 'CMP-RAM-007'),
('Disco SSD NVMe 2TB', 'Almacenamiento', 145.00, 50, 'ALM-SSD-008');

-- Inserción de Reservas de Hotel
INSERT INTO reservas_hotel (cliente_nombre, habitacion_tipo, noches, precio_noche, total, estado) VALUES
('Ana Gómez', 'Suite Vista al Mar', 4, 180.00, 720.00, 'confirmada'),
('Carlos Mendoza', 'Habitación Estándar', 2, 75.00, 150.00, 'completada'),
('Lucía Morales', 'Suite Presidencial', 5, 320.00, 1600.00, 'confirmada'),
('Santiago Herrera', 'Habitación Estándar', 1, 75.00, 75.00, 'cancelada'),
('Elena Torres', 'Suite Vista al Mar', 3, 180.00, 540.00, 'confirmada'),
('Roberto Ruiz', 'Habitación Doble', 2, 110.00, 220.00, 'pendiente');

-- Inserción de Pedidos
INSERT INTO pedidos (usuario_id, producto_id, cantidad, total, estado) VALUES
(1, 1, 1, 1499.99, 'pagado'),
(2, 3, 2, 179.80, 'pagado'),
(2, 4, 1, 389.00, 'pagado'),
(3, 2, 1, 45.50, 'entregado'),
(4, 6, 1, 2850.00, 'pagado'),
(4, 5, 2, 399.98, 'en_camino'),
(6, 8, 2, 290.00, 'pagado'),
(7, 7, 1, 129.50, 'pendiente');

-- Inserción de Empleados
INSERT INTO empleados (nombre, departamento, salario, fecha_ingreso) VALUES
('Rodrigo Vega', 'Tecnología', 4800.00, '2021-03-15'),
('Mariana Castro', 'Recursos Humanos', 3200.00, '2022-01-10'),
('David Salazar', 'Tecnología', 5400.00, '2020-07-01'),
('Gabriela Lima', 'Finanzas', 3900.00, '2021-11-20'),
('Felipe Ortiz', 'Ventas', 2800.00, '2023-02-14'),
('Patricia Méndez', 'Tecnología', 4100.00, '2022-09-01'),
('Andrés Navarro', 'Operaciones', 3100.00, '2023-05-18');
