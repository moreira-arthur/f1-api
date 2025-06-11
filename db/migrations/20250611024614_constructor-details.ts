import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('get_constructor_details_by_id', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = 'DROP FUNCTION IF EXISTS get_constructor_details_by_id;'
  await knex.raw(sql)
}
