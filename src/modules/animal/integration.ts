import { ApplicationServices } from './applicationServices'
import { AnimalType } from './domain/animal'

export type AnimalIntegrationEvents = {
  eventName: 'animal.animal.created'
  eventData: {
    id: string
    name: string
    type: AnimalType
  }
} | {
  eventName: 'animal.animal.deleted'
  eventData: {
    id: string
  }
}

export const exposeApiToModules = (animalApplicationServices: ApplicationServices) => ({
  getAnimal: animalApplicationServices.applicationServices.animalApplicationService.queries.get
})

export type AnimalModuleAPI = ReturnType<typeof exposeApiToModules>
