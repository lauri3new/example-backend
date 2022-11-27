import { AnimalType } from '../../animal/domain/animal'
import { AnimalModuleAPI } from '../../animal/integration'
import { FoodRepository } from '../repositories/food'

export type AnimalApplicationServiceProps = {
  repositories: {
    foodRepo: FoodRepository
  }
  capabilities: {
    animalModuleAPI: AnimalModuleAPI
  }
}

export const createFoodApplicationService = ({
  repositories: { foodRepo },
  capabilities: { animalModuleAPI }
}: AnimalApplicationServiceProps) => ({
  queries: {
    getAllAnimalsFood: async () => {
      const registerItem = await foodRepo.getAllAnimalsFood()
      const foodWithAnimals = await Promise.all(registerItem.map(({ food, value, animalId }) => animalModuleAPI
        .getAnimal(animalId)
        .then(animal => ({
          animal: {
            id: animalId,
            ...animal
          },
          food,
          value
        }))))
      return foodWithAnimals
    }
  },
  commands: {
    updateFoodRegister: async (animal: {
      id: string
      name: string
      type: AnimalType
    }) => {
      const existingRegisterItem = await foodRepo.getForAnimal(animal.id)
      if (existingRegisterItem) {
        return 1
      }
      const foodMap = {
        dog: { food: 'biscuits', value: 5 },
        cat: { food: 'treats', value: 5 },
        elephant: { food: 'vegetables', value: 10 },
        sloth: { food: 'carrots', value: 5 }
      }
      const { food, value } = foodMap[animal.type]
      return foodRepo.updateRegister({
        id: animal.id,
        food,
        value
      })
    }
  }
})

export type FoodApplicationService = ReturnType<typeof createFoodApplicationService>

export type ApplicationServices = {
  applicationServices: {
    foodApplicationService: FoodApplicationService
  }
}
