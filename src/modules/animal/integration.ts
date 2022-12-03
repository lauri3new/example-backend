import { ApplicationServices } from './applicationServices/animal'
import { AnimalType } from './domain/animal'

export type AnimalIntegrationEvents = {
  id: string
  kind: 'animal.animal.created'
  data: {
    id: string
    name: string
    type: AnimalType
  }
  createdAt: Date
} | {
  id: string
  kind: 'animal.animal.deleted'
  data: {
    id: string
  }
  createdAt: Date
}

export const exposeApiToModules = (animalApplicationServices: ApplicationServices) => ({
  getAnimal: animalApplicationServices.applicationServices.animalApplicationService.queries.get
})

export type AnimalModuleAPI = ReturnType<typeof exposeApiToModules>
