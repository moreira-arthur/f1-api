import { knex } from '../database'

/**
 * Busca um relatório de resultados de corrida agrupados por status.
 * @returns Um array com o relatório, ou null em caso de erro.
 */
export async function getReportResultsByStatus() {
  try {
    const result = await knex.raw('SELECT * FROM report_results_by_status()')

    // A função RETURNS TABLE, então result.rows contém o array de resultados.
    return result.rows
  } catch (error) {
    console.error('Erro ao gerar relatório de resultados por status:', error)
    return null
  }
}
