import { knexSnakeCaseMappers } from 'objection'
import knex from 'knex'

const knexConfig = () => {
  const client = 'pg'
  const pool = { min: 0, max: 10 }
  const {
    host,
    user,
    password,
    database
  } = JSON.parse(process.env.DB_CONNECTION as string)

  return ({
    client,
    connection: {
      host,
      user,
      password,
      database
    },
    pool,
    ...knexSnakeCaseMappers()
  })
}

export const dbClient = knex(knexConfig())
