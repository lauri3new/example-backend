import { Knex } from 'knex'
import { Animal } from '../domain/animal'

type AnimalRepositoryDependencies = {
  capabilities: {
    dbClient: Knex
  }
}

type PutAnimalProps = Pick<Animal['props'], 'name' | 'type'> & { id: string }

export const createAnimalRepository = ({ capabilities: { dbClient } }: AnimalRepositoryDependencies) => ({
  get: async (id: string) => dbClient.select('*').from('animals.animal').where('id', id).first(),
  put: async (props: PutAnimalProps) => dbClient('animals.animal')
    .insert({ ...props, updatedAt: new Date() })
    .then(() => 1)
})

export type AnimalRepository = ReturnType<typeof createAnimalRepository>
