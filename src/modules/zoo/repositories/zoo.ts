import { Knex } from 'knex'

type ZooRepositoryDependencies = {
  capabilities: {
    dbClient: Knex
  }
}

type CreateZooProps = {
  id: string
  name: string
  type: string
}

export const createZooRepository = ({ capabilities: { dbClient } }: ZooRepositoryDependencies) => ({
  getAllAnimals: () => dbClient.select('*').from('zoo.register'),
  updateRegister: async (props: CreateZooProps) => dbClient('zoo.register')
    .insert({
      animalId: props.id,
      animalName: props.name,
      animalType: props.type
    })
})

export type ZooRepository = ReturnType<typeof createZooRepository>
