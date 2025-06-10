CREATE OR REPLACE FUNCTION log_register(
    p_userid INTEGER,
    p_activity_type VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
    new_log_id INTEGER;
BEGIN
    -- A tabela UsersLog já tem um CHECK para garantir que ActivityType
    -- seja 'LOGIN' ou 'LOGOUT', então o banco de dados validará a entrada.

    INSERT INTO UsersLog (UserId, ActivityType)
    VALUES (p_userid, p_activity_type)
    RETURNING LogId INTO new_log_id; -- Retorna o ID do novo log para a variável

    RETURN new_log_id;
END;
$$ LANGUAGE plpgsql;