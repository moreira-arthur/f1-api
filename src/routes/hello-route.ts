import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { loadSQL } from '../functions/load-sql-file'

export const helloRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/',
    {
      schema: {
        summary: 'Say Hello Route',
      },
    },
    async (_, reply) => {
      const sql = loadSQL('create-user-table', 'tables')
      return reply.status(200).send({ sql })
    }
  )
}
