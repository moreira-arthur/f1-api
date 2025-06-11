import { type Knex, knex as setupKnex } from 'knex'
import { env } from './env/index'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
}

export const knex = setupKnex(config)
