import Knex from 'knex'
import { knexConfig } from './config'

export const knex = Knex(knexConfig())
