import { dbClient } from '../shared/capabilities/dbClient'
import { eventBus } from '../app'

const TABLES_TO_NOT_TRUNCATE = [
  'knex_migrations',
  'knex_migrations_lock',
  'user',
  'scope',
  'sessions'
]

beforeAll(async () => {
  const tableNames = await dbClient.raw(
    `select table_schema as schema, table_name as table
    from information_schema.tables
    where table_schema not in ('information_schema', 'pg_catalog')
    and table_schema not like 'pg_*'`
  )

  const truncateStatement = tableNames.rows.map((row: { table: string, schema: string }) => {
    const { table, schema } = row
    if (!TABLES_TO_NOT_TRUNCATE.includes(table)) {
      return `TRUNCATE ${schema}.${table} CASCADE;`
    }
    return ''
  })
  await dbClient.raw(
    truncateStatement.join('')
  )
})

afterAll(async () => {
  // await dbClient.destroy()
  eventBus.stop()
})
