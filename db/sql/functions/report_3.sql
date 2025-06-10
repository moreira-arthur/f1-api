CREATE OR REPLACE FUNCTION report_constructors_pilot_count()
RETURNS TABLE(
    constructor_name VARCHAR(50),
    pilot_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.Name AS constructor_name,
        -- Conta os pilotos distintos para cada construtor
        COUNT(DISTINCT res.DriverId) AS pilot_count
    FROM
        CONSTRUCTORS c
    -- Usamos LEFT JOIN para garantir que escuderias sem resultados (pilotos) também apareçam
    LEFT JOIN
        RESULTS res ON c.ConstructorID = res.ConstructorId
    GROUP BY
        c.ConstructorID, c.Name
    ORDER BY
        constructor_name;
END;
$$;

CREATE OR REPLACE FUNCTION report_total_race_count(
    OUT total_races BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Conta todas as entradas na tabela de corridas
    SELECT COUNT(*) INTO total_races FROM RACES;
END;
$$;

-- Adicionamos circuit_id à lista de colunas retornadas
CREATE OR REPLACE FUNCTION report_circuit_race_stats()
RETURNS TABLE(
    circuit_id INT, -- ADICIONADO AQUI
    circuit_name VARCHAR(100),
    race_count BIGINT,
    min_laps SMALLINT,
    avg_laps NUMERIC,
    max_laps SMALLINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.CircuitID AS circuit_id, -- ADICIONADO AQUI
        c.Name AS circuit_name,
        COUNT(DISTINCT r.RaceId) AS race_count,
        MIN(res.Laps)::SMALLINT AS min_laps,
        ROUND(AVG(res.Laps), 2) AS avg_laps,
        MAX(res.Laps)::SMALLINT AS max_laps
    FROM
        CIRCUITS c
    JOIN
        RACES r ON c.CircuitID = r.CircuitId
    JOIN
        RESULTS res ON r.RaceId = res.RaceId AND res.Position = 1
    GROUP BY
        c.CircuitID, c.Name
    ORDER BY
        circuit_name;
END;
$$;

CREATE OR REPLACE FUNCTION report_race_details_by_circuit(p_circuit_id INT)
RETURNS TABLE(
    race_year SMALLINT,
    race_name VARCHAR(100),
    laps SMALLINT,
    winner_time VARCHAR(12)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.Year AS race_year,
        r.Name AS race_name,
        res.Laps,
        res.Time AS winner_time
    FROM
        RACES r
    JOIN
        RESULTS res ON r.RaceId = res.RaceId
    WHERE
        r.CircuitId = p_circuit_id
        AND res.Position = 1 -- Filtra para pegar os dados do vencedor
    ORDER BY
        race_year;
END;
$$;