import { knex } from '../database'

// Interface para os parâmetros da função
interface GetDriverCircuitResumeParams {
  driverId: number
}

/**
 * Busca o resumo de desempenho de um piloto, agrupado por circuito.
 * @returns Um array com as estatísticas de cada circuito, ou null em caso de erro.
 */
export async function getDriverCircuitResume({
  driverId,
}: GetDriverCircuitResumeParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM dashboard_driver_resume_circuit(?)',
      [driverId]
    )

    // A função RETURNS TABLE, então result.rows é o array de resultados.
    // Se não houver dados, o resultado será um array vazio [].
    return result.rows
  } catch (error) {
    console.error('Erro ao buscar resumo por circuito do piloto:', error)
    // Retorna null para sinalizar um erro de execução no banco de dados.
    return null
  }
}
