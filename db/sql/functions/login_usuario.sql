CREATE OR REPLACE FUNCTION login_usuario(
    p_login VARCHAR,
    p_password TEXT
)
RETURNS TABLE (
    userid INTEGER,
    login VARCHAR,
    tipo VARCHAR,
    idoriginal INTEGER
) AS $$
BEGIN
    -- RETURN QUERY executa a query e retorna o seu resultado
    RETURN QUERY
    SELECT
        u.Userid,
        u.Login,
        u.Tipo,
        u.IdOriginal
    FROM
        USERS AS u
    WHERE
        u.Login = p_login AND
        u.Password = crypt(p_password, u.Password);
END;
$$ LANGUAGE plpgsql;