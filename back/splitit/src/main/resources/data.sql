-- Inserción de grupos de gastos
INSERT INTO grupo_de_gastos (id, nombre) VALUES (1, 'Viaje a Egipto');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (2, 'Cena de Navidad');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (3, 'Pelicula');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (4, 'Compra de casa');
INSERT INTO grupo_de_gastos (id, nombre) VALUES (5, 'Regalo de cumpleaños');

-- Inserción de gastos asociados a los grupos
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (1, 'Cena en restaurante', 45.50, 'usuario1', 1);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (2, 'Compra en supermercado', 30.75, 'usuario2', 1);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (3, 'Suscripción Netflix', 15.99, 'usuario2', 3);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (4, 'Regalo de cumpleaños', 50.00, 'usuario1', 5);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (5, 'Taxi compartido', 12.60, 'usuario3', 1);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (6, 'Cena especial de Navidad', 120.00, 'usuario4', 2);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (7, 'Entrada al cine', 9.99, 'usuario5', 3);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (8, 'Compra de muebles', 500.00, 'usuario1', 4);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (9, 'Reparaciones de la casa', 200.00, 'usuario2', 4);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (10, 'Bebidas para la cena de Navidad', 35.00, 'usuario3', 2);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (11, 'Visita a las pirámides', 80.00, 'usuario6', 1);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (12, 'Transporte público en Egipto', 20.00, 'usuario1', 1);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (13, 'Souvenirs del viaje', 45.00, 'usuario7', 1);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (14, 'Decoraciones para Navidad', 60.00, 'usuario8', 2);
INSERT INTO Gasto (id, concepto, importe, pagadopor, grupo_id) VALUES (15, 'Popcorn y refrescos', 15.00, 'usuario2', 3);