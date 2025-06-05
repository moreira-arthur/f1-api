import { knex } from '../database'

interface LoginParams {
  user: string
  password: string
}


// Se for valido fazermos o log do login
// retornamos true
export async function login({ user, password }: LoginParams) {
  const result = await knex.raw('SELECT * FROM login_usuario(?,?)', [
    user,
    password,
  ])
  if (result.rows.length === 1) {
    await knex.raw('')
    // Se for valido fazermos o log do login
    return true
  }
  return false
}
