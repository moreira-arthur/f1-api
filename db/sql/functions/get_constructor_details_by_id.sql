CREATE OR REPLACE FUNCTION get_constructor_details_by_id(
    p_constructor_id INT,
    OUT constructor_name VARCHAR(50),
    OUT pilot_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Seleciona o nome do construtor e conta a quantidade de pilotos distintos
    -- associados a ele na tabela de resultados.
    SELECT
        c.Name,
        -- Conta os IDs de pilotos únicos. Se não houver pilotos, o LEFT JOIN
        -- garante que a contagem será 0, em vez de não retornar nada.
        COUNT(DISTINCT res.DriverId)
    INTO
        constructor_name,
        pilot_count
    FROM
        CONSTRUCTORS c
    -- LEFT JOIN é usado para incluir construtores que possam não ter resultados
    LEFT JOIN
        RESULTS res ON c.ConstructorID = res.ConstructorId
    WHERE
        c.ConstructorID = p_constructor_id
    GROUP BY
        -- É necessário agrupar pelo nome do construtor por causa da função de agregação COUNT
        c.Name;
END;
$$;