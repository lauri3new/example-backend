import { Knex } from 'knex'

type ZooRepositoryDependencies = {
  capabilities: {
    dbClient: Knex
  }
}

type CreateZooProps = { id: string }

export const createZooRepository = ({ capabilities: { dbClient } }: ZooRepositoryDependencies) => ({
  getAllAnimals: () => dbClient.select('*').from('zoo'),
  updateRegister: (props: CreateZooProps) => dbClient
    .update(props.id, { ...props, updatedAt: new Date() })
})

export type ZooRepository = ReturnType<typeof createZooRepository>
