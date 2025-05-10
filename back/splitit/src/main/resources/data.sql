-- Inserción de usuarios
INSERT INTO usuarios (nombre, email, password, authprovider) VALUES ('Samuel', 'email@example.com', 'password1', 'local');
INSERT INTO usuarios (nombre, email, password, authprovider) VALUES ('Violeta', 'usuario2@example.com', 'password2', 'local');
INSERT INTO usuarios (nombre, email, password, authprovider) VALUES ('Juan', 'usuario3@example.com', 'password3', 'local');
INSERT INTO usuarios (nombre, email, password, authprovider) VALUES ('Julio', 'usuario4@example.com', 'password4', 'local');
INSERT INTO usuarios (nombre, email, password, authprovider) VALUES ('Jesus', 'jesus@example.com', 'password5', 'local');
INSERT INTO usuarios (nombre, email, password, authprovider) VALUES ('Alberto', 'alberto@example.com', 'password5', 'local');
INSERT INTO usuarios (nombre, email, password, authprovider) VALUES ('Maria', 'maria@example.com', 'password5', 'local');
INSERT INTO usuarios (nombre, email, password, authprovider) VALUES ('Laura', 'laura@example.com', 'password5', 'local');

-- Inserción de grupos de gastos
INSERT INTO grupo_de_gastos (id, nombre) VALUES (12345678, 'Viaje a Egipto');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (23456789, 'Cena de Navidad');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (34567890, 'Pelicula');


-- Inserción de relaciones usuario-grupo (usuario_grupo)
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Samuel', 12345678, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Violeta', 12345678, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Juan', 12345678, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Julio', 23456789, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Jesus', 34567890, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Violeta', 23456789, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Juan', 34567890, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Samuel', 23456789, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Laura', 23456789, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Maria', 34567890, '');

-- Inserción de gastos
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Cena en restaurante', 45.50, 'Violeta', 12345678);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Compra en supermercado', 30.75, 'Samuel', 12345678);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Suscripción Netflix', 15.99, 'Maria', 34567890);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Taxi compartido', 12.60, 'Juan', 12345678);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Cena especial de Navidad', 120.00, 'Julio', 23456789);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Entrada al cine', 9.99, 'Maria', 34567890);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Bebidas para la cena de Navidad', 35.00, 'Violeta', 23456789);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Visita a las pirámides', 80.00, 'Juan', 12345678);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Transporte público en Egipto', 20.00, 'Samuel', 12345678);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Souvenirs del viaje', 45.00, 'Violeta', 12345678);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Decoraciones para Navidad', 60.00, 'Laura', 23456789);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Popcorn y refrescos', 15.00, 'Jesus', 34567890);

-- Inserción de participaciones en gastos (participacion_gasto)
-- Cena en restaurante (45.50) pagado por Violeta en el grupo 1
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (1, 'Violeta', 22.75);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (1, 'Juan', 22.75);

-- Compra en supermercado (30.75) pagado por Samuel en el grupo 1
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (2, 'Samuel', 15.38);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (2, 'Violeta', 15.37);

-- Suscripción Netflix (15.99) pagado por Maria en el grupo 3
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (3, 'Maria', 8.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (3, 'Juan', 7.99);

-- Taxi compartido (12.60) pagado por Juan en el grupo 1
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (4, 'Juan', 6.30);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (4, 'Samuel', 6.30);

-- Cena especial de Navidad (120.00) pagado por Julio en el grupo 2
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (5, 'Julio', 40.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (5, 'Laura', 40.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (5, 'Violeta', 40.00);

-- Entrada al cine (9.99) pagado por Maria en el grupo 3
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (6, 'Maria', 5.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (6, 'Jesus', 4.99);

-- Bebidas para la cena de Navidad (35.00) pagado por Violeta en el grupo 2
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (7, 'Violeta', 17.50);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (7, 'Laura', 17.50);

-- Visita a las pirámides (80.00) pagado por Juan en el grupo 1
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (8, 'Juan', 40.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (8, 'Samuel', 40.00);

-- Transporte público en Egipto (20.00) pagado por Samuel en el grupo 1
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (9, 'Samuel', 10.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (9, 'Violeta', 10.00);

-- Souvenirs del viaje (45.00) pagado por Violeta en el grupo 1
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (10, 'Violeta', 22.50);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (10, 'Juan', 22.50);

-- Decoraciones para Navidad (60.00) pagado por Laura en el grupo 2
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (11, 'Laura', 20.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (11, 'Julio', 20.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (11, 'Violeta', 20.00);

-- Popcorn y refrescos (15.00) pagado por Jesus en el grupo 3
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (12, 'Jesus', 7.50);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (12, 'Maria', 7.50);