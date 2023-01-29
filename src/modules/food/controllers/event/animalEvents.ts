import { NarrowEventByName } from '../../../../shared/capabilities/eventBus/eventBus'
import { AnimalIntegrationEvents } from '../../../animal/integration'
import { FoodApplicationService } from '../../applicationServices'

type FoodHTTPControllerDependencies = {
  applicationServices: {
    foodApplicationService: FoodApplicationService
  }
}

export const createFoodAnimalEventsController = (
  { applicationServices: { foodApplicationService } }: FoodHTTPControllerDependencies
) => ({
  saveEvent: (event: NarrowEventByName<AnimalIntegrationEvents, 'animal.animal.created'>) => foodApplicationService
    .commands.updateFoodRegister(event.data)
})

export type FoodAnimalEventsController = ReturnType<typeof createFoodAnimalEventsController>
