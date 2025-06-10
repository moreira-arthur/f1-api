CREATE OR REPLACE FUNCTION add_driver_if_not_exists(
    p_driver_ref VARCHAR(50),
    p_number SMALLINT,
    p_code VARCHAR(3),
    p_forename VARCHAR(100),
    p_surname VARCHAR(100),
    p_dob DATE,
    p_nationality VARCHAR(50),
    p_url TEXT
)
RETURNS TEXT -- Retorna um texto indicando o resultado
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_id INT;
BEGIN
    -- PASSO 1: Verifica se já existe um piloto com o mesmo nome e sobrenome.
    IF EXISTS (
        SELECT 1 FROM DRIVER d
        WHERE LOWER(d.Forename) = LOWER(p_forename)
          AND LOWER(d.Surname) = LOWER(p_surname)
    ) THEN
        -- Se existir, retorna 'DUPLICATE' e encerra a função.
        RETURN 'DUPLICATE';
    ELSE
        -- PASSO 2: Se não existir, procede com a inserção (lógica da função anterior).
        SELECT COALESCE(MAX(DriverId), 0) + 1 INTO v_new_id FROM DRIVER;

        INSERT INTO DRIVER (
            DriverId, DriverRef, Number, Code, Forename, Surname, DateOfBirth, Nationality, URL
        ) VALUES (
            v_new_id, p_driver_ref, p_number, p_code, p_forename, p_surname, p_dob, p_nationality, p_url
        );
        
        -- Retorna 'INSERTED' para indicar sucesso.
        RETURN 'INSERTED';
    END IF;
END;
$$;