import { Express } from 'express'
import { Knex } from 'knex'
import { EventBus } from '../../shared/capabilities/eventBus'
import { createApplicationServices, ApplicationServices } from './applicationServices/index'
import { createAnimalHttpController } from './controllers/http'
import { MemoryEventTaskThing } from './eventHandler'
import { emailService } from './infrastructureServices/emailService'
import { exposeApiToModules } from './integration'
import { HasRespositories } from './repositories'
import { createAnimalRepository } from './repositories/animal'
import { createTaskRepository } from './repositories/task'

export const loadAnimalsModule = (
  deps: {
    app: Express,
    capabilities: {
      dbClient: Knex
      eventBus: EventBus
    },
    overrideRepositories?: Partial<HasRespositories>,
    overrideApplicationServices?: Partial<ApplicationServices>,
    overrideInfrastructureServices?: Partial<any>
  }
) => {
  const { capabilities } = deps
  const repositories = {
    animalRepo: createAnimalRepository({ capabilities }),
    taskRepo: createTaskRepository({ capabilities }),
    ...deps.overrideRepositories
  }
  const eventTaskThing = new MemoryEventTaskThing({} as any, repositories.taskRepo)
  const infrastructureServices = {
    emailService,
    eventTaskThing,
    ...deps.overrideInfrastructureServices
  }
  const applicationServices = {
    ...createApplicationServices({
      capabilities,
      repositories,
      infrastructureServices
    }),
    ...deps.overrideApplicationServices
  }
  eventTaskThing.on('animal.animal.created', [
    applicationServices.eventListeners.animalCreatedSendEmailListener.listenerName,
    applicationServices.eventListeners.animalCreatedSendEmailListener.listener
  ])
  const controllers = createAnimalHttpController({ applicationServices })
  setInterval(() => {
    applicationServices.taskApplicationService.commands.runUnprocessedTasks()
  }, 1000)
  deps.app.get('/animals/:id', controllers.httpGet)
  deps.app.put('/animals/:id', controllers.httpPut)
  return exposeApiToModules({ applicationServices })
}
