import { knex } from '../database'

// Interface para definir os tipos dos parâmetros da função
interface GetDriverByForenameParams {
  forename: string
  constructorName: string
}

/**
 * Busca pilotos pelo primeiro nome e pelo nome da construtora.
 * A função SQL `get_driver_by_forename` retorna uma tabela (múltiplas linhas possíveis),
 * então esta função retorna um array de objetos.
 * @returns Um array com os pilotos encontrados ou null em caso de erro.
 */
export async function getDriverByForename({
  forename,
  constructorName,
}: GetDriverByForenameParams) {
  try {
    // Executa a função do PostgreSQL, passando os parâmetros de forma segura
    const result = await knex.raw(
      'SELECT * FROM get_driver_by_forename(?, ?)',
      [forename, constructorName]
    )

    // A função pode retornar múltiplos pilotos, então retornamos todas as linhas.
    // Se nenhum piloto for encontrado, a consulta retornará um array vazio.
    return result.rows
  } catch (error) {
    console.error('Erro ao buscar piloto por nome e construtora:', error)
    // Em caso de falha na consulta, retorna null
    return null
  }
}
