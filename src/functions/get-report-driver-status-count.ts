import { knex } from '../database'

// Interface para os parâmetros da função
interface GetReportDriverStatusCountParams {
  driverId: number
}

/**
 * Busca a contagem de resultados por status para um piloto específico.
 * @returns Um array com o relatório, ou null em caso de erro.
 */
export async function getReportDriverStatusCount({
  driverId,
}: GetReportDriverStatusCountParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM report_pilot_status_count(?)',
      [driverId]
    )

    return result.rows
  } catch (error) {
    console.error('Erro ao gerar relatório de status por piloto:', error)
    return null
  }
}
