import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getReportAirportsNearCity } from '../functions/get-report-airports-near-city'
import { getReportCircuitRaceStats } from '../functions/get-report-circuit-race-stats'
import { getReportConstructorPilotCount } from '../functions/get-report-constructor-pilot-count'
import { getReportConstructorPilotWins } from '../functions/get-report-constructor-pilot-wins'
import { getReportConstructorStatusCount } from '../functions/get-report-constructor-status-count'
import { getReportDriverPointsByRace } from '../functions/get-report-driver-points-by-race'
import { getReportDriverStatusCount } from '../functions/get-report-driver-status-count'
import { getReportRaceDetailsByCircuit } from '../functions/get-report-race-details-by-circuit'
import { getReportResultsByStatus } from '../functions/get-report-results-by-status'
import { getReportTotalRaceCount } from '../functions/get-report-total-race-count'

export const reportsRoute: FastifyPluginAsyncZod = async app => {
  // REPORT 1
  app.get(
    '/results-by-status', // Rota para obter o relatório
    {
      schema: {
        summary:
          'Gera um relatório com a contagem de resultados por status de finalização',
        tags: ['Reports'],
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              status_description: z.string(),
              total_results: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const report = await getReportResultsByStatus()

        // Se a função retornou null, houve um erro no banco de dados
        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        // Sucesso, retorna o array do relatório
        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(
          error,
          'Erro na rota do relatório de resultados por status'
        )
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  // REPORT 2
  app.get(
    '/airports-near/:cityName', // Rota para obter o relatório
    {
      schema: {
        summary:
          'Busca aeroportos (médios/grandes) em um raio de 100km de uma cidade',
        tags: ['Reports'],
        params: z.object({
          cityName: z.string().min(3, {
            message: 'O nome da cidade deve ter pelo menos 3 caracteres.',
          }),
        }),
        response: {
          200: z.array(
            z.object({
              city_name: z.string(),
              airport_iata_code: z.string(),
              airport_name: z.string(),
              airport_municipality: z.string().nullable(),
              distance_km: z.coerce.number(),
              airport_type: z.string(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { cityName } = request.params
        const report = await getReportAirportsNearCity({ cityName })

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(error, 'Erro na rota do relatório de aeroportos próximos')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  //REPORT 3
  app.get(
    '/constructors-pilot-count', // Rota para obter o relatório
    {
      schema: {
        summary:
          'Gera um relatório com a contagem de pilotos distintos por construtora',
        tags: ['Reports'],
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              constructor_name: z.string(),
              pilot_count: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const report = await getReportConstructorPilotCount()

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(error, 'Erro na rota do relatório de contagem de pilotos')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/total-races', // Rota para obter o relatório
    {
      schema: {
        summary: 'Retorna a contagem total de corridas já realizadas',
        tags: ['Reports'],
        response: {
          200: z.object({
            total_races: z.coerce.number(),
          }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const report = await getReportTotalRaceCount()

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(error, 'Erro na rota de contagem total de corridas')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/circuit-race-stats', // Rota para obter o relatório
    {
      schema: {
        summary: 'Gera um relatório com estatísticas de corrida por circuito',
        tags: ['Reports', 'Circuits'],
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              circuit_id: z.coerce.number(),
              circuit_name: z.string(),
              race_count: z.coerce.number(),
              min_laps: z.coerce.number(),
              avg_laps: z.coerce.number(),
              max_laps: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const report = await getReportCircuitRaceStats()

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(
          error,
          'Erro na rota do relatório de estatísticas de circuito'
        )
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/circuits/:circuitId/races', // Rota para obter o relatório
    {
      schema: {
        summary:
          'Busca os detalhes das corridas realizadas em um circuito específico',
        tags: ['Reports', 'Circuits'],
        params: z.object({
          circuitId: z.coerce
            .number()
            .int()
            .positive('O ID do circuito deve ser um número positivo.'),
        }),
        response: {
          // A resposta de sucesso é um ARRAY de objetos
          200: z.array(
            z.object({
              race_year: z.coerce.number(),
              race_name: z.string(),
              laps: z.coerce.number(),
              winner_time: z.string().nullable(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { circuitId } = request.params
        const report = await getReportRaceDetailsByCircuit({ circuitId })

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(
          error,
          'Erro na rota do relatório de corridas por circuito'
        )
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  // REPORT 4
  app.get(
    '/constructors/:constructorId/pilot-wins', // Rota para obter o relatório
    {
      schema: {
        summary:
          'Busca a contagem de vitórias por piloto para uma construtora específica',
        tags: ['Reports', 'Constructors'],
        params: z.object({
          constructorId: z.coerce
            .number()
            .int()
            .positive('O ID da construtora deve ser um número positivo.'),
        }),
        response: {
          200: z.array(
            z.object({
              pilot_full_name: z.string(),
              win_count: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { constructorId } = request.params
        const report = await getReportConstructorPilotWins({ constructorId })

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(error, 'Erro na rota do relatório de vitórias por piloto')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  // REPORT 5
  app.get(
    '/constructors/:constructorId/status-count', // Rota para obter o relatório
    {
      schema: {
        summary:
          'Busca a contagem de resultados por status para uma construtora específica',
        tags: ['Reports', 'Constructors'],
        params: z.object({
          constructorId: z.coerce
            .number()
            .int()
            .positive('O ID da construtora deve ser um número positivo.'),
        }),
        response: {
          200: z.array(
            z.object({
              status_description: z.string(),
              total_results: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { constructorId } = request.params
        const report = await getReportConstructorStatusCount({ constructorId })

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(
          error,
          'Erro na rota do relatório de status da construtora'
        )
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  // REPORT 6
  app.get(
    // Usando "pilots" para manter consistência com o nome da função SQL
    '/drivers/:driverId/points-by-race',
    {
      schema: {
        summary:
          'Busca um relatório de pontos por corrida para um piloto específico',
        tags: ['Reports', 'Driver'],
        params: z.object({
          driverId: z.coerce
            .number()
            .int()
            .positive('O ID do piloto deve ser um número positivo.'),
        }),
        response: {
          200: z.array(
            z.object({
              race_year: z.coerce.number(),
              race_name: z.string(),
              points_scored: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { driverId } = request.params
        const report = await getReportDriverPointsByRace({ driverId })

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(error, 'Erro na rota do relatório de pontos por corrida')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.get(
    '/drivers/:driverId/status-count',
    {
      schema: {
        summary:
          'Busca a contagem de resultados por status para um piloto específico',
        tags: ['Reports', 'Drivers'],
        params: z.object({
          driverId: z.coerce
            .number()
            .int()
            .positive('O ID do piloto deve ser um número positivo.'),
        }),
        response: {
          200: z.array(
            z.object({
              status_description: z.string(),
              total_results: z.coerce.number(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { driverId } = request.params
        const report = await getReportDriverStatusCount({ driverId })

        if (report === null) {
          return reply
            .code(500)
            .send({ error: 'Ocorreu um erro ao consultar o banco de dados.' })
        }

        return reply.code(200).send(report)
      } catch (error) {
        app.log.error(error, 'Erro na rota do relatório de status do piloto')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
