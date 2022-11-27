/* eslint-disable no-console */
import express, { json } from 'express'
import { loadAnimalsModule } from './modules/animal/load'
import { loadFoodModule } from './modules/food/load'
import { dbClient } from './shared/capabilities/dbClient'
import { MemoryEventBus } from './shared/capabilities/eventBus'

const app = express()

const eventBus = new MemoryEventBus({})

const capabilities = {
  dbClient,
  eventBus
}

app.use(json())

const animalModuleAPI = loadAnimalsModule({
  app,
  capabilities
})

loadFoodModule({
  app,
  capabilities: {
    ...capabilities,
    animalModuleAPI
  }
})

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

app.listen(8080, () => console.log('app is listening on port 8080'))
