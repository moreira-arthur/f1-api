-- Este índice acelera a busca por todos os resultados de um piloto específico
-- e filtra rapidamente apenas as corridas em que ele pontuou.
CREATE INDEX IF NOT EXISTS idx_results_driver_points
ON RESULTS (DriverId, Points);

CREATE OR REPLACE FUNCTION report_pilot_points_by_race(p_driver_id INT)
RETURNS TABLE(
    race_year SMALLINT,
    race_name VARCHAR(100),
    points_scored DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Retorna uma lista detalhada de cada corrida em que o piloto pontuou.
    RETURN QUERY
    SELECT
        r.Year AS race_year,
        r.Name AS race_name,
        res.Points AS points_scored
    FROM
        RESULTS res
    -- Une com a tabela RACES para obter o ano e o nome da corrida.
    JOIN
        RACES r ON res.RaceId = r.RaceId
    WHERE
        -- Filtro 1: Restringe os resultados ao piloto logado.
        res.DriverId = p_driver_id
        -- Filtro 2: Seleciona apenas as corridas onde houve pontuação.
        AND res.Points > 0
    ORDER BY
        -- Organiza o resultado cronologicamente.
        race_year, r.Round;
END;
$$;