import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('populate-users', 'inserts')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = loadSQL('unpopulate-users', 'deletes')
  await knex.raw(sql)
}
