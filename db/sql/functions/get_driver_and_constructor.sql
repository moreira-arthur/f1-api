CREATE OR REPLACE FUNCTION get_driver_and_constructor(
    p_driver_id INT,
    OUT pilot_full_name TEXT,
    OUT current_constructor_name VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_constructor_id INT;
BEGIN
    -- 1. Busca o nome completo do piloto usando o ID fornecido.
    SELECT
        d.Forename || ' ' || d.Surname
    INTO
        pilot_full_name
    FROM
        DRIVER d
    WHERE
        d.DriverId = p_driver_id;

    -- Se o piloto não for encontrado, o nome ficará nulo e a função terminará.

    -- 2. Encontra a escuderia da corrida mais recente do piloto.
    SELECT
        res.ConstructorId
    INTO
        v_constructor_id
    FROM
        RESULTS res
    JOIN
        RACES r ON res.RaceId = r.RaceId
    WHERE
        res.DriverId = p_driver_id
    ORDER BY
        r.Year DESC, r.Round DESC
    LIMIT 1;

    -- 3. Com o ID da escuderia, busca o seu nome.
    --    Se o piloto não tiver corridas, v_constructor_id será nulo e esta parte não executa.
    IF v_constructor_id IS NOT NULL THEN
        SELECT
            c.Name
        INTO
            current_constructor_name
        FROM
            CONSTRUCTORS c
        WHERE
            c.ConstructorID = v_constructor_id;
    END IF;

END;
$$;
