import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { knex } from '../database'
import { addDriver } from '../functions/add-drivers'
import { getDriverAndConstructor } from '../functions/get-driver-and-constructor'
import { getDriverByForename } from '../functions/get-driver-by-forename'
import { getDriverAndCurrConstructor } from '../functions/get-driver-curr-constructor'
import { authenticateHook } from '../hooks/auth-hook'

export const driverRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/', // Endpoint para criar novos pilotos
    {
      // preHandler: [authenticateHook], // Rota protegida
      schema: {
        summary: 'Cadastra um novo piloto',
        tags: ['Drivers'],
        security: [{ bearerAuth: [] }],
        body: z.object({
          driverRef: z.string().min(1, 'A referência é obrigatória.'),
          number: z.number().int().nullable().optional(),
          code: z
            .string()
            .length(3, 'O código deve ter 3 letras.')
            .toUpperCase()
            .nullable()
            .optional(),
          forename: z.string().min(1, 'O primeiro nome é obrigatório.'),
          surname: z.string().min(1, 'O sobrenome é obrigatório.'),
          dateOfBirth: z
            .string()
            .date('Formato de data inválido. Use AAAA-MM-DD.'),
          nationality: z.string().min(1, 'A nacionalidade é obrigatória.'),
          url: z.string().url('URL inválida.').optional(), // URL é opcional
        }),
        response: {
          201: z.object({
            message: z.string(),
            driverId: z.number(),
          }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const {
          driverRef,
          number = null, // Valor padrão nulo se não for fornecido
          code = null, // Valor padrão nulo se não for fornecido
          forename,
          surname,
          dateOfBirth,
          nationality,
          url = null, // Valor padrão nulo se não for fornecido
        } = request.body

        const result = await addDriver({
          driverRef,
          number,
          code,
          forename,
          surname,
          dateOfBirth,
          nationality,
          url,
        })

        if (result?.new_driver_id) {
          return reply.code(201).send({
            message: 'Piloto cadastrado com sucesso!',
            driverId: result.new_driver_id,
          })
        }

        return reply
          .code(500)
          .send({ error: 'Não foi possível cadastrar o piloto.' })
      } catch (error) {
        app.log.error(error, 'Erro na rota de cadastro de piloto')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )

  app.post(
    '/upload-stream', // Criei um novo endpoint para não conflitar com o anterior
    {
      // preHandler: [authenticateHook],
      schema: {
        summary:
          'Cadastra múltiplos pilotos via stream a partir de um arquivo CSV',
        tags: ['Drivers'],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            message: z.string(),
            insertedCount: z.number(),
            duplicateCount: z.number(),
            errorCount: z.number(),
            duplicates: z.array(z.string()),
            errors: z.array(z.string()),
          }),
          400: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const file = await request.file()
      if (!file) {
        return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })
      }

      let insertedCount = 0
      let duplicateCount = 0
      let errorCount = 0
      const duplicates: string[] = []
      const errors: string[] = []

      // Variável para guardar o pedaço de linha que sobrou do chunk anterior
      let leftover = ''

      try {
        // Usamos 'for await...of' para consumir o stream de forma assíncrona
        // Isso processa o arquivo chunk por chunk, sem estourar a memória
        for await (const chunk of file.file) {
          const chunkStr = leftover + chunk.toString('utf-8')
          const lines = chunkStr.split('\n')

          // O último item do array pode ser uma linha incompleta, guardamos para o próximo chunk
          leftover = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() === '') continue

            const fields = line.split(',').map(field => field.trim())

            // Verificação de formato básico da linha
            if (fields.length < 7) {
              errorCount++
              errors.push(`Linha com formato inválido: ${line}`)
              continue
            }

            const [
              driverRef,
              numberStr,
              code,
              forename,
              surname,
              dob,
              nationality,
              url,
            ] = fields
            const fullName = `${forename} ${surname}`

            try {
              const result = await knex.raw(
                'SELECT * FROM add_driver_if_not_exists(?, ?, ?, ?, ?, ?, ?, ?)',
                [
                  driverRef,
                  numberStr && numberStr !== ''
                    ? Number.parseInt(numberStr, 10)
                    : null,
                  code || null,
                  forename,
                  surname,
                  dob,
                  nationality,
                  url || null,
                ]
              )

              const status = result.rows[0]?.add_driver_if_not_exists

              if (status === 'INSERTED') {
                insertedCount++
              } else if (status === 'DUPLICATE') {
                duplicateCount++
                duplicates.push(fullName)
              }
            } catch (dbError) {
              errorCount++
              errors.push(`Erro no banco para a linha: ${line}`)
              app.log.error(dbError, `Falha ao processar a linha: ${line}`)
            }
          }
        }

        // Se sobrou algum texto após o loop (arquivo não termina com \n), processe-o
        if (leftover.trim() !== '') {
          // ... (aqui você poderia duplicar a lógica de processamento de linha para o 'leftover')
          // Mas para simplicidade, vamos assumir que o arquivo termina com uma nova linha.
        }

        return reply.code(200).send({
          message: 'Processamento do arquivo concluído.',
          insertedCount,
          duplicateCount,
          errorCount,
          duplicates,
          errors,
        })
      } catch (error) {
        app.log.error(error, 'Erro de stream ao processar o arquivo de pilotos')
        return reply.code(500).send({
          error: 'Erro interno no servidor durante o processamento do arquivo.',
        })
      }
    }
  )

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

  app.get(
    '/:driverId/current-constructor',
    {
      schema: {
        summary: 'Busca o nome do piloto e sua construtora mais recente',
        tags: ['Pilots', 'Constructors'],
        params: z.object({
          driverId: z.coerce
            .number()
            .int()
            .positive('O ID do piloto deve ser um número positivo.'),
        }),
        response: {
          200: z.object({
            pilot_full_name: z.string(),
            latest_constructor_name: z.string(),
          }),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { driverId } = request.params
        const details = await getDriverAndCurrConstructor({ driverId })

        if (details === null) {
          return reply.code(404).send({
            error: `Piloto com ID ${driverId} não encontrado ou sem corridas registradas.`,
          })
        }

        return reply.code(200).send(details)
      } catch (error) {
        app.log.error(error, 'Erro na rota de piloto e construtora atual')
        reply.code(500).send({ error: 'Erro interno no servidor.' })
      }
    }
  )
}
