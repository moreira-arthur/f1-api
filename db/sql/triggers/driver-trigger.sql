CREATE OR REPLACE FUNCTION sync_driver_user()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO USERS (Login, Password, Tipo, IdOriginal)
        VALUES (
            NEW.driverRef || '_d',
            crypt(NEW.driverRef, gen_salt('bf')),
            'Piloto',
            NEW.driverId
        );
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE USERS
        SET
            Login = NEW.driverRef || '_d',
            Password = crypt(NEW.driverRef, gen_salt('bf'))
        WHERE
            IdOriginal = NEW.driverId AND Tipo = 'Piloto';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para a tabela de pilotos
CREATE TRIGGER trigger_sync_driver
AFTER INSERT OR UPDATE ON driver
FOR EACH ROW EXECUTE FUNCTION sync_driver_user();