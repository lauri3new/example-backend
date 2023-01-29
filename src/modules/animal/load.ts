import { Express } from 'express'
import { Knex } from 'knex'
import { EventBus } from '../../shared/capabilities/eventBus/eventBus'
import { createApplicationServices, ApplicationServices } from './applicationServices/index'
import { createAnimalHttpController } from './controllers/http'
import { MemoryEventTaskOutbox } from './eventTaskOutbox'
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
    config: {
      startWorker: boolean
    }
    overrideRepositories?: Partial<HasRespositories>,
    overrideApplicationServices?: Partial<ApplicationServices>,
    overrideInfrastructureServices?: Partial<any>
  }
) => {
  const { capabilities, config } = deps
  const repositories = {
    animalRepo: createAnimalRepository({ capabilities }),
    taskRepo: createTaskRepository({ capabilities }),
    ...deps.overrideRepositories
  }
  const eventTaskOutbox = new MemoryEventTaskOutbox({} as any, repositories.taskRepo)
  const infrastructureServices = {
    emailService,
    eventTaskOutbox,
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

  const controllers = createAnimalHttpController({ applicationServices })
  if (config.startWorker) {
    setInterval(() => {
      applicationServices.taskApplicationService.commands.runUnprocessedTasks()
    }, 1000)
  }

  eventTaskOutbox.on('animal.animal.created', [
    applicationServices.eventListeners.animalCreatedSendEmail.listenerName,
    applicationServices.eventListeners.animalCreatedSendEmail.listener
  ])
  eventTaskOutbox.on('animal.animal.created', [
    applicationServices.eventListeners.animalCreatedSendEventBus.listenerName,
    applicationServices.eventListeners.animalCreatedSendEventBus.listener
  ])
  eventTaskOutbox.on('animal.animal.created', )
  deps.app.get('/animals/:id', controllers.httpGet)
  deps.app.put('/animals/:id', controllers.httpPut)
  return exposeApiToModules({ applicationServices })
}
