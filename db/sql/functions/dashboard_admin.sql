CREATE OR REPLACE FUNCTION dashboard_admin_totals(
    OUT total_pilots BIGINT,
    OUT total_constructors BIGINT,
    OUT total_seasons BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Calcula os totais de cada entidade contando as linhas das tabelas principais.
    SELECT
        (SELECT COUNT(*) FROM DRIVER),
        (SELECT COUNT(*) FROM CONSTRUCTORS),
        (SELECT COUNT(*) FROM SEASONS)
    INTO
        total_pilots,
        total_constructors,
        total_seasons;
END;
$$;

CREATE OR REPLACE FUNCTION get_races_by_year(p_year SMALLINT)
RETURNS TABLE(
    round SMALLINT,
    race_name VARCHAR(100),
    laps SMALLINT,
    winner_time VARCHAR(12)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Retorna a lista de corridas, buscando o tempo e as voltas do vencedor (Position = 1)
    RETURN QUERY
    SELECT
        r.Round,
        r.Name,
        res.Laps,
        res.Time
    FROM
        RACES r
    JOIN
        RESULTS res ON r.RaceId = res.RaceId
    WHERE
        r.Year = p_year
        AND res.Position = 1  -- Filtra para pegar apenas os dados do vencedor
    ORDER BY
        r.Round;
END;
$$;

CREATE OR REPLACE FUNCTION get_constructor_standings_by_year(p_year SMALLINT)
RETURNS TABLE(
    constructor_name VARCHAR(50),
    total_points DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Soma os pontos de todos os pilotos de cada escuderia no ano especificado.
    RETURN QUERY
    SELECT
        c.Name,
        SUM(res.Points) AS total_points
    FROM
        RESULTS res
    JOIN
        CONSTRUCTORS c ON res.ConstructorId = c.ConstructorID
    JOIN
        RACES r ON res.RaceId = r.RaceId
    WHERE
        r.Year = p_year
    GROUP BY
        c.ConstructorID, c.Name
    ORDER BY
        total_points DESC;
END;
$$;

CREATE OR REPLACE FUNCTION get_driver_standings_by_year(p_year SMALLINT)
RETURNS TABLE(
    driver_name TEXT,
    total_points DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Soma os pontos de cada piloto ao longo da temporada especificada.
    RETURN QUERY
    SELECT
        d.Forename || ' ' || d.Surname AS driver_name,
        SUM(res.Points) AS total_points
    FROM
        RESULTS res
    JOIN
        DRIVER d ON res.DriverId = d.DriverId
    JOIN
        RACES r ON res.RaceId = r.RaceId
    WHERE
        r.Year = p_year
    GROUP BY
        d.DriverId, driver_name
    ORDER BY
        total_points DESC;
END;
$$;
