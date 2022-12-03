import { randomUUID } from 'crypto'
import { Knex } from 'knex'
import { Left, Right } from 'light-fp/dist/Either'
import { EventBus } from '../../../../shared/capabilities/eventBus'
import { createAnimalCreatedEvent } from '../../domain/animal'
import { MemoryEventTaskThing } from '../../eventHandler'
import { checkAnimalType } from '../../helpers'
import { EmailService } from '../../infrastructureServices/emailService'
import { AnimalRepository } from '../../repositories/animal'
import { TaskRepository } from '../../repositories/task'

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
    eventTaskThing: MemoryEventTaskThing
  }
}

export const createAnimalApplicationService = ({
  repositories: { animalRepo },
  capabilities: { dbClient },
  infrastructureServices: { eventTaskThing }
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

      const {
        commit
      } = await eventTaskThing.startEmit(createAnimalCreatedEvent({
        id,
        name,
        type: x.value
      }), trx)

      await commit()

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
