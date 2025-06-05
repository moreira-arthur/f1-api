CREATE OR REPLACE FUNCTION sync_constructor_user()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO USERS (Login, Password, Tipo, IdOriginal)
        VALUES (
            NEW.constructorRef || '_c',
            crypt(NEW.constructorRef, gen_salt('bf')),
            'Escuderia',
            NEW.constructorId
        );
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE USERS
        SET
            Login = NEW.constructorRef || '_c',
            Password = crypt(NEW.constructorRef, gen_salt('bf'))
        WHERE
            IdOriginal = NEW.constructorId AND Tipo = 'Escuderia';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para a tabela de escuderias
CREATE TRIGGER trigger_sync_constructor
AFTER INSERT OR UPDATE ON constructors
FOR EACH ROW EXECUTE FUNCTION sync_constructor_user();