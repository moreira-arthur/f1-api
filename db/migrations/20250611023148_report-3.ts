import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('report_3', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = `DROP FUNCTION IF EXISTS report_constructors_pilot_count;
 DROP FUNCTION IF EXISTS report_total_race_count;  
 DROP FUNCTION IF EXISTS report_circuit_race_stats; 
 DROP FUNCTION IF EXISTS report_race_details_by_circuit; `
  await knex.raw(sql)
}
