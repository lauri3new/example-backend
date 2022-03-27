import path from 'path'
import { knexSnakeCaseMappers } from 'objection'

export const knexConfig = () => {
  const client = 'pg'
  const pool = { min: 0, max: 10 }
  const migrations = {
    directory: path.join(__dirname, '../../../migrations'),
    tableName: 'knex_migrations'
  }
  const {
    host,
    username,
    user,
    password,
    database
  } = JSON.parse(process.env.DB_CONNECTION as string)

  return ({
    client,
    connection: {
      host,
      user: username || user,
      password,
      database
    },
    pool,
    migrations,
    seeds: {
      directory: path.join(__dirname, '../../../seeds')
    },
    ...knexSnakeCaseMappers()
  })
}
