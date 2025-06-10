import { knex } from '../database'

// Interface para os parâmetros da função
interface GetConstructorDetailsByIdParams {
  constructorId: number
}

/**
 * Busca o nome de uma construtora e a contagem de seus pilotos.
 * @returns Um objeto com os detalhes, ou null se o ID não for encontrado ou em caso de erro.
 */
export async function getConstructorDetailsById({
  constructorId,
}: GetConstructorDetailsByIdParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM get_constructor_details_by_id(?)',
      [constructorId]
    )

    // A função retorna uma única linha.
    if (result.rows.length === 1) {
      const data = result.rows[0]
      // Se o ID da construtora não existir, o nome virá nulo.
      // Tratamos isso como "não encontrado".
      if (data.constructor_name === null) {
        return null
      }
      return data
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar detalhes da construtora:', error)
    return null
  }
}
