import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getDriverActiveYears } from '../functions/get-driver-active-year'
import { getDriverAnnualStats } from '../functions/get-driver-annual-stats'
import { getDriverCareerTotals } from '../functions/get-driver-career-totals'
import { getDriverCircuitResume } from '../functions/get-driver-circuit-resume'

export const dashboardDriverRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:driverId/active-years', // Rota para obter o período de atividade
    {
      schema: {
        summary: 'Busca o primeiro e último ano de atividade de um piloto',
        tags: ['Driver', 'Dashboard'],
        params: z.object({
          // Valida o ID do piloto na URL
          driverId: z.coerce
            .number()
            .int()
            .positive('O ID do piloto deve ser um número positivo.'),
        }),
        response: {
          200: z.object({
            // Como a função retorna INT, z.coerce.number() é uma escolha segura.
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
        const { driverId } = request.params
        const years = await getDriverActiveYears({ driverId })

        // Se a função retornou null (piloto sem corridas ou ID inválido)
        if (years === null) {
          return reply.code(404).send({
            error: `Nenhum registro de atividade encontrado para o piloto com ID ${driverId}.`,
          })
        }

        // Sucesso
        return reply.code(200).send(years)
      } catch (error) {
        app.log.error(error, 'Erro na rota de anos de atividade')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/:driverId/career-totals', // Rota para obter os totais da carreira
    {
      schema: {
        summary:
          'Busca os totais da carreira de um piloto (pontos, vitórias, corridas)',
        tags: ['Driver', 'Dashboard'],
        params: z.object({
          // Valida o ID do piloto na URL
          driverId: z.coerce
            .number()
            .int()
            .positive('O ID do piloto deve ser um número positivo.'),
        }),
        response: {
          200: z.object({
            // z.coerce.number() é uma escolha segura para os tipos DECIMAL e BIGINT
            total_pontos: z.coerce.number(),
            total_vitorias: z.coerce.number(),
            total_corridas: z.coerce.number(),
          }),
          404: z.object({ error: z.string() }), // Embora a função sempre retorne dados, mantemos o padrão.
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { driverId } = request.params
        const totals = await getDriverCareerTotals({ driverId })

        // A função deve sempre retornar um resultado, mas verificamos por segurança.
        if (totals === null) {
          // Este caso ocorreria principalmente por um erro interno não capturado.
          return reply.code(404).send({
            error: `Não foi possível obter os totais para o piloto com ID ${driverId}.`,
          })
        }

        // Sucesso
        return reply.code(200).send(totals)
      } catch (error) {
        app.log.error(error, 'Erro na rota de totais da carreira')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/:driverId/annual-stats', // Rota para obter as estatísticas anuais
    {
      schema: {
        summary: 'Busca as estatísticas anuais de um piloto',
        tags: ['Driver', 'Dashboard'],
        params: z.object({
          // Valida o ID do piloto na URL
          driverId: z.coerce
            .number()
            .int()
            .positive('O ID do piloto deve ser um número positivo.'),
        }),
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              ano: z.coerce.number(),
              pontos_no_ano: z.coerce.number(),
              vitorias_no_ano: z.coerce.number(),
              corridas_no_ano: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { driverId } = request.params
        const annualStats = await getDriverAnnualStats({ driverId })

        // Se a função retornou null, houve um erro no banco de dados
        if (annualStats === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        // Sucesso, retorna o array (pode estar vazio, o que é um resultado válido)
        return reply.code(200).send(annualStats)
      } catch (error) {
        app.log.error(error, 'Erro na rota de estatísticas anuais')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/:driverId/circuit-resume', // Rota para obter o resumo por circuito
    {
      schema: {
        summary: 'Busca o resumo de desempenho de um piloto por circuito',
        tags: ['Driver', 'Dashboard'],
        params: z.object({
          // Valida o ID do piloto na URL
          driverId: z.coerce
            .number()
            .int()
            .positive('O ID do piloto deve ser um número positivo.'),
        }),
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              circuito: z.string(),
              pontos_obtidos_no_circuito: z.coerce.number(),
              vitorias_no_circuito: z.coerce.number(),
              corridas_no_circuito: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { driverId } = request.params
        const circuitResume = await getDriverCircuitResume({ driverId })

        // Se a função retornou null, houve um erro no banco de dados
        if (circuitResume === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        // Sucesso, retorna o array de resultados (pode ser vazio, o que é um resultado válido)
        return reply.code(200).send(circuitResume)
      } catch (error) {
        app.log.error(error, 'Erro na rota de resumo por circuito')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
