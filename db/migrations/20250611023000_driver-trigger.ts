import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('driver-trigger', 'triggers')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql =
    'DROP TRIGGER IF EXISTS trigger_sync_driver ON driver CASCADE; DROP FUNCTION IF EXISTS sync_driver_user;'
  await knex.raw(sql)
}
