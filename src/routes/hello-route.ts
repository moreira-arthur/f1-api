import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const helloRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/',
    {
      schema: {
        summary: 'Say Hello Route',
      },
    },
    async (_, reply) => {
      return reply.status(200).send('Hello F1')
    }
  )
}
