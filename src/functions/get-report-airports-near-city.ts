import { knex } from '../database'

// Interface para os parâmetros da função
interface GetReportAirportsNearCityParams {
  cityName: string
}

/**
 * Busca aeroportos (médios/grandes) a 100km de uma cidade brasileira.
 * @returns Um array com os aeroportos encontrados, ou null em caso de erro.
 */
export async function getReportAirportsNearCity({
  cityName,
}: GetReportAirportsNearCityParams) {
  try {
    const result = await knex.raw(
      'SELECT * FROM report_airports_near_city(?)',
      [cityName]
    )

    // A função RETURNS TABLE, então result.rows contém o array de resultados.
    return result.rows
  } catch (error) {
    console.error('Erro ao gerar relatório de aeroportos próximos:', error)
    return null
  }
}
