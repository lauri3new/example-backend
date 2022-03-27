import { knex } from './knex/knex'

export const capabilities = {
  knex
}

export type Capabilities = typeof capabilities
