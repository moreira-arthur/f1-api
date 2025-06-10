import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('report_4', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = `DROP FUNCTION IF EXISTS report_constructor_pilot_wins;
    DROP INDEX IF EXISTS idx_results_constructor_position; `
  await knex.raw(sql)
}
