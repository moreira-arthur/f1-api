import { knex } from '../database'

interface LogActivityParams {
  userId: number
  activityType: 'LOGIN' | 'LOGOUT'
}

export async function log({ userId, activityType }: LogActivityParams) {
  try {
    const result = await knex.raw('SELECT log_register(?,?) as userid', [
      userId,
      activityType,
    ])

    if (result.rows.length > 0) {
      return result.rows[0].userid
    }

    return null
  } catch (error) {
    console.error(
      `Erro ao registrar atividade '${activityType}' para o usuário ${userId}:`,
      error
    )
    return null
  }
}
