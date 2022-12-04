import { dbClient } from '../shared/capabilities/dbClient'

beforeAll(async () => {
  await dbClient.raw(
    'TRUNCATE TABLE animals.app_task, animals.app_event, animals.animal CASCADE'
  )
})

afterAll(async () => {
  await dbClient.destroy()
})
