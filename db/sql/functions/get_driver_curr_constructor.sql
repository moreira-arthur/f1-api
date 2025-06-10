CREATE OR REPLACE FUNCTION get_pilot_and_curr_constructor(
    p_driver_id INT,
    OUT pilot_full_name TEXT,
    OUT latest_constructor_name VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Esta consulta une as tabelas necessárias, ordena pela corrida mais recente
    -- e seleciona o nome do piloto e da escuderia da primeira linha encontrada.
    SELECT
        d.Forename || ' ' || d.Surname,
        c.Name
    INTO
        pilot_full_name,
        latest_constructor_name
    FROM
        RESULTS res
    JOIN
        DRIVER d ON res.DriverId = d.DriverId
    JOIN
        RACES r ON res.RaceId = r.RaceId
    JOIN
        CONSTRUCTORS c ON res.ConstructorId = c.ConstructorID
    WHERE
        res.DriverId = p_driver_id
    -- Ordena pelo ano e depois pela rodada para encontrar a corrida mais recente
    ORDER BY
        r.Year DESC, r.Round DESC
    -- Pega apenas o resultado mais recente
    LIMIT 1;
END;
$$;