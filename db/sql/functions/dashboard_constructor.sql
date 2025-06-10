CREATE OR REPLACE FUNCTION dashboard_constructor(
    p_constructor_id INT,
    OUT total_vitorias BIGINT,
    OUT total_pilotos BIGINT,
    OUT primeiro_ano SMALLINT,
    OUT ultimo_ano SMALLINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Executa a consulta principal para calcular todas as métricas de uma só vez.
    -- O ID da escuderia agora é usado diretamente no 'WHERE'.
    SELECT
        -- Métrica 1: Contagem de vitórias (onde a posição final é 1)
        COUNT(*) FILTER (WHERE res.Position = 1),

        -- Métrica 2: Contagem de pilotos distintos que correram pela escuderia
        COUNT(DISTINCT res.DriverId),

        -- Métrica 3: Primeiro e último ano de participação
        MIN(r.Year),
        MAX(r.Year)
    INTO
        total_vitorias,
        total_pilotos,
        primeiro_ano,
        ultimo_ano
    FROM
        RESULTS res
    -- Junta com RACES para obter o ano de cada corrida
    JOIN
        RACES r ON res.RaceId = r.RaceId
    WHERE
        res.ConstructorId = p_constructor_id;
END;
$$;