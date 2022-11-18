import { Express } from 'express'
import { EventBus } from '../shared/eventBus'
import { createAnimalApplicationService, ApplicationServices } from './applicationServices'
import { HasCapabilities } from './capabilities'
import { createAnimalHttpController } from './controllers/http'
import { HasRespositories } from './respositories'
import { createAnimalRepository } from './respositories/animal'

export const loadAnimalsModule = (
  deps: {
    app: Express,
    eventBus: EventBus,
    capabilities: HasCapabilities,
    overrideRepositories: Partial<HasRespositories>,
    overrideApplicationServices: Partial<ApplicationServices>
  }
) => {
  const animalRepo = {
    ...createAnimalRepository(deps.capabilities),
    ...deps.overrideRepositories
  }
  const animalApplicationService = {
    ...createAnimalApplicationService({ repositories: { animalRepo } }),
    ...deps.overrideApplicationServices
  }
  const controllers = createAnimalHttpController({ applicationServices: { animalApplicationService } })
  setInterval(() => {
    controllers.runTasksUnprocessedTasks()
  }, 1000)
  deps.app.get('/animals', controllers.httpGet)
  deps.app.put('/animals/:id', controllers.httpGet)
  deps.eventBus.on('event', controllers.handleEvent)
}
