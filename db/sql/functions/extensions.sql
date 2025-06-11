-- Habilita o tipo de dado 'cube', que é uma dependência do earthdistance
CREATE EXTENSION IF NOT EXISTS cube;
-- Habilita as funções de cálculo de distância na superfície da Terra
CREATE EXTENSION IF NOT EXISTS earthdistance;

CREATE EXTENSION IF NOT EXISTS pgcrypto;