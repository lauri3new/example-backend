import { DbClient } from '../capabilities/dbClient'

export type AnimalType = 'dog' | 'cat' | 'elephant' | 'sloth'

type Animal = {
  id: string
  name: string
  type: AnimalType
  updatedAt: Date
}

type AnimalRepositoryDependencies = {
  capabilities: {
    dbClient: DbClient
  }
}

type PutAnimalProps = Pick<Animal, 'name' | 'type'> & { id: string }

export const createAnimalRepository = ({ capabilities: { dbClient } }: AnimalRepositoryDependencies) => ({
  get: (id: string) => dbClient.get<Animal>(id),
  put: (props: PutAnimalProps) => dbClient
    .put<Animal>(props.id, { ...props, updatedAt: new Date() })
})

export type AnimalRepository = ReturnType<typeof createAnimalRepository>
