-- Inserción de usuarios
INSERT INTO usuarios (nombre, email, password) VALUES ('Samuel', 'email@example.com', 'password1');
INSERT INTO usuarios (nombre, email, password) VALUES ('Violeta', 'usuario2@example.com', 'password2');
INSERT INTO usuarios (nombre, email, password) VALUES ('Juan', 'usuario3@example.com', 'password3');
INSERT INTO usuarios (nombre, email, password) VALUES ('Julio', 'usuario4@example.com', 'password4');
INSERT INTO usuarios (nombre, email, password) VALUES ('Jesus', 'jesus@example.com', 'password5');
INSERT INTO usuarios (nombre, email, password) VALUES ('Alberto', 'alberto@example.com', 'password5');
INSERT INTO usuarios (nombre, email, password) VALUES ('Maria', 'maria@example.com', 'password5');
INSERT INTO usuarios (nombre, email, password) VALUES ('Laura', 'laura@example.com', 'password5');

-- Inserción de grupos de gastos
INSERT INTO grupo_de_gastos (nombre) VALUES ('Viaje a Egipto');
INSERT INTO grupo_de_gastos (nombre) VALUES ('Cena de Navidad');
INSERT INTO grupo_de_gastos (nombre) VALUES ('Pelicula');


-- Inserción de relaciones usuario-grupo (usuario_grupo)
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Samuel', 1, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Violeta', 1, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Juan', 1, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Julio', 2, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Jesus', 3, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Violeta', 2, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Juan', 3, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Samuel', 2, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Laura', 2, '');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('Maria', 3, '');

-- Inserción de gastos
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Cena en restaurante', 45.50, 'usuario1', 1);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Compra en supermercado', 30.75, 'usuario2', 1);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Suscripción Netflix', 15.99, 'usuario2', 3);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Regalo de cumpleaños', 50.00, 'usuario1', 5);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Taxi compartido', 12.60, 'usuario3', 1);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Cena especial de Navidad', 120.00, 'usuario4', 2);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Entrada al cine', 9.99, 'usuario5', 3);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Compra de muebles', 500.00, 'usuario1', 4);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Reparaciones de la casa', 200.00, 'usuario2', 4);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Bebidas para la cena de Navidad', 35.00, 'usuario3', 2);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Visita a las pirámides', 80.00, 'usuario6', 1);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Transporte público en Egipto', 20.00, 'usuario1', 1);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Souvenirs del viaje', 45.00, 'usuario7', 1);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Decoraciones para Navidad', 60.00, 'usuario8', 2);
INSERT INTO gasto (concepto, importe, pagadopor, grupo_id) VALUES ('Popcorn y refrescos', 15.00, 'usuario2', 3);

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

