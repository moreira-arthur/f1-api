import { knex } from '../database'

// Interface para os parâmetros da função
interface GetDriverActiveYearsParams {
  driverId: number
}

/**
 * Busca o primeiro e o último ano de atividade de um piloto.
 * @returns Um objeto com o primeiro e último ano, ou null caso não encontre registros.
 */
export async function getDriverActiveYears({
  driverId,
}: GetDriverActiveYearsParams) {
  try {
    const result = await knex.raw('SELECT * FROM dashboard_driver_year(?)', [
      driverId,
    ])

    // A função sempre retorna uma linha
    if (result.rows.length === 1) {
      const data = result.rows[0]
      // Se o piloto não tiver corridas, os anos virão nulos.
      // Tratamos isso como "não encontrado" para simplificar a lógica na rota.
      if (data.primeiro_ano === null) {
        return null
      }
      return data
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar anos de atividade do piloto:', error)
    return null
  }
}
