import { knex } from '../database'

// Interface para os parâmetros da função
interface GetConstructorDashboardParams {
  constructorId: number
}

/**
 * Busca dados consolidados de dashboard para uma construtora.
 * @returns Um objeto com os dados, ou null caso não encontre registros.
 */
export async function getConstructorDashboard({
  constructorId,
}: GetConstructorDashboardParams) {
  try {
    const result = await knex.raw('SELECT * FROM dashboard_constructor(?)', [
      constructorId,
    ])

    // A função sempre retorna uma linha.
    if (result.rows.length === 1) {
      const data = result.rows[0]
      // Se a construtora não tiver corridas, os anos virão nulos.
      // Usamos isso para determinar se um resultado válido foi encontrado.
      if (data.primeiro_ano === null) {
        return null
      }
      return data
    }

    return null
  } catch (error) {
    console.error('Erro ao buscar dados de dashboard da construtora:', error)
    return null
  }
}
