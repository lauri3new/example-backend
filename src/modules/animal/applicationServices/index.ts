import { randomUUID } from 'crypto'
import { Knex } from 'knex'
import { Left, Right } from 'light-fp/dist/Either'
import { EventBus, NarrowEventByName } from '../../../shared/capabilities/eventBus'
import { AnimalCreated } from '../domain/animal'
import { checkAnimalType } from '../helpers'
import { EmailService } from '../infrastructureServices/emailService'
import { AnimalIntegrationEvents } from '../integration'
import { AnimalRepository } from '../repositories/animal'
import { TaskRepository } from '../repositories/task'

export type AnimalApplicationServiceProps = {
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
  }
}

export const createAnimalApplicationService = ({
  repositories: { animalRepo, taskRepo },
  capabilities: { dbClient, eventBus },
  infrastructureServices: { emailService }
}: AnimalApplicationServiceProps) => ({
  queries: {
    get: (id: string) => animalRepo.get(id)
  },
  commands: {
    create: async (type: string, newName?: string) => {
      const generateName = () => ['Coco', 'Froggy', 'Jumper', 'Sleepy'][Math.round(Math.random() * 10) % 4]
      const id = `animal_${randomUUID()}`
      const x = checkAnimalType(type).match(
        a => ({ type: 'left' as const, value: a }),
        b => ({ type: 'right' as const, value: b })
      )
      if (x.type === 'left') {
        return Left(x.value)
      }
      const trx = await dbClient.transaction()
      const name = newName || generateName()
      const animal = await animalRepo.put({ id, name, type: x.value })
      // internal events
      const runTasks = await taskRepo.createAndProcess<AnimalCreated>({
        eventType: 'animal.created',
        eventData: {
          id,
          name,
          type: x.value
        },
        tasks: [
          [{ type: 'send_email' }, event => emailService.send(event).then(_ => {})] as const
        ]
      }, trx)
      // integration events
      const runIntegrationTasks = await taskRepo
        .createAndProcess<NarrowEventByName<AnimalIntegrationEvents, 'animal.animal.created'>>({
          eventType: 'animal.animal.created',
          eventData: {
            eventName: 'animal.animal.created',
            eventData: {
              id,
              name,
              type: x.value
            }
          },
          tasks: [
            [{ type: 'emit_event' }, event => eventBus.emit(event)] as const
          ]
        }, trx)
      await trx.commit()
      runTasks()
      runIntegrationTasks()
      return Right(animal)
    }
  }
})

export type AnimalApplicationService = ReturnType<typeof createAnimalApplicationService>

export type ApplicationServices = {
  applicationServices: {
    animalApplicationService: AnimalApplicationService
  }
}
