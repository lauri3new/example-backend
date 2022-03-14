import { Right } from 'light-fp/dist/Either'
import { fromNullable } from '../../lib'
import { checkAnimalType } from '../helpers'
import { AnimalRepository, AnimalType } from '../respositories/animal'

export type AnimalApplicationServiceProps = {
  repositories: {
    animalRepo: AnimalRepository
  }
}

export const createAnimalApplicationService = ({ repositories: { animalRepo } }: AnimalApplicationServiceProps) => ({
  queries: {
    get: (id: string) => fromNullable(animalRepo.get(id))
  },
  commands: {
    create: (type: string, name?: string) => {
      const generateName = () => ['Coco', 'Froggy', 'Jumper', 'Sleepy'][Math.round(Math.random() * 10) % 4]
      const id = `animal_${Math.random()}${new Date().toISOString()}`
      return checkAnimalType(type)
        .flatMap(checkedType => Right(animalRepo.put({ id, name: name || generateName(), type: checkedType })))
    }
  }
})

export type AnimalApplicationService = ReturnType<typeof createAnimalApplicationService>