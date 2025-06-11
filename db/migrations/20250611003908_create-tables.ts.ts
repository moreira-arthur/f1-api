import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  // Carrega e executa o arquivo SQL que contém a definição de todas as tabelas.
  const sql = loadSQL('create-all-tables', 'tables')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  // Executa os comandos DROP na ordem inversa para evitar erros de dependência.
  await knex.raw(`
    DROP TABLE IF EXISTS RESULTS;
    DROP TABLE IF EXISTS QUALIFYING;
    DROP TABLE IF EXISTS PITSTOPS;
    DROP TABLE IF EXISTS LAPTIMES;
    DROP TABLE IF EXISTS DRIVERSTANDINGS;
    DROP TABLE IF EXISTS RACES;
    DROP TABLE IF EXISTS DRIVER;
    DROP TABLE IF EXISTS CONSTRUCTORS;
    DROP TABLE IF EXISTS CIRCUITS;
    DROP TABLE IF EXISTS AIRPORTS;
    DROP TABLE IF EXISTS STATUS;
    DROP TABLE IF EXISTS SEASONS;
    DROP TABLE IF EXISTS COUNTRIES;
    DROP TABLE IF EXISTS GEOCITIES15K;
  `)
}
