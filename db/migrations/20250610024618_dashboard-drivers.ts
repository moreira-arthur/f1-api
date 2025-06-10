import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('dashboard_drivers', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = `DROP FUNCTION IF EXISTS dashboard_driver_year;
 DROP FUNCTION IF EXISTS dashboard_driver_total;  
 DROP FUNCTION IF EXISTS dashboard_driver_anual; 
 DROP FUNCTION IF EXISTS dashboard_driver_resume_circuit; `
  await knex.raw(sql)
}
