import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getConstructorDashboard } from '../functions/get-constructor-dashboard'

export const dashboardConstructorRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:constructorId', // Rota para obter os dados do dashboard
    {
      schema: {
        summary: 'Busca os dados de dashboard para uma construtora',
        tags: ['Constructors', 'Dashboard'],
        params: z.object({
          // Valida o ID da construtora na URL
          constructorId: z.coerce
            .number()
            .int()
            .positive('O ID da construtora deve ser um número positivo.'),
        }),
        response: {
          200: z.object({
            total_vitorias: z.coerce.number(),
            total_pilotos: z.coerce.number(),
            primeiro_ano: z.coerce.number(),
            ultimo_ano: z.coerce.number(),
          }),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { constructorId } = request.params
        const dashboardData = await getConstructorDashboard({ constructorId })

        // Se a função retornou null (construtora sem corridas ou ID inválido)
        if (dashboardData === null) {
          return reply.code(404).send({
            error: `Nenhum dado de dashboard encontrado para a construtora com ID ${constructorId}.`,
          })
        }

        // Sucesso
        return reply.code(200).send(dashboardData)
      } catch (error) {
        app.log.error(error, 'Erro na rota de dashboard da construtora')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
