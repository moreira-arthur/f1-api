import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { knex } from '../database'

export const driverRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/all',
    {
      schema: {
        summary: 'Retrive all drivers from the database',
      },
    },
    async (_, reply) => {
      const drivers = await knex.raw('select * from driver')
      return reply.status(200).send({ drivers })
    }
  )
}
