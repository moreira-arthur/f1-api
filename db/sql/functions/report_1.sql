CREATE OR REPLACE FUNCTION report_results_by_status()
RETURNS TABLE(
    status_description VARCHAR(50),
    total_results BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Retorna a contagem de resultados de corrida, agrupados por cada status.
    RETURN QUERY
    SELECT
        s.Status AS status_description,
        COUNT(res.ResultId) AS total_results
    FROM
        RESULTS res
    JOIN
        STATUS s ON res.StatusId = s.StatusId
    GROUP BY
        s.Status
    ORDER BY
        total_results DESC, status_description;
END;
$$;