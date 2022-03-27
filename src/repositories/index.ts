import { Knex } from 'knex'
import { createProductRepository } from './product'

type CreateRepositoriesProps = {
  knex: Knex
}

export const createRepositories = (capabilities: CreateRepositoriesProps) => ({
  product: createProductRepository(capabilities)
})

export type Repositories = ReturnType<typeof createRepositories>
