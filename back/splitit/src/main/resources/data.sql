-- Inserción de usuarios
INSERT INTO usuarios (nombre, email, password) VALUES ('usuario1', 'usuario1@example.com', 'password1');
INSERT INTO usuarios (nombre, email, password) VALUES ('usuario2', 'usuario2@example.com', 'password2');
INSERT INTO usuarios (nombre, email, password) VALUES ('usuario3', 'usuario3@example.com', 'password3');
INSERT INTO usuarios (nombre, email, password) VALUES ('usuario4', 'usuario4@example.com', 'password4');
INSERT INTO usuarios (nombre, email, password) VALUES ('usuario5', 'usuario5@example.com', 'password5');
INSERT INTO usuarios (nombre, email, password) VALUES ('usuario6', 'usuario6@example.com', 'password6');
INSERT INTO usuarios (nombre, email, password) VALUES ('usuario7', 'usuario7@example.com', 'password7');
INSERT INTO usuarios (nombre, email, password) VALUES ('usuario8', 'usuario8@example.com', 'password8');

-- Inserción de grupos de gastos
INSERT INTO grupo_de_gastos (id, nombre) VALUES (1, 'Viaje a Egipto');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (2, 'Cena de Navidad');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (3, 'Pelicula');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (4, 'Compra de casa');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (5, 'Regalo de cumpleaños');

-- Inserción de relaciones usuario-grupo (usuario_grupo)
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('usuario1', 1, 'Explorador');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('usuario2', 1, 'Aventurero');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('usuario3', 1, 'Viajero');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('usuario4', 2, 'Chef');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('usuario5', 3, 'Cinéfilo');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('usuario6', 1, 'Fotógrafo');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('usuario7', 1, 'Comprador');
INSERT INTO usuario_grupo (usuario_nombre, grupo_id, apodo) VALUES ('usuario8', 2, 'Decorador');

-- Inserción de gastos
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (1, 'Cena en restaurante', 45.50, 'usuario1', 1);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (2, 'Compra en supermercado', 30.75, 'usuario2', 1);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (3, 'Suscripción Netflix', 15.99, 'usuario2', 3);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (4, 'Regalo de cumpleaños', 50.00, 'usuario1', 5);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (5, 'Taxi compartido', 12.60, 'usuario3', 1);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (6, 'Cena especial de Navidad', 120.00, 'usuario4', 2);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (7, 'Entrada al cine', 9.99, 'usuario5', 3);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (8, 'Compra de muebles', 500.00, 'usuario1', 4);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (9, 'Reparaciones de la casa', 200.00, 'usuario2', 4);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (10, 'Bebidas para la cena de Navidad', 35.00, 'usuario3', 2);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (11, 'Visita a las pirámides', 80.00, 'usuario6', 1);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (12, 'Transporte público en Egipto', 20.00, 'usuario1', 1);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (13, 'Souvenirs del viaje', 45.00, 'usuario7', 1);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (14, 'Decoraciones para Navidad', 60.00, 'usuario8', 2);
INSERT INTO gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (15, 'Popcorn y refrescos', 15.00, 'usuario2', 3);

-- Inserción de participaciones en gastos (participacion_gasto)
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (1, 'usuario1', 22.75);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (1, 'usuario2', 22.75);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (2, 'usuario1', 15.38);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (2, 'usuario2', 15.37);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (3, 'usuario2', 15.99);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (4, 'usuario1', 50.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (5, 'usuario3', 12.60);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (6, 'usuario4', 120.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (7, 'usuario5', 9.99);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (8, 'usuario1', 500.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (9, 'usuario2', 200.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (10, 'usuario3', 35.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (11, 'usuario6', 80.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (12, 'usuario1', 20.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (13, 'usuario7', 45.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (14, 'usuario8', 60.00);
INSERT INTO participacion_gasto (gasto_id, usuario_nombre, importe) VALUES (15, 'usuario2', 15.00);