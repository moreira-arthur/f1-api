// src/types/jwt-payload.d.ts

import '@fastify/jwt'

// Este arquivo "aumenta" os tipos do @fastify/jwt
declare module '@fastify/jwt' {
  // Aqui você define a estrutura do payload que você cria no login
  interface FastifyJWT {
    payload: {
      userId: number // ou o tipo do seu ID
      tipo: string
      idOriginal: number
    }
    // E aqui você define o formato final de request.user
    user: {
      userId: number // ou o tipo do seu ID
      tipo: string
    }
  }
}
