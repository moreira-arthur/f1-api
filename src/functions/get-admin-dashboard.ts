import { knex } from '../database'

/**
 * Busca os totais gerais (pilotos, construtoras, temporadas).
 * @returns Um objeto com os totais, ou null em caso de erro.
 */
export async function getAdminDashboardTotals() {
  try {
    const result = await knex.raw('SELECT * FROM dashboard_admin_totals()')

    // A função sempre retorna uma única linha com os totais.
    if (result.rows.length === 1) {
      return result.rows[0]
    }

    // Este caso é improvável, mas é uma boa prática de segurança.
    return null
  } catch (error) {
    console.error('Erro ao buscar totais do dashboard de admin:', error)
    return null
  }
}
