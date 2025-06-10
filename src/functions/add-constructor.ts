import { knex } from '../database'

// Interface para os parâmetros da função de cadastro
interface AddConstructorParams {
  constructorRef: string
  name: string
  nationality: string
  url: string
}

/**
 * Cadastra uma nova construtora (escuderia) no banco de dados.
 * @returns Um objeto com o ID da nova construtora, ou null em caso de erro.
 */
export async function addConstructor({
  constructorRef,
  name,
  nationality,
  url,
}: AddConstructorParams) {
  try {
    const result = await knex.raw('SELECT * FROM add_constructor(?, ?, ?, ?)', [
      constructorRef,
      name,
      nationality,
      url,
    ])

    // Se a inserção foi bem-sucedida, a função SQL retorna uma linha com o novo ID.
    if (result.rows.length === 1) {
      return result.rows[0] // Ex: { new_constructor_id: 216 }
    }

    return null
  } catch (error) {
    console.error('Erro ao cadastrar construtora:', error)
    return null
  }
}
