import express, { ErrorRequestHandler, Router } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { logger } from './capabilities/logger'
import { bindRoutes } from './bindRoutes'
import { capabilities } from './capabilities'
import { createRepositories } from './repositories'
import { createAppServices } from './appServices'
import { createControllers } from './controller'

const repositories = createRepositories(capabilities)
// capabilities services
// event services
const appServices = createAppServices({ repositories })
// coordinator app services
const controllers = createControllers(appServices)

const app = express()

app.use(morgan('dev'))

app.use((req, res, next) => {
  if (['checkout-webhook', 'slack/events'].some(a => req.originalUrl.includes(a))) {
    next()
  } else {
    express.json()(req, res, next)
  }
})

app.use(cors())

app.options('*', cors() as any)

const appRouter = Router()

bindRoutes(appRouter, controllers)

app.use('*', appRouter)

app.get('*', (req, res) => res.send({
  error: 'not found'
}))

const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  logger.error({ err })
  res.status(500).send('Something broke!')
}

app.use(errorHandler)

app.listen(8080)
