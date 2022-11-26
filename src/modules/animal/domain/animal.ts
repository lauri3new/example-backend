export type AnimalType = 'dog' | 'cat' | 'elephant' | 'sloth'

export class Animal {
  constructor(readonly props:{ id: string
    name: string
    type: AnimalType
    updatedAt: Date}) {}
}

export type AnimalCreated = {
  id: string
  name: string
  type: AnimalType
}
