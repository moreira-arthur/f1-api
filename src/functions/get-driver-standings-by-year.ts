import { knex } from '../database'

// Interface para os parâmetros da função
interface GetDriverStandingsByYearParams {
  year: number
}

/**
 * Busca a classificação de pilotos de um determinado ano.
 * @returns Um array com a classificação, ou null em caso de erro.
 */
export async function getDriverStandingsByYear({
  year,
}: GetDriverStandingsByYearParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM get_driver_standings_by_year(?)',
      [year]
    )

    // A função RETURNS TABLE, então result.rows contém o array de resultados.
    return result.rows
  } catch (error) {
    console.error('Erro ao buscar classificação de pilotos por ano:', error)
    return null
  }
}
