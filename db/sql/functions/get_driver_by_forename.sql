CREATE OR REPLACE FUNCTION get_driver_by_forename(
    p_forename TEXT,
    p_constructor_name TEXT
)
RETURNS TABLE(
    nome_completo TEXT,
    data_nascimento DATE,
    nacionalidade VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- A cláusula RETURN QUERY executa a consulta e retorna o seu resultado
    RETURN QUERY
    SELECT DISTINCT
        d.Forename || ' ' || d.Surname AS nome_completo,
        d.DateOfBirth AS data_nascimento,
        d.Nationality AS nacionalidade
    FROM
        DRIVER d
    -- Junta com RESULTS para saber qual piloto correu em qual corrida
    JOIN
        RESULTS res ON d.DriverId = res.DriverId
    -- Junta com CONSTRUCTORS para obter o nome da escuderia
    JOIN
        CONSTRUCTORS c ON res.ConstructorId = c.ConstructorID
    WHERE
        -- Compara o primeiro nome do piloto (ignorando maiúsculas/minúsculas)
        LOWER(d.Forename) = LOWER(p_forename)
        -- E compara o nome da escuderia (ignorando maiúsculas/minúsculas)
        AND LOWER(c.Name) = LOWER(p_constructor_name);
END;
$$;