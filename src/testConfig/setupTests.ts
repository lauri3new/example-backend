import { dbClient } from '../shared/capabilities/dbClient'

beforeAll(() => {})

afterAll(async () => {
  await dbClient.destroy()
})
