CREATE OR REPLACE FUNCTION report_constructor_status_count(p_constructor_id INT)
RETURNS TABLE(
    status_description VARCHAR(50),
    total_results BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Retorna a contagem de resultados de corrida, agrupados por cada status,
    -- para a escuderia especificada.
    RETURN QUERY
    SELECT
        s.Status AS status_description,
        COUNT(res.ResultId) AS total_results
    FROM
        RESULTS res
    -- Une com a tabela STATUS para obter a descrição.
    JOIN
        STATUS s ON res.StatusId = s.StatusId
    WHERE
        -- A cláusula principal que limita os resultados à escuderia desejada.
        res.ConstructorId = p_constructor_id
    GROUP BY
        s.Status
    ORDER BY
        -- Ordena para mostrar os status mais comuns primeiro.
        total_results DESC, status_description;
END;
$$;