import { knex } from '../database'

// Interface para os parâmetros da função
interface GetRacesByYearParams {
  year: number
}

/**
 * Busca a lista de corridas de um determinado ano.
 * @returns Um array com as corridas do ano, ou null em caso de erro.
 */
export async function getRacesByYear({ year }: GetRacesByYearParams) {
  try {
    const result = await knex.raw('SELECT * FROM get_races_by_year(?)', [year])

    // A função RETURNS TABLE, então result.rows contém o array de resultados.
    // Se não houver corridas no ano, o resultado será um array vazio [].
    return result.rows
  } catch (error) {
    console.error('Erro ao buscar corridas por ano:', error)
    // Retorna null para sinalizar um erro de execução no banco de dados.
    return null
  }
}
