import { Knex } from 'knex'
import { EventBus } from '../../../shared/capabilities/eventBus/eventBus'
import { MemoryEventTaskOutbox } from '../eventTaskOutbox'
import { EmailService } from '../infrastructureServices/emailService'
import { AnimalRepository } from '../repositories/animal'
import { TaskRepository } from '../repositories/task'
import { createAnimalApplicationService } from './animal'
import {
  createAnimalCreatedEventSendEmail
} from './eventListeners/animalCreated/animalCreatedEventSendEmail'
import {
  createAnimalCreatedEventSendEventBus
} from './eventListeners/animalCreated/animalCreatedEventSendEventBus'
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
    eventTaskOutbox: MemoryEventTaskOutbox
  }
}

export const createApplicationServices = (deps: ApplicationServicesProps) => ({
  animalApplicationService: createAnimalApplicationService(deps),
  taskApplicationService: createTaskApplicationService(deps),
  eventListeners: {
    animalCreatedSendEmail: createAnimalCreatedEventSendEmail(deps),
    animalCreatedSendEventBus: createAnimalCreatedEventSendEventBus(deps)
  }
})

export type ApplicationServices = ReturnType<typeof createApplicationServices>
