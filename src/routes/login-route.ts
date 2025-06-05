import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { loadSQL } from '../functions/load-sql-file'
import { login } from '../functions/login'

export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/',
    {
      schema: {
        summary: 'Authentication Route',
        body: z.object({
          user: z.string(),
          password: z.string(),
        }),
        response: {
          201: z.object({ success: z.boolean() }),
        },
      },
    },
    async (request, reply) => {
      const { user, password } = request.body

      const success = await login({ user, password })
      return reply.status(200).send({ success })
    }
  )
}
