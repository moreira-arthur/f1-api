set search_path to f1;
-- Este índice otimiza a busca por um construtor específico
-- e a filtragem por posição (para encontrar as vitórias).
CREATE INDEX IF NOT EXISTS idx_results_constructor_position
ON RESULTS (ConstructorId, Position);

CREATE OR REPLACE FUNCTION report_constructor_pilot_wins(p_constructor_id INT)
RETURNS TABLE(
    pilot_full_name TEXT,
    win_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Retorna a lista de pilotos e sua contagem de vitórias para a escuderia especificada.
    RETURN QUERY
    SELECT
        d.Forename || ' ' || d.Surname AS pilot_full_name,
        -- Conta apenas as corridas em que a posição final foi 1.
        -- O FILTER é a forma mais eficiente e moderna de fazer uma contagem condicional.
        COUNT(*) FILTER (WHERE res.Position = 1) AS win_count
    FROM
        RESULTS res
    -- Une com a tabela DRIVER para obter o nome completo do piloto.
    JOIN
        DRIVER d ON res.DriverId = d.DriverId
    WHERE
        -- Filtra os resultados para apenas a escuderia desejada.
        res.ConstructorId = p_constructor_id
    GROUP BY
        -- Agrupa os resultados por piloto para que a contagem funcione corretamente.
        d.DriverId, pilot_full_name
    ORDER BY
        -- Ordena o resultado para mostrar os pilotos com mais vitórias primeiro.
        win_count DESC, pilot_full_name;
END;
$$;