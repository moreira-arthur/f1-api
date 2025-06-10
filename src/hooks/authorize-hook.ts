import type { FastifyReply, FastifyRequest } from 'fastify'

export function authorize(allowedTypes: string[]) {
  // Esta função interna é o verdadeiro hook preHandler
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Neste ponto, o hook app.authenticate já rodou, então request.user existe.
    const userType = request.user.tipo

    console.log(
      `Verificando autorização: Usuário tipo '${userType}', Permitido: '${allowedTypes.join(', ')}'`
    )

    // Verificamos se o tipo do usuário está na lista de tipos permitidos
    if (!allowedTypes.includes(userType)) {
      // Se não estiver, retornamos um erro 403 Forbidden.
      // 401 Unauthorized = "Eu não sei quem você é."
      // 403 Forbidden = "Eu sei quem você é, mas você não tem permissão para estar aqui."
      return reply.code(403).send({
        error: 'Forbidden: Você não tem permissão para acessar este recurso.',
      })
    }

    // Se o usuário tem permissão, o hook termina e a requisição continua para o handler da rota.
  }
}
