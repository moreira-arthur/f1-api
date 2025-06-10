import { knex } from '../database'

// Interface para os parâmetros da função
interface GetReportDriverPointsByRaceParams {
  driverId: number
}

/**
 * Busca um relatório de pontos por corrida para um piloto específico.
 * @returns Um array com os detalhes das corridas, ou null em caso de erro.
 */
export async function getReportDriverPointsByRace({
  driverId,
}: GetReportDriverPointsByRaceParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM report_pilot_points_by_race(?)',
      [driverId]
    )

    return result.rows
  } catch (error) {
    console.error('Erro ao gerar relatório de pontos por corrida:', error)
    return null
  }
}
