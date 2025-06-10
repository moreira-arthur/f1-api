import { knex } from '../database'

// Interface para os parâmetros da função
interface GetDriverAndConstructorParams {
  driverId: number
}

/**
 * Busca o nome completo de um piloto e o nome de sua última construtora.
 * @returns Um objeto com nome do piloto e da construtora, ou null em caso de erro.
 */
export async function getDriverAndConstructor({
  driverId,
}: GetDriverAndConstructorParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM get_driver_and_constructor(?)',
      [driverId]
    )

    // Funções com parâmetros OUT retornam uma única linha de resultado
    if (result.rows.length === 1) {
      const data = result.rows[0]
      // Se o ID do piloto não existir, o nome virá nulo.
      // Tratamos isso como "não encontrado" retornando null.
      if (data.pilot_full_name === null) {
        return null
      }
      return data
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar piloto e construtora:', error)
    return null
  }
}
