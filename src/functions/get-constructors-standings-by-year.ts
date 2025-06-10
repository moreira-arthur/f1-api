import { knex } from '../database'

// Interface para os parâmetros da função
interface GetConstructorStandingsByYearParams {
  year: number
}

/**
 * Busca a classificação de construtores de um determinado ano.
 * @returns Um array com a classificação, ou null em caso de erro.
 */
export async function getConstructorStandingsByYear({
  year,
}: GetConstructorStandingsByYearParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM get_constructor_standings_by_year(?)',
      [year]
    )

    // A função RETURNS TABLE, então result.rows contém o array de resultados.
    return result.rows
  } catch (error) {
    console.error(
      'Erro ao buscar classificação de construtores por ano:',
      error
    )
    return null
  }
}
