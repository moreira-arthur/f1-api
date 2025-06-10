import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getConstructorDetailsById } from '../functions/get-constructor-details'

export const constructorRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:constructorId/details', // Parâmetro de rota para o ID da construtora
    {
      schema: {
        summary: 'Busca detalhes de uma construtora pelo seu ID',
        tags: ['Constructors'],
        params: z.object({
          // Valida e converte o ID da URL para número
          constructorId: z.coerce
            .number()
            .int()
            .positive('O ID deve ser um número positivo.'),
        }),
        response: {
          200: z.object({
            constructor_name: z.string(),
            // O tipo BIGINT do SQL pode vir como string, então z.coerce.number()
            // garante que o resultado final será um número no JSON.
            pilot_count: z.coerce.number(),
          }),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { constructorId } = request.params

        const details = await getConstructorDetailsById({ constructorId })

        // Se a função retornou null, a construtora não foi encontrada
        if (details === null) {
          return reply.code(404).send({
            error: `Construtora com ID ${constructorId} não encontrada.`,
          })
        }

        // Sucesso, retorna os detalhes
        return reply.code(200).send(details)
      } catch (error) {
        app.log.error(error, 'Erro na rota de detalhes da construtora')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
