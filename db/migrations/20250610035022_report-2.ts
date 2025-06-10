import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('report_2', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = `DROP FUNCTION IF EXISTS report_airports_near_city;
 DROP INDEX IF EXISTS idx_airports_location;  
 DROP INDEX IF EXISTS idx_airports_country_type; 
 DROP INDEX IF EXISTS idx_geocities15k_name_lower; `
  await knex.raw(sql)
}
