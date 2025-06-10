import { knex } from '../database'

// Interface para os parâmetros da função
interface GetReportConstructorStatusCountParams {
  constructorId: number
}

/**
 * Busca a contagem de resultados por status para uma construtora específica.
 * @returns Um array com o relatório, ou null em caso de erro.
 */
export async function getReportConstructorStatusCount({
  constructorId,
}: GetReportConstructorStatusCountParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM report_constructor_status_count(?)',
      [constructorId]
    )

    return result.rows
  } catch (error) {
    console.error('Erro ao gerar relatório de status por construtora:', error)
    return null
  }
}
