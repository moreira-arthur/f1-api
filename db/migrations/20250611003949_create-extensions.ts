import type { Knex } from 'knex'
import { loadSQL } from '../../src/functions/load-sql-file'

export async function up(knex: Knex): Promise<void> {
  const sql = loadSQL('extensions', 'functions')
  await knex.raw(sql)
}

export async function down(knex: Knex): Promise<void> {
  const sql = `DROP EXTENSION IF EXISTS earthdistance;
    DROP EXTENSION IF EXISTS cube;
    DROP EXTENSION IF EXISTS pgcrypto;`
  await knex.raw(sql)
}
