import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { addConstructor } from '../functions/add-constructor'
import { getConstructorDetailsById } from '../functions/get-constructor-details'
import { authenticateHook } from '../hooks/auth-hook'

export const constructorRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/', // O endpoint para criar novas construtoras
    {
      // Operações de escrita devem ser protegidas
      // preHandler: [authenticateHook],
      schema: {
        summary: 'Cadastra uma nova construtora (escuderia)',
        tags: ['Constructors'],
        security: [{ bearerAuth: [] }], // Protegida por autenticação
        // Validação dos dados enviados no corpo da requisição
        body: z.object({
          constructorRef: z.string().min(1, 'A referência é obrigatória.'),
          name: z.string().min(1, 'O nome é obrigatório.'),
          nationality: z.string().min(1, 'A nacionalidade é obrigatória.'),
          url: z.string().url({ message: 'URL inválida.' }),
        }),
        response: {
          // Status 201 Created é o ideal para sucesso em criação
          201: z.object({
            message: z.string(),
            constructorId: z.number(),
          }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { constructorRef, name, nationality, url } = request.body
        const result = await addConstructor({
          constructorRef: constructorRef.toLowerCase(),
          name,
          nationality,
          url,
        })

        if (result?.new_constructor_id) {
          return reply
            .code(201) // Retorna 201 Created
            .send({
              message: 'Construtora cadastrada com sucesso!',
              constructorId: result.new_constructor_id,
            })
        }

        return reply
          .code(500)
          .send({ error: 'Não foi possível cadastrar a construtora.' })
      } catch (error) {
        app.log.error(error, 'Erro na rota de cadastro de construtora')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

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
