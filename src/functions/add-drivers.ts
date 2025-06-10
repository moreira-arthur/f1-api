import { knex } from '../database'

// Interface para os parâmetros da função de cadastro de piloto
interface AddDriverParams {
  driverRef: string
  number: number | null
  code: string | null
  forename: string
  surname: string
  dateOfBirth: string
  nationality: string
  url: string | null
}

/**
 * Cadastra um novo piloto no banco de dados.
 * @returns Um objeto com o ID do novo piloto, ou null em caso de erro.
 */
export async function addDriver({
  driverRef,
  number,
  code,
  forename,
  surname,
  dateOfBirth,
  nationality,
  url,
}: AddDriverParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM add_driver(?, ?, ?, ?, ?, ?, ?, ?)',
      [
        driverRef,
        number,
        code,
        forename,
        surname,
        dateOfBirth,
        nationality,
        url,
      ]
    )

    if (result.rows.length === 1) {
      return result.rows[0] // Ex: { new_driver_id: 856 }
    }

    return null
  } catch (error) {
    console.error('Erro ao cadastrar piloto:', error)
    return null
  }
}
