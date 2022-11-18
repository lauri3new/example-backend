import { DbClient } from '../capabilities/dbClient'
import { Animal } from '../domain/animal'

type AnimalRepositoryDependencies = {
  capabilities: {
    dbClient: DbClient
  }
}

type PutAnimalProps = Pick<Animal['props'], 'name' | 'type'> & { id: string }

export const createAnimalRepository = ({ capabilities: { dbClient } }: AnimalRepositoryDependencies) => ({
  get: (id: string) => dbClient.get(id),
  put: (props: PutAnimalProps) => dbClient
    .put(props.id, { ...props, updatedAt: new Date() })
})

export type AnimalRepository = ReturnType<typeof createAnimalRepository>
