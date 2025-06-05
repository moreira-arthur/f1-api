INSERT INTO USERS (Login, Password, Tipo) VALUES (
    'admin',
    crypt('admin', gen_salt('bf')), -- Gera um hash seguro para a senha 'admin'
    'Administrador'
);

-- Cadastrar todos os pilotos existentes
INSERT INTO USERS (Login, Password, Tipo, IdOriginal)
SELECT
    d.driverRef || '_d',
    crypt(d.driverRef, gen_salt('bf')),
    'Piloto',
    d.driverId
FROM driver d;

-- Cadastrar todas as escuderias existentes
INSERT INTO USERS (Login, Password, Tipo, IdOriginal)
SELECT
    c.constructorRef || '_c',
    crypt(c.constructorRef, gen_salt('bf')),
    'Escuderia',
    c.constructorId
FROM constructors c;