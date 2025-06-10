-- Índice 1: Otimização geoespacial para a tabela AIRPORTS
-- Usa o método GIST para indexar as coordenadas da Terra.
CREATE INDEX idx_airports_location ON AIRPORTS USING GIST (ll_to_earth(latitudedeg, longitudedeg));

-- Índice 2: Otimização para os filtros de país e tipo na tabela AIRPORTS
CREATE INDEX idx_airports_country_type ON AIRPORTS (isocountry, type);

-- Índice 3 (Bônus): Para encontrar rapidamente a cidade pelo nome na tabela GEOCITIES15K
CREATE INDEX idx_geocities15k_name_lower ON GEOCITIES15K (LOWER(name));

CREATE OR REPLACE FUNCTION report_airports_near_city(p_city_name TEXT)
RETURNS TABLE(
    city_name VARCHAR(255),
    airport_iata_code VARCHAR(3),
    airport_name TEXT,
    airport_municipality TEXT,
    distance_km NUMERIC,
    airport_type VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        city.Name AS city_name,
        ap.IATACode AS airport_iata_code,
        ap.Name AS airport_name,
        ap.Municipality AS airport_municipality,
        -- A distância é calculada aqui para ser exibida no resultado
        ROUND((earth_distance(
            ll_to_earth(city.Lat, city.Long),
            ll_to_earth(ap.LatitudeDeg, ap.LongitudeDeg)
        ) / 1000)::numeric, 2) AS distance_km,
        ap.Type AS airport_type
    FROM
        GEOCITIES15K city, -- Usamos uma junção implícita (cross join)
        AIRPORTS ap      -- que será filtrada de forma eficiente pelo WHERE
    WHERE
        -- Filtro 1: Encontra a(s) cidade(s) pelo nome
        LOWER(city.Name) = LOWER(p_city_name)
        
        -- Filtro 2 (Otimizado): Encontra aeroportos a no máximo 100 Km.
        -- O planejador de consulta do PostgreSQL é inteligente o suficiente para usar
        -- o índice GIST nesta função de distância, tornando a busca muito rápida.
        AND earth_distance(
            ll_to_earth(city.Lat, city.Long),
            ll_to_earth(ap.LatitudeDeg, ap.LongitudeDeg)
        ) <= 100000 -- 100 Km em metros
        
        -- Filtro 3: Apenas aeroportos no Brasil
        AND ap.ISOCountry = 'BR'
        
        -- Filtro 4: Apenas aeroportos de tamanho médio ou grande
        AND ap.Type IN ('medium_airport', 'large_airport')
    ORDER BY
        city_name, distance_km;
END;
$$;