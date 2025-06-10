import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { constructorRoute } from './routes/constructor-routes'
import { dashboardAdminRoute } from './routes/dashboard-admin-route'
import { dashboardConstructorRoute } from './routes/dashboard-constructor-route'
import { dashboardDriverRoute } from './routes/dashboard-driver-route'
import { driverRoute } from './routes/driver-routes'
import { helloRoute } from './routes/hello-route'
import { loginRoute } from './routes/login-route'
import { logoutRoute } from './routes/logout-route'
import { reportsRoute } from './routes/reports-routes'

export const app = fastify()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyJwt, { secret: env.SECRET })
app.register(fastifyCors)

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'F1 Stats Api',
      version: '0.2',
    },
    servers: [
      { url: 'http://localhost:3333', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
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
app.register(logoutRoute, {
  prefix: 'logout',
})

app.register(constructorRoute, {
  prefix: 'constructor',
})

app.register(dashboardDriverRoute, {
  prefix: 'dashboard/driver',
})
app.register(dashboardConstructorRoute, {
  prefix: 'dashboard/constructor',
})
app.register(dashboardAdminRoute, {
  prefix: 'dashboard/admin',
})
app.register(reportsRoute, {
  prefix: 'reports',
})
