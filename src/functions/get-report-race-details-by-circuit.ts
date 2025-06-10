import { knex } from '../database'

// Interface para os parâmetros da função
interface GetReportRaceDetailsByCircuitParams {
  circuitId: number
}

/**
 * Busca os detalhes das corridas realizadas em um circuito específico.
 * @returns Um array com os detalhes das corridas, ou null em caso de erro.
 */
export async function getReportRaceDetailsByCircuit({
  circuitId,
}: GetReportRaceDetailsByCircuitParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM report_race_details_by_circuit(?)',
      [circuitId]
    )

    // A função RETURNS TABLE, então result.rows contém o array de resultados.
    return result.rows
  } catch (error) {
    console.error('Erro ao gerar relatório de corridas por circuito:', error)
    return null
  }
}
