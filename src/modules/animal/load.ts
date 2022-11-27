import { Express } from 'express'
import { Knex } from 'knex'
import { EventBus } from '../../shared/capabilities/eventBus'
import { createAnimalApplicationService, ApplicationServices } from './applicationServices'
import { createTaskApplicationService } from './applicationServices/task'
import { createAnimalHttpController } from './controllers/http'
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
  const infrastructureServices = {
    emailService,
    ...deps.overrideInfrastructureServices
  }
  const applicationServices = {
    animalApplicationService: createAnimalApplicationService({
      repositories, capabilities, infrastructureServices
    }),
    taskApplicationService: createTaskApplicationService({
      capabilities,
      infrastructureServices: { emailService },
      repositories
    }),
    ...deps.overrideApplicationServices?.applicationServices
  }
  const controllers = createAnimalHttpController({ applicationServices })
  setInterval(() => {
    applicationServices.taskApplicationService.commands.runUnprocessedTasks()
  }, 1000)
  deps.app.get('/animals/:id', controllers.httpGet)
  deps.app.put('/animals/:id', controllers.httpPut)
  return exposeApiToModules({ applicationServices })
}
