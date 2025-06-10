import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('report_7', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = `DROP FUNCTION IF EXISTS report_pilot_status_count;
    DROP INDEX IF EXISTS idx_results_driverid; `
  await knex.raw(sql)
}
