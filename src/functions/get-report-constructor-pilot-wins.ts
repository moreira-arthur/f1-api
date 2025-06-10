import { knex } from '../database'

// Interface para os parâmetros da função
interface GetReportConstructorPilotWinsParams {
  constructorId: number
}

/**
 * Busca a contagem de vitórias por piloto para uma construtora específica.
 * @returns Um array com os pilotos e suas vitórias, ou null em caso de erro.
 */
export async function getReportConstructorPilotWins({
  constructorId,
}: GetReportConstructorPilotWinsParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM report_constructor_pilot_wins(?)',
      [constructorId]
    )

    return result.rows
  } catch (error) {
    console.error(
      'Erro ao gerar relatório de vitórias de pilotos por construtora:',
      error
    )
    return null
  }
}
