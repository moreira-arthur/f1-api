CREATE OR REPLACE FUNCTION add_driver(
    p_driver_ref VARCHAR(50),
    p_number SMALLINT,
    p_code VARCHAR(3),
    p_forename VARCHAR(100),
    p_surname VARCHAR(100),
    p_dob DATE,
    p_nationality VARCHAR(50),
    p_url TEXT
)
RETURNS TABLE(new_driver_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_id INT;
BEGIN
    -- Calcula o próximo ID disponível para o novo piloto.
    SELECT COALESCE(MAX(DriverId), 0) + 1 INTO v_new_id FROM DRIVER;

    -- Insere o novo piloto na tabela DRIVER.
    INSERT INTO DRIVER (
        DriverId, DriverRef, Number, Code, Forename, Surname, DateOfBirth, Nationality, URL
    ) VALUES (
        v_new_id, p_driver_ref, p_number, p_code, p_forename, p_surname, p_dob, p_nationality, p_url
    );

    -- Retorna o ID do novo piloto como confirmação.
    RETURN QUERY SELECT v_new_id;
END;
$$;