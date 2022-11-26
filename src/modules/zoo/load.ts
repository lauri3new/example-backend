import { Express } from 'express'
import { Knex } from 'knex'
import { EventBus } from '../../shared/capabilities/eventBus'
import { createZooApplicationService, ApplicationServices } from './applicationServices'
import { createZooAnimalEventsController } from './controllers/event/animalEvents'
import { createZooRepository } from './repositories/zoo'
import { HasRespositories } from './repositories/index'
import { AnimalModuleAPI } from '../animal/integration'

export const loadZooModule = (
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
    zooRepo: createZooRepository({ capabilities }),
    ...deps.overrideRepositories
  }
  const applicationServices = {
    zooApplicationService: createZooApplicationService({ repositories }),
    ...deps.overrideApplicationServices
  }
  const controllers = createZooAnimalEventsController({ applicationServices })

  capabilities.eventBus.on('animal.animal.created', e => controllers.saveEvent(e).then(() => {}))
}
