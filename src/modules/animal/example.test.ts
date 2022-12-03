import { dbClient } from '../../shared/capabilities/dbClient'

test('test', async () => {
  const x = await dbClient('animals.app_task').select('*')
  expect(1).toEqual(1)
})
