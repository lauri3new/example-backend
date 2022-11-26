import { Express } from 'express'
import { Knex } from 'knex'
import { EventBus } from '../../shared/capabilities/eventBus'
import { createZooApplicationService, ApplicationServices } from './applicationServices'
import { createZooAnimalEventsController } from './controllers/event/animalEvents'
import { createZooRepository } from './repositories/zoo'
import { HasRespositories } from './repositories/index'

export const loadZooModule = (
  deps: {
    app: Express,
    eventBus: EventBus,
    capabilities: {
      dbClient: Knex
    },
    overrideRepositories?: Partial<HasRespositories>,
    overrideApplicationServices?: Partial<ApplicationServices>
  }
) => {
  const { capabilities } = deps
  const zooRepo = {
    ...createZooRepository({ capabilities }),
    ...deps.overrideRepositories
  }
  const zooApplicationService = {
    ...createZooApplicationService({ repositories: { zooRepo } }),
    ...deps.overrideApplicationServices
  }
  const controllers = createZooAnimalEventsController({ applicationServices: { zooApplicationService } })

  deps.eventBus.on('animal.animal_created', e => controllers.saveEvent(e).then(() => {}))
}
