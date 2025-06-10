// src/hooks/auth-hook.ts

import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Hook de autenticação customizado que verifica o token JWT em cada requisição.
 * Ele usa request.jwtVerify(), que está disponível em tempo de execução.
 */
export async function authenticateHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // A função jwtVerify() faz todo o trabalho:
    // 1. Procura o token no header Authorization.
    // 2. Verifica a assinatura e a expiração.
    // 3. Se for válido, decodifica o payload e o anexa a `request.user`.
    // 4. Se for inválido, lança um erro, que será pego pelo catch.
    await request.jwtVerify()
  } catch (err) {
    // Se a verificação falhar, o plugin @fastify/jwt lança um erro.
    // Nós o capturamos e enviamos uma resposta 401 Unauthorized.
    reply.code(401).send({ error: 'Unauthorized: Token inválido ou expirado.' })
  }
}
