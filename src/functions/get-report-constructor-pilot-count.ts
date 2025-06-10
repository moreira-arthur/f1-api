import { knex } from '../database'

/**
 * Busca um relatório com a contagem de pilotos distintos para cada construtora.
 * @returns Um array com o relatório, ou null em caso de erro.
 */
export async function getReportConstructorPilotCount() {
  try {
    const result = await knex.raw(
      'SELECT * FROM report_constructors_pilot_count()'
    )

    // A função RETURNS TABLE, então result.rows contém o array de resultados.
    return result.rows
  } catch (error) {
    console.error(
      'Erro ao gerar relatório de contagem de pilotos por construtora:',
      error
    )
    return null
  }
}
