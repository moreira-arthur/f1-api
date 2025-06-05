import fs from 'node:fs'
import path from 'node:path'

/**
 * Carrega um arquivo .sql da pasta ./db/sql/<subdir>/
 *
 * @param name Nome do arquivo SQL sem extensão (ex: 'criar_funcao_somar')
 * @param subdir Subdiretório dentro de /sql (ex: 'functions', 'tables')
 * @returns Conteúdo do arquivo SQL como string
 */
export function loadSQL(
  name: string,
  subdir:
    | 'functions'
    | 'tables'
    | 'views'
    | 'triggers'
    | 'inserts'
    | 'deletes'
    | 'selects' = 'functions'
): string {
  const filename = `${name}.sql`
  const fullPath = path.join(__dirname, '../../', 'db', 'sql', subdir, filename)
  try {
    return fs.readFileSync(fullPath, 'utf8')
  } catch (err) {
    throw new Error(
      `Erro ao carregar SQL (${subdir}/${filename}): ${(err as Error).message}`
    )
  }
}
