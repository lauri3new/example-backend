import { createIntegrationEvent } from '../../../shared/integration/integrationEvent'

export type AnimalType = 'dog' | 'cat' | 'elephant' | 'sloth'

export class Animal {
  constructor(readonly props:{
    id: string
    name: string
    type: AnimalType
    updatedAt: Date
  }) {}
}

type AnimalCreatedData = {
    id: string
  name: string
  type: AnimalType
}

export const createAnimalCreatedEvent = (data: AnimalCreatedData) => createIntegrationEvent({
  data,
  kind: 'animal.animal.created'
})
