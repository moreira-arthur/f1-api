import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { driverRoute } from './routes/driver-routes'
import { helloRoute } from './routes/hello-route'
import { loginRoute } from './routes/login-route'

export const app = fastify()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'F1 Stats Api',
      version: '0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(helloRoute, {
  prefix: 'hello',
})
app.register(driverRoute, {
  prefix: 'driver',
})
app.register(loginRoute, {
  prefix: 'login',
})
