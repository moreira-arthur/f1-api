import { knex } from '../database'

// Interface para os parâmetros da função
interface GetDriverAndCurrConstructorParams {
  driverId: number
}

/**
 * Busca o nome completo de um piloto e o nome de sua construtora mais recente.
 * @returns Um objeto com os dados, ou null se o piloto não for encontrado.
 */
export async function getDriverAndCurrConstructor({
  driverId,
}: GetDriverAndCurrConstructorParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM get_pilot_and_curr_constructor(?)',
      [driverId]
    )

    // A função retorna uma única linha.
    if (result.rows.length === 1) {
      const data = result.rows[0]
      // Se o piloto não tiver resultados, o nome virá nulo.
      // Tratamos isso como "não encontrado".
      if (data.pilot_full_name === null) {
        return null
      }
      return data
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar piloto e construtora atual:', error)
    return null
  }
}
