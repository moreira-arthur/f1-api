import { knex } from '../database'

// Interface para os parâmetros da função
interface GetDriverCareerTotalsParams {
  driverId: number
}

/**
 * Busca os totais da carreira de um piloto (pontos, vitórias, corridas).
 * @returns Um objeto com os totais, ou null em caso de erro.
 */
export async function getDriverCareerTotals({
  driverId,
}: GetDriverCareerTotalsParams) {
  try {
    const result = await knex.raw('SELECT * FROM dashboard_driver_total(?)', [
      driverId,
    ])

    // A função sempre retorna uma linha.
    if (result.rows.length === 1) {
      const data = result.rows[0]
      // Se o piloto não tiver corridas, total_corridas será 0.
      // Se total_pontos for nulo, a função coalesce no banco de dados
      // não foi usada, então podemos tratar aqui, retornando 0.
      if (data.total_pontos === null) {
        data.total_pontos = 0
      }
      return data
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar totais da carreira do piloto:', error)
    return null
  }
}
