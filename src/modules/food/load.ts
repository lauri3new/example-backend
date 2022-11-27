import { Express } from 'express'
import { Knex } from 'knex'
import { EventBus } from '../../shared/capabilities/eventBus'
import { createFoodApplicationService, ApplicationServices } from './applicationServices'
import { createFoodRepository } from './repositories/food'
import { HasRespositories } from './repositories/index'
import { AnimalModuleAPI } from '../animal/integration'
import { createFoodControllers } from './controllers'

export const loadFoodModule = (
  deps: {
    app: Express,
    capabilities: {
      dbClient: Knex
      eventBus: EventBus
      animalModuleAPI: AnimalModuleAPI
    },
    overrideRepositories?: Partial<HasRespositories>,
    overrideApplicationServices?: Partial<ApplicationServices>
  }
) => {
  const { capabilities } = deps
  const repositories = {
    foodRepo: createFoodRepository({ capabilities }),
    ...deps.overrideRepositories
  }
  const applicationServices = {
    foodApplicationService: createFoodApplicationService({
      repositories,
      capabilities
    }),
    ...deps.overrideApplicationServices
  }
  const { foodAnimalEventsController, foodHttpController } = createFoodControllers({ applicationServices })

  capabilities.eventBus.on('animal.animal.created', async e => {
    await foodAnimalEventsController.saveEvent(e)
  })

  deps.app.get('/food-report', foodHttpController.httpGet)
}
