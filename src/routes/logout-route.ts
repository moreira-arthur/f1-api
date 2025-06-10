// logoutRoute.ts

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { log } from '../functions/log-activity'
import { authenticateHook } from '../hooks/auth-hook'

export const logoutRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/',
    {
      preHandler: [authenticateHook],
      schema: {
        summary: 'Logout Route',
        description:
          'Logs out the authenticated user and registers the activity.',
        tags: ['auth'],
        security: [{ bearerAuth: [] }], // Informa ao Swagger/OpenAPI que esta rota precisa de um token

        response: {
          200: z.object({ success: z.string() }),
          500: z.object({ error: z.string() }),
          // O erro 401 (Unauthorized) já é tratado automaticamente pelo app.authenticate
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = request.user.userId
        const logId = await log({ userId, activityType: 'LOGOUT' })

        if (logId) {
          return reply
            .code(200)
            .send({ success: 'Logout realizado com sucesso.' })
        }
        return reply
          .code(500)
          .send({ error: 'Erro ao registrar a atividade de logout.' })
      } catch (error) {
        app.log.error(error, 'Erro na rota de logout')
        return reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
