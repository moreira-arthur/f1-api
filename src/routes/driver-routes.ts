import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { knex } from '../database'
import { getDriverAndConstructor } from '../functions/get-driver-and-constructor'
import { getDriverByForename } from '../functions/get-driver-by-forename'

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

  app.get(
    // O endpoint da rota. Você pode ajustar conforme sua preferência.
    '/search',
    {
      schema: {
        summary: 'Busca pilotos por nome e construtora',
        tags: ['Drivers'], // Útil para documentação (Swagger/OpenAPI)
        // Validação para os parâmetros da query string
        querystring: z.object({
          forename: z.string({
            required_error: 'O primeiro nome (forename) é obrigatório.',
          }),
          constructorName: z.string({
            required_error:
              'O nome da construtora (constructorName) é obrigatório.',
          }),
        }),
        response: {
          // Resposta de sucesso: um array de objetos de piloto
          200: z.array(
            z.object({
              nome_completo: z.string(),
              data_nascimento: z.date(), // Em JSON, datas são tipicamente strings no formato ISO
              nacionalidade: z.string(),
            })
          ),
          // Resposta para quando nenhum piloto é encontrado
          404: z.object({
            error: z.string(),
          }),
          // Resposta para erro interno do servidor
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        // Extrai os parâmetros da query string da requisição
        const { forename, constructorName } = request.query

        // Chama a função que interage com o banco de dados
        const drivers = await getDriverByForename({ forename, constructorName })
        console.log(drivers)

        // A função retorna `null` se houver um erro de banco de dados
        if (drivers === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        // A função retorna um array vazio `[]` se a busca não encontrar resultados
        if (drivers.length === 0) {
          return reply.code(404).send({
            error: 'Nenhum piloto encontrado com os critérios fornecidos.',
          })
        }

        // Se encontrou, retorna os dados com o status 200 OK
        return reply.code(200).send(drivers)
      } catch (error) {
        app.log.error(error, 'Erro na rota de busca de pilotos')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/:driverId/details', // :driverId é um parâmetro de rota
    {
      schema: {
        summary: 'Busca nome do piloto e sua última construtora',
        tags: ['Drivers'],
        // Validação para o parâmetro que vem na URL
        params: z.object({
          // z.coerce.number() força a conversão do parâmetro (que é string) para número
          driverId: z.coerce
            .number()
            .int()
            .positive('O ID do piloto deve ser um número positivo.'),
        }),
        response: {
          200: z.object({
            pilot_full_name: z.string(),
            // A construtora pode ser nula se o piloto não tiver corridas
            current_constructor_name: z.string().nullable(),
          }),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        // Extrai o parâmetro da URL
        const { driverId } = request.params

        const details = await getDriverAndConstructor({ driverId })

        // Se a função retornou null, significa que o piloto não foi encontrado
        if (details === null) {
          return reply
            .code(404)
            .send({ error: `Piloto com ID ${driverId} não encontrado.` })
        }

        // Sucesso, retorna os detalhes
        return reply.code(200).send(details)
      } catch (error) {
        app.log.error(error, 'Erro na rota de detalhes do piloto')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
