import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('constructor-trigger', 'triggers')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = ` DROP TRIGGER IF EXISTS trigger_sync_constructor ON constructors CASCADE;
    DROP FUNCTION IF EXISTS sync_constructor_user;`
  await knex.raw(sql)
}
