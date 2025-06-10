import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('dashboard_admin', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = `DROP FUNCTION IF EXISTS dashboard_admin_totals;
 DROP FUNCTION IF EXISTS get_races_by_year;  
 DROP FUNCTION IF EXISTS get_constructor_standings_by_year; 
 DROP FUNCTION IF EXISTS get_driver_standings_by_year; `
  await knex.raw(sql)
}
