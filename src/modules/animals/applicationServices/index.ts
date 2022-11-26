import { Knex } from 'knex'
import { Left, Right } from 'light-fp/dist/Either'
import { EventBus } from '../../../shared/capabilities/eventBus'
import { fromNullable } from '../../../shared/lib/fromNullable'
import { checkAnimalType } from '../helpers'
import { EmailService } from '../infrastructureServices/emailService'
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
    get: (id: string) => fromNullable(animalRepo.get(id))
  },
  commands: {
    create: async (type: string, name?: string) => {
      const generateName = () => ['Coco', 'Froggy', 'Jumper', 'Sleepy'][Math.round(Math.random() * 10) % 4]
      const id = `animal_${Math.random()}${new Date().toISOString()}`
      const x = checkAnimalType(type).match(
        a => ({ type: 'left' as const, value: a }),
        b => ({ type: 'right' as const, value: b })
      )
      if (x.type === 'left') {
        return Left(x.value)
      }
      const trx = await dbClient.transaction()
      const animal = await animalRepo.put({ id, name: name || generateName(), type: x.value })
      const runTasks = await taskRepo.createAndProcess({
        eventType: 'animal.created',
        eventData: {
          id,
          name,
          type
        },
        tasks: [
          [{ type: 'send_email' }, emailService.send] as const,
          [{ type: 'emit_event' }, (event: any) => eventBus.emit('animal.created', event)] as const
        ]
      }, trx)
      runTasks()
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
