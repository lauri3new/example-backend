import { Knex } from 'knex'
import { EventBus } from '../../../shared/capabilities/eventBus'
import { MemoryEventTaskThing } from '../eventHandler'
import { EmailService } from '../infrastructureServices/emailService'
import { AnimalRepository } from '../repositories/animal'
import { TaskRepository } from '../repositories/task'
import { createAnimalApplicationService } from './animal'
import { createAnimalCreatedEventSendEmailListener } from './eventListeners/animalCreated/sendEmail'
import { createTaskApplicationService } from './task/task'

type ApplicationServicesProps = {
  capabilities: {
    dbClient: Knex
    eventBus: EventBus
  }
  repositories: {
    animalRepo: AnimalRepository
    taskRepo: TaskRepository
  }
  infrastructureServices: {
    emailService: EmailService
    eventTaskThing: MemoryEventTaskThing
  }
}

export const createApplicationServices = (deps: ApplicationServicesProps) => ({
  animalApplicationService: createAnimalApplicationService(deps),
  taskApplicationService: createTaskApplicationService(deps),
  eventListeners: {
    animalCreatedSendEmailListener: createAnimalCreatedEventSendEmailListener(deps)
  }
})

export type ApplicationServices = ReturnType<typeof createApplicationServices>
