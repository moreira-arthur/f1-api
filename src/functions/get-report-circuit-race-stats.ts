import { knex } from '../database'

/**
 * Busca um relatório com estatísticas de corrida para cada circuito.
 * @returns Um array com o relatório, ou null em caso de erro.
 */
export async function getReportCircuitRaceStats() {
  try {
    const result = await knex.raw('SELECT * FROM report_circuit_race_stats()')

    // A função RETURNS TABLE, então result.rows contém o array de resultados.
    return result.rows
  } catch (error) {
    console.error('Erro ao gerar relatório de estatísticas de circuito:', error)
    return null
  }
}
