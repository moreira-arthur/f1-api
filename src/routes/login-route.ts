import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { log } from '../functions/log-activity'
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
          200: z.object({ message: z.string(), token: z.string() }),
          400: z.object({ error: z.string() }),
          401: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { user, password } = request.body
        if (!user || !password) {
          return reply
            .code(400)
            .send({ error: 'Login e senha são obrigatórios.' })
        }

        const loggedUser = await login({ user, password })
        if (!loggedUser) {
          return reply.code(401).send({ error: 'Credenciais inválidas.' })
        }

        const payload = {
          userId: loggedUser.userid,
          tipo: loggedUser.tipo,
          idOriginal: loggedUser.idoriginal,
        }
        // console.log(payload)
        const token = app.jwt.sign(payload, { expiresIn: '1h' })

        await log({ userId: loggedUser.userid, activityType: 'LOGIN' })

        reply.code(200).send({ message: 'Login bem-sucedido!', token: token })
      } catch (error) {
        app.log.error(error, 'Erro na rota de login')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
