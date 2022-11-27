import { FoodApplicationService } from '../applicationServices'
import { createFoodAnimalEventsController } from './event/animalEvents'
import { createFoodHttpController } from './http'

type FoodControllerDependencies = {
  applicationServices: {
    foodApplicationService: FoodApplicationService
  }
}

export const createFoodControllers = (deps: FoodControllerDependencies) => ({
  foodHttpController: createFoodHttpController(deps),
  foodAnimalEventsController: createFoodAnimalEventsController(deps)
})
