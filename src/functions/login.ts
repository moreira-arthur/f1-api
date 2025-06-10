import { knex } from '../database'
import { log } from './log-activity'

interface LoginParams {
  user: string
  password: string
}

// Se for valido fazermos o log do login
// retornamos true
export async function login({ user, password }: LoginParams) {
  try {
    const result = await knex.raw('SELECT * FROM login_usuario(?,?)', [
      user,
      password,
    ])
    if (result.rows.length === 1) {
      return result.rows[0]
    }
    return null
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error)
    return null
  }
}
