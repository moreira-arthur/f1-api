DELETE FROM users WHERE login = 'admin';

DELETE FROM users
WHERE tipo = 'Piloto'
AND idoriginal IN (SELECT driverid FROM driver);

DELETE FROM users
WHERE tipo = 'Escuderia'
AND idoriginal IN (SELECT constructorid FROM constructors);