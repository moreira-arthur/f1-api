import fs from 'node:fs'
import path from 'node:path'
import csv, { type Options as CsvParserOptions } from 'csv-parser'
import type { Knex } from 'knex'

const HEADER_MAPPINGS: Record<string, string> = {
  dob: 'dateofbirth',
  fp1_date: 'fp1date',
  fp2_date: 'fp2date',
  fp3_date: 'fp3date',
  fp1_time: 'fp1time',
  fp2_time: 'fp2time',
  fp3_time: 'fp3time',
  quali_date: 'qualidate',
  quali_time: 'qualitime',
  sprint_date: 'sprintdate',
  sprint_time: 'sprinttime',
  rank: 'ranking',
  wikipedia_link: 'wikipedialink',
  elevation_ft: 'elevationft',
  // Adicione outras regras de mapeamento aqui se necessário no futuro.
  // Ex: 'pos': 'position'
}
// --- ATUALIZAÇÃO 1: Adicionar a opção 'columnNames' ---
interface CustomParserOptions {
  separator?: string
  nullValue?: string | string[]
  columnNames?: string[] // Propriedade opcional para arquivos sem cabeçalho
}

// --- ATUALIZAÇÃO 2: Modificar a função seedTable para usar 'columnNames' ---
async function seedTable(
  knex: Knex,
  tableName: string,
  fileName: string,
  options: CustomParserOptions = {}
) {
  const { separator = ',', nullValue = '\\N', columnNames } = options
  const nullValues = Array.isArray(nullValue) ? nullValue : [nullValue]

  console.log(`⏳ Iniciando o seeding da tabela: ${tableName}...`)

  const data: Record<string, any>[] = []
  const filePath = path.join(__dirname, '..', 'data', fileName)

  await new Promise<void>((resolve, reject) => {
    const parserOptions: CsvParserOptions = {
      separator: separator,
      mapValues: ({ value }) => {
        return nullValues.includes(value) ? null : value
      },
    }

    // Lógica condicional: Se fornecemos os nomes das colunas, use-os.
    // Se não, use a lógica de mapeamento de cabeçalhos do arquivo.
    if (columnNames) {
      parserOptions.headers = columnNames
    } else {
      parserOptions.mapHeaders = ({ header }) => {
        const lowerHeader = header.toLowerCase()
        if (HEADER_MAPPINGS[lowerHeader]) {
          return HEADER_MAPPINGS[lowerHeader]
        }
        return lowerHeader.replace(/_/g, '')
      }
    }

    fs.createReadStream(filePath)
      .pipe(csv(parserOptions))
      .on('data', row => data.push(row))
      .on('end', () => {
        console.log(
          `✅ Arquivo ${fileName} lido com sucesso. ${data.length} registros encontrados.`
        )
        resolve()
      })
      .on('error', error => reject(error))
  })

  if (data.length === 0) {
    console.log(`⚠️ Nenhum dado para inserir na tabela ${tableName}.`)
    await knex(tableName).del()
    return
  }

  await knex(tableName).del()
  console.log(`🗑️ Registros antigos da tabela ${tableName} deletados.`)

  await knex.batchInsert(tableName, data, 1000)
  console.log(`🚀 Tabela ${tableName} populada com sucesso!`)
}

export async function seed(knex: Knex): Promise<void> {
  try {
    // --- ATUALIZAÇÃO 3: Definir as colunas e usar na chamada ---
    const geocitiesColumns = [
      'geonameid',
      'name',
      'asciiname',
      'alternatenames',
      'lat',
      'long',
      'featureclass',
      'featurecode',
      'country',
      'cc2',
      'admin1code',
      'admin2code',
      'admin3code',
      'admin4code',
      'population',
      'elevation',
      'dem',
      'timezone',
      'modificationdate',
    ]

    await seedTable(knex, 'seasons', 'seasons.csv')
    await seedTable(knex, 'status', 'status.csv')
    await seedTable(knex, 'circuits', 'circuits.csv')
    await seedTable(knex, 'constructors', 'constructors.csv')
    await seedTable(knex, 'driver', 'drivers.csv')
    await seedTable(knex, 'races', 'races.csv')
    await seedTable(knex, 'qualifying', 'qualifying.csv')
    await seedTable(knex, 'results', 'results.csv')
    await seedTable(knex, 'laptimes', 'lap_Times.csv')
    await seedTable(knex, 'driverstandings', 'driver_Standings.csv')
    await seedTable(knex, 'pitstops', 'pit_Stops.csv')
    await seedTable(knex, 'countries', 'countries.csv')
    await seedTable(knex, 'airports', 'airports.csv', { nullValue: '' })

    // A chamada para geocities15k agora inclui os nomes das colunas
    await seedTable(knex, 'geocities15k', 'cities15000.txt', {
      separator: '\t',
      nullValue: '',
      columnNames: geocitiesColumns,
    })

    console.log('\n🎉 Todos os dados foram carregados com sucesso!')
  } catch (error) {
    console.error('\n❌ Ocorreu um erro durante o processo de seeding:', error)
  }
}
