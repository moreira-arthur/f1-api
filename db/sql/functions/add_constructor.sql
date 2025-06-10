CREATE OR REPLACE FUNCTION add_constructor(
    p_constructor_ref VARCHAR(50),
    p_name VARCHAR(50),
    p_nationality VARCHAR(50),
    p_url TEXT
)
RETURNS TABLE(new_constructor_id INT) -- Retorna o ID em uma tabela para consistência
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_id INT;
BEGIN
    -- Calcula o próximo ID disponível para evitar colisões.
    -- COALESCE trata o caso de a tabela estar vazia.
    SELECT COALESCE(MAX(ConstructorID), 0) + 1 INTO v_new_id FROM CONSTRUCTORS;

    -- Insere a nova escuderia na tabela com o ID calculado.
    INSERT INTO CONSTRUCTORS (ConstructorID, ConstructorRef, Name, Nationality, URL)
    VALUES (v_new_id, p_constructor_ref, p_name, p_nationality, p_url);

    -- Retorna o ID da nova escuderia como confirmação.
    RETURN QUERY SELECT v_new_id;
END;
$$;