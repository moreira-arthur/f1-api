import { knex } from '../database'

// Interface para os parâmetros da função
interface GetDriverAnnualStatsParams {
  driverId: number
}

/**
 * Busca as estatísticas anuais de um piloto.
 * @returns Um array com as estatísticas de cada ano, ou null em caso de erro.
 */
export async function getDriverAnnualStats({
  driverId,
}: GetDriverAnnualStatsParams) {
  try {
    const result = await knex.raw('SELECT * FROM dashboard_driver_anual(?)', [
      driverId,
    ])

    // A função RETURNS TABLE, então result.rows é o array que queremos.
    // Se não houver dados, será um array vazio [].
    return result.rows
  } catch (error) {
    console.error('Erro ao buscar estatísticas anuais do piloto:', error)
    // Retorna null para sinalizar um erro de execução no banco de dados.
    return null
  }
}
