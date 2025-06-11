import type { Knex } from 'knex'
// Verifique se este caminho de importação ainda é válido a partir da sua pasta de seeds.
// Se as pastas 'migrations' e 'seeds' estão no mesmo nível, o caminho deve estar correto.
import { loadSQL } from '../../src/functions/load-sql-file'

export async function seed(knex: Knex): Promise<void> {
  console.log('Iniciando o seed de usuários...')

  // 1. Limpa os dados existentes (lógica da antiga função 'down')
  // É uma boa prática garantir que a tabela esteja vazia antes de inserir novos dados.
  console.log('Deletando dados de usuários existentes...')
  const deleteSql = loadSQL('unpopulate-users', 'deletes')
  await knex.raw(deleteSql)
  console.log('Dados de usuários deletados.')

  // 2. Insere os novos dados (lógica da antiga função 'up')
  console.log('Populando a tabela de usuários...')
  const insertSql = loadSQL('populate-users', 'inserts')
  await knex.raw(insertSql)
  console.log('Tabela de usuários populada com sucesso!')
}
