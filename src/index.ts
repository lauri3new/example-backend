import express, { json, Router } from 'express'
import { createAnimalHttpController } from './animals/controllers/http'
import { createAnimalApplicationService } from './animals/applicationServices'
import { dbClient } from './animals/capabilities/dbClient'
import { createAnimalRepository } from './animals/respositories/animal'
import { bindRoutes } from './bindRoutes'

const app = express()

const capabilities = {
  dbClient
}

const repositories = {
  animalRepo: createAnimalRepository({ capabilities })
}

const applicationServices = {
  animalApplicationService: createAnimalApplicationService({ repositories })
}

const controllers = {
  httpAnimalController: createAnimalHttpController({ applicationServices })
}

const routes = bindRoutes(Router(), controllers)

app.use(json())

app.use(routes)

app.use('*', (req, res) => {
  res.status(404).send({
    message: 'not found'
  })
})

app.use('*', (req: any, res: any, next: any, error: any) => {
  console.log(error)
  res.status(500).send({
    message: 'doh'
  })
})

app.listen(3000, () => console.log('app is listening on port 3000'))
