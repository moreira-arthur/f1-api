CREATE OR REPLACE FUNCTION dashboard_driver_year(
    p_driver_id INT,
    OUT primeiro_ano INT,
    OUT ultimo_ano INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Calcula o primeiro e o último ano de atividade do piloto
    -- com base no seu ID, que agora é fornecido diretamente.
    SELECT
        MIN(r.Year),
        MAX(r.Year)
    INTO
        primeiro_ano,
        ultimo_ano
    FROM
        RESULTS res
    JOIN
        RACES r ON res.RaceId = r.RaceId
    WHERE
        res.DriverId = p_driver_id;
END;
$$;


CREATE OR REPLACE FUNCTION dashboard_driver_total(
    p_driver_id INT,
    OUT total_pontos DECIMAL,
    OUT total_vitorias BIGINT,
    OUT total_corridas BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Calcula os agregados totais da carreira usando o DriverId diretamente.
    -- Se o p_driver_id não existir na tabela RESULTS, SUM retornará NULL e COUNT retornará 0.
    SELECT
        SUM(res.Points),
        COUNT(*) FILTER (WHERE res.Position = 1),
        COUNT(*)
    INTO
        total_pontos,
        total_vitorias,
        total_corridas
    FROM
        RESULTS res
    WHERE
        res.DriverId = p_driver_id;
END;
$$;

CREATE OR REPLACE FUNCTION dashboard_driver_anual(
    p_driver_id INT
)
RETURNS TABLE(
    ano SMALLINT,
    pontos_no_ano DECIMAL,
    vitorias_no_ano BIGINT,
    corridas_no_ano BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Retorna a consulta com estatísticas agrupadas por ano.
    -- Se o p_driver_id não existir, a função retornará uma tabela vazia.
    RETURN QUERY
    SELECT
        r.Year AS ano,
        SUM(res.Points) AS pontos_no_ano,
        COUNT(*) FILTER (WHERE res.Position = 1) AS vitorias_no_ano,
        COUNT(res.RaceId) AS corridas_no_ano
    FROM
        RESULTS res
    JOIN
        RACES r ON res.RaceId = r.RaceId
    WHERE
        res.DriverId = p_driver_id
    GROUP BY
        r.Year
    ORDER BY
        ano;
END;
$$;

CREATE OR REPLACE FUNCTION dashboard_driver_resume_circuit(
    p_driver_id INT
)
RETURNS TABLE(
    circuito VARCHAR(100),
    pontos_obtidos_no_circuito DECIMAL,
    vitorias_no_circuito BIGINT,
    corridas_no_circuito BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Retorna a consulta com estatísticas agrupadas apenas por circuito.
    RETURN QUERY
    SELECT
        c.Name AS circuito,
        SUM(res.Points) AS pontos_obtidos_no_circuito,
        COUNT(*) FILTER (WHERE res.Position = 1) AS vitorias_no_circuito,
        COUNT(res.RaceId) AS corridas_no_circuito
    FROM
        RESULTS res
    JOIN
        RACES r ON res.RaceId = r.RaceId
    JOIN
        CIRCUITS c ON r.CircuitId = c.CircuitID
    WHERE
        res.DriverId = p_driver_id
    GROUP BY
        c.Name  -- Agrupamento corrigido para ser apenas por nome do circuito
    ORDER BY
        circuito;
END;
$$;



