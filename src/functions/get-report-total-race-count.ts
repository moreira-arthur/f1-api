import { knex } from '../database'

/**
 * Busca a contagem total de corridas.
 * @returns Um objeto com o total de corridas, ou null em caso de erro.
 */
export async function getReportTotalRaceCount() {
  try {
    const result = await knex.raw('SELECT * FROM report_total_race_count()')

    if (result.rows.length === 1) {
      return result.rows[0]
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar a contagem total de corridas:', error)
    return null
  }
}
