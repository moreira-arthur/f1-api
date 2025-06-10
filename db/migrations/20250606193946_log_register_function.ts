import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('log_register', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = 'DROP FUNCTION IF EXISTS log_register;'
  await knex.raw(sql)
}
