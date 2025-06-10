import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAdminDashboardTotals } from '../functions/get-admin-dashboard'
import { getConstructorStandingsByYear } from '../functions/get-constructors-standings-by-year'
import { getDriverStandingsByYear } from '../functions/get-driver-standings-by-year'
import { getRacesByYear } from '../functions/get-races-by-year'

export const dashboardAdminRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/totals', // Rota que não precisa de parâmetros
    {
      schema: {
        summary: 'Busca os totais gerais para o dashboard de admin',
        tags: ['Admin', 'Dashboard'],
        response: {
          200: z.object({
            total_pilots: z.coerce.number(),
            total_constructors: z.coerce.number(),
            total_seasons: z.coerce.number(),
          }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const totals = await getAdminDashboardTotals()

        // Se a função retornou null (erro de banco de dados)
        if (totals === null) {
          return reply
            .code(500)
            .send({ error: 'Não foi possível obter os totais do dashboard.' })
        }

        // Sucesso
        return reply.code(200).send(totals)
      } catch (error) {
        app.log.error(error, 'Erro na rota de totais do admin')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/races/:year', // Rota para obter as corridas por ano
    {
      schema: {
        summary: 'Busca a lista de corridas de um determinado ano',
        tags: ['Races'],
        params: z.object({
          // Valida o ano na URL, incluindo uma faixa razoável
          year: z.coerce
            .number()
            .int()
            .min(1950)
            .max(2025, 'O ano deve ser válido.'),
        }),
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              round: z.coerce.number(),
              race_name: z.string(),
              laps: z.coerce.number(),
              // O tempo pode ser nulo em alguns casos
              winner_time: z.string().nullable(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { year } = request.params
        const races = await getRacesByYear({ year })

        // Se a função retornou null, houve um erro no banco de dados
        if (races === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        // Sucesso, retorna o array de corridas (pode ser vazio)
        return reply.code(200).send(races)
      } catch (error) {
        app.log.error(error, 'Erro na rota de corridas por ano')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/standings/constructor/:year', // Rota para obter a classificação por ano
    {
      schema: {
        summary: 'Busca a classificação de construtores de um determinado ano',
        tags: ['Standings'],
        params: z.object({
          // Valida o ano na URL, incluindo uma faixa razoável
          year: z.coerce
            .number()
            .int()
            .min(1950)
            .max(2025, 'O ano deve ser válido.'),
        }),
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              constructor_name: z.string(),
              total_points: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { year } = request.params
        const standings = await getConstructorStandingsByYear({ year })

        // Se a função retornou null, houve um erro no banco de dados
        if (standings === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        // Sucesso, retorna o array (pode ser vazio)
        return reply.code(200).send(standings)
      } catch (error) {
        app.log.error(error, 'Erro na rota de classificação de construtores')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/standings/driver/:year', // Rota para obter a classificação de pilotos por ano
    {
      schema: {
        summary: 'Busca a classificação de pilotos de um determinado ano',
        tags: ['Standings'],
        params: z.object({
          // Valida o ano na URL, incluindo uma faixa razoável
          year: z.coerce
            .number()
            .int()
            .min(1950)
            .max(2025, 'O ano deve ser válido.'),
        }),
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              driver_name: z.string(),
              total_points: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { year } = request.params
        const standings = await getDriverStandingsByYear({ year })

        // Se a função retornou null, houve um erro no banco de dados
        if (standings === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        // Sucesso, retorna o array (pode ser vazio)
        return reply.code(200).send(standings)
      } catch (error) {
        app.log.error(error, 'Erro na rota de classificação de pilotos')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
